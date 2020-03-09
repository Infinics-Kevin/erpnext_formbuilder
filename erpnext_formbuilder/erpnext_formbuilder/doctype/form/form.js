// Copyright (c) 2020, Havenir Solutions and contributors
// For license information, please see license.txt

frappe.ui.form.on("Form", {
  refresh: function(frm) {
    if (frm.doc.fields) {
      let form_fields = JSON.parse(frm.doc.fields);
      jQuery(function($) {
        var fbRender = $("#fb-test-render"),
          formData = form_fields;
        var formRenderOpts = {
          formData,
          dataType: "js"
        };

        $(fbRender).formRender(formRenderOpts);
      });
      if (frm.doc.docstatus == 1 || frm.doc.docstatus == -1) {
        for (let i in form_fields) {
          if (form_fields[i].type == "autocomplete") {
            document.getElementById(
              form_fields[i].name + "-input"
            ).readOnly = true;
          } else if (form_fields[i].type == "checkbox-group") {
            for (let j in form_fields[i].values) {
              document.getElementById(
                form_fields[i].name + "-" + j
              ).disabled = true;
            }
          } else if (form_fields[i].type == "file") {
            document.getElementById(form_fields[i].name).disabled = true;
          } else if (
            form_fields[i].type == "header" ||
            form_fields[i].type == "paragraph"
          ) {
          } else if (form_fields[i].type == "radio-group") {
            for (let j in form_fields[i].values) {
              document.getElementById(
                form_fields[i].name + "-" + j
              ).disabled = true;
            }
          } else {
            document.getElementById(form_fields[i].name).readOnly = true;
          }
        }
      }
    }
  },

  before_save: function(frm) {
    let form_fields = JSON.parse(frm.doc.fields);
    for (let i in form_fields) {
      form_fields[i].value = $("#" + form_fields[i].name).val();
    }
    frm.doc.fields = JSON.stringify(form_fields);
    frm.refresh_field("fields");
  },

  form_name: function(frm) {
    if (frm.doc.form_name) {
      frappe
        .call(
          "erpnext_formbuilder.erpnext_formbuilder.doctype.form_builder.form_builder.get_form_builder",
          {
            doc_name: frm.doc.form_name
          }
        )
        .then(r => {
          for (let i in r.message) {
            r.message[i].value = "";
          }
          frm.doc.fields = JSON.stringify(r.message);
          frm.refresh_field("fields");
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
