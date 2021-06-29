'use strict';
var initJsonKeyValueWidget = function(fieldName, inlinePrefix) {
    // ignore inline templates
    // if fieldName contains "__prefix__"
    if(fieldName.indexOf('__prefix__') > -1){
        return;
    }

    var $ = django.jQuery;

    // processing inlines
    if(fieldName.indexOf('inline') > -1){
        var inlineClass = $('#id_'+fieldName).parents('.inline-related').attr('class');
        // if using TabularInlines stop here
        // TabularInlines not supported
        if (inlineClass.indexOf('tabular') > -1) {
            return;
        }
    }

    // reusable function that retrieves a template even if ID is not correct
    // (written to support inlines)
    var retrieveTemplate = function(templateName, fieldName){
        var template = $('#'+templateName+'-'+fieldName);
        // if found specific template return that
        if(template.length){
            return template.html();
        }
        else{
            // get fallback template
            var html = $('.'+templateName+'-inline').html();
            // replace all occurrences of __prefix__ with fieldName
            // and return
            html = html.replace(/__prefix__/g, inlinePrefix);
            return html;
        }
    };

    // reusable function that compiles the UI
    var compileUI = function(params){
        var fieldId = 'id_' + fieldName,
            originalTextarea = $('#' + fieldId),
            originalValue = originalTextarea.val(),
            originalContainer = originalTextarea.parents('.form-row').eq(0),
            errorHtml = originalContainer.find('.errorlist').html(),
            jsonData = {'': ''};

        if(originalValue !== '' && originalValue !== '{}'){
            // manage case in which textarea is blank
            try{
                jsonData = JSON.parse(originalValue);
            }
            catch(e){
                alert('invalid JSON:\n'+e);
                return false;
            }
        }

        var fieldData = {
                'id': fieldId,
                'label': originalContainer.find('label').text(),
                'name': fieldName,
                'value': originalTextarea.val(),
                'help': originalContainer.find('.help').text(),
                'errors': errorHtml,
                'data': jsonData
            },
            // compile template
            uiHtml = retrieveTemplate('flat-json-ui-template', fieldName),
            compiledUiHtml = _.template(uiHtml)(fieldData);

        // this is just to DRY up a bit
        if(params && params.replaceOriginal === true){
            // remove original textarea to avoid having two textareas with same ID
            originalTextarea.remove();
            // inject compiled template and hide original
            originalContainer.after(compiledUiHtml).hide();
        }

        return compiledUiHtml;
    };

    // generate UI
    compileUI({ replaceOriginal: true });

    var $json = $('#id_'+fieldName).parents('.flat-json');

    // reusable function that updates the textarea value
    var updateTextarea = function(container) {
        // init empty json object
        var newValue = {},
            rawTextarea = container.find('textarea'),
            rows = container.find('.form-row');

        // loop over each object and populate json
        rows.each(function() {
            var inputs = $(this).find('input'),
                key = inputs.eq(0).val(),
                value = inputs.eq(1).val();
            newValue[key] = value;
        });

        // update textarea value
        $(rawTextarea).val(JSON.stringify(newValue, null, 4));
    };

    // update textarea whenever a field changes
    $json.delegate('input[type=text]', 'input propertychange', function() {
        updateTextarea($json);
    });
};

django.jQuery(function ($) {
    // support inlines
    // bind only once
    if(typeof django.jsonWidgetBoundInlines === 'undefined'){
        $('form').delegate('.inline-group .add-row a', 'click', function() {
            var jsonOriginalTextareas = $(this).parents('.inline-group').eq(0).find('.flat-json-original-textarea');
            // if module contains .flat-json-original-textarea
            if(jsonOriginalTextareas.length > 0){
                // loop over each inline
                $(this).parents('.inline-group').find('.inline-related').each(function(e, i){
                    var prefix = i;
                    // loop each textarea
                    $(this).find('.flat-json-original-textarea').each(function(){
                        // cache field name
                        var fieldName = $(this).attr('name');
                        // ignore templates
                        // if name attribute contains __prefix__
                        if(fieldName.indexOf('prefix') > -1){
                            // skip to next
                            return;
                        }
                        initJsonKeyValueWidget(fieldName, prefix);
                    });
                });
            }
        });
        django.jsonWidgetBoundInlines = true;
    }
});
