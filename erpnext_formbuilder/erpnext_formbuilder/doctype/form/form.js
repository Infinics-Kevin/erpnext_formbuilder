// Copyright (c) 2020, Havenir Solutions and contributors
// For license information, please see license.txt

frappe.ui.form.on("Form", {
	refresh: function(frm){
		console.log('Doc status:',frm.doc.docstatus)
		if (frm.doc.fields){
			let form_fields = JSON.parse(frm.doc.fields)
			jQuery(function($) {
				var fbRender = $("#fb-test-render"),
					formData = form_fields;
				var formRenderOpts = {
					formData,
					dataType: "js"
				};

				$(fbRender).formRender(formRenderOpts);
			});
			if (frm.doc.docstatus == 1 || frm.doc.docstatus == -1){
				for (var i in form_fields){
					document.getElementById(form_fields[i].name).readOnly = true;
					console.log(form_fields[i].name)
				}
			}
		}
	},

	before_save: function(frm){
		let form_fields = JSON.parse(frm.doc.fields)
		for (let i in form_fields){
			form_fields[i].value =$('#' + form_fields[i].name).val()
		}
		console.log(form_fields) 
		frm.doc.fields = JSON.stringify(form_fields);
		frm.refresh_field('fields');
	},

  form_name: function(frm) {
    if (frm.doc.form_name) {
      console.log("form name:", frm.doc.form_name);
      frappe
        .call(
          "erpnext_formbuilder.erpnext_formbuilder.doctype.form_builder.form_builder.get_form_builder",
          {
            doc_name: frm.doc.form_name
          }
        )
        .then(r => {
					console.log(r.message);
					for (let i in r.message){
						r.message[i].value="";
						console.log(r.message[i])
					}
					frm.doc.fields = JSON.stringify(r.message);
					frm.refresh_field('fields');
          jQuery(function($) {
            var fbRender = $("#fb-test-render"),
              formData = r.message;
            var formRenderOpts = {
              formData,
              dataType: "js"
            };

            $(fbRender).formRender(formRenderOpts);
          });
        });
    } else {
      jQuery(function($) {
        var fbRender = $("#fb-test-render"),
          formData = [];
        var formRenderOpts = {
          formData,
          dataType: "js"
        };

        $(fbRender).formRender(formRenderOpts);
      });
    }
  }
});
