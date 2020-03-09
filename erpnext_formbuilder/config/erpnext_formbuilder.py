from frappe import _


def get_data():
    return [
        {
            'label': _('Documents'),
            'items': [
                {
                    'type': 'page',
                    'name': 'form-builder',
                    'label': 'Form Builder'
                },
                {
                    'type': 'doctype',
                    'name': 'Form Builder',
                    'label': 'Form Templates',
                },
                {
                    'type': 'doctype',
                    'name': 'Form'
                }
            ]
        }
    ]
