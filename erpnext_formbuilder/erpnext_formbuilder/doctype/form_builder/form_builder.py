# -*- coding: utf-8 -*-
# Copyright (c) 2020, Havenir Solutions and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import json


class FormBuilder(Document):
    pass


@frappe.whitelist()
def create_form_builder(doc_name, fields):
    form_list = frappe.get_list('Form Builder',
                                filters={
                                    'name': doc_name
                                })
    if form_list:
        frappe.throw('{} already exists'.format(doc_name))

    new_form = frappe.get_doc({
        'doctype': 'Form Builder',
        'form_name': doc_name,
    })
    y = json.loads(fields)
    print('Type after json.loads:', type(y))
    for field in y:
        print('field name:',field['name'])
        new_form.append('fields', {
            'field_name': field['name'],
            'field_type': field['type'],
            'value': json.dumps(field)
        })

    new_form.save()

    return '{} form created from py method'.format(doc_name)


@frappe.whitelist()
def get_form_builder(doc_name):
    form = frappe.get_doc('Form Builder', doc_name)
    fields = []
    for field in form.fields:
        fields.append(json.loads(field.value))
    return fields


@frappe.whitelist()
def update_form_builder(doc_name, fields):
    frappe.msgprint('Updated')
    form = frappe.get_doc('Form Builder', doc_name)
    form.fields = None
    y = json.loads(fields)
    print('Type after json.loads:', type(y))
    for field in y:
        print('field_name:',field['name'])
        form.append('fields', {
            'field_name': field['name'],
            'field_type': field['type'],
            'value': json.dumps(field)
        })
    form.save()
    return 'Updated'