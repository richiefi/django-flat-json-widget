django-flat-json-widget
=======================

This will be a dramatically simplified version of [https://github.com/openwisp/django-flat-json-widget]
to be used as a Django Admin widget for key-value pairs with given keys.

It offers a widget to manipulate a flat JSON object made of simple keys and values.

Usage
-----

Add ``flat_json_widget`` to ``INSTALLED_APPS``:

.. code-block:: python

    INSTALLED_APPS = [
        # other apps...
        'flat_json_widget',
    ]

Then load the widget where you need it, for example, here's how to use it in the
django admin site:

.. code-block:: python

    from django.contrib import admin
    from django import forms
    from .models import JsonDocument

    from flat_json_widget.widgets import FlatJsonWidget


    class JsonDocumentForm(forms.ModelForm):
        class Meta:
            widgets = {
                'content': FlatJsonWidget
            }


    @admin.register(JsonDocument)
    class JsonDocumentAdmin(admin.ModelAdmin):
        list_display = ['name']
        form = JsonDocumentForm

Installing for development
--------------------------

Install your forked repo:

.. code-block:: shell

    git clone git://github.com/<your_fork>/django-flat-json-widget
    cd django-flat-json-widget/
    python setup.py develop

Install development dependencies:

.. code-block:: shell

    pip install -e .[test]
    npm install -g jslint stylelint

Create database:

.. code-block:: shell

    cd tests/
    ./manage.py migrate
    ./manage.py createsuperuser

Launch development server:

.. code-block:: shell

    ./manage.py runserver 0.0.0.0:8000

You can access the admin interface at http://127.0.0.1:8000/admin/.

Run tests with:

.. code-block:: shell

    ./runtests.py

Run quality assurance tests with:

.. code-block:: shell

    ./run-qa-checks
