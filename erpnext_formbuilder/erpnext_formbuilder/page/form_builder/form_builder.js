frappe.pages["form-builder"].on_page_load = function(wrapper) {
  var page = frappe.ui.make_app_page({
    parent: wrapper,
    title: "Form Builder",
    single_column: true
  });
  $(frappe.render_template("form_builder")).appendTo(page.main);
  jQuery(function($) {
    var $fbEditor = $("#fb-editor"),
      $formContainer = $("#fb-rendered-form"),
      fbOptions = {
        fieldRemoveWarn: true,
        onSave: function(event) {
          if (field.get_value()) {
            frappe.confirm(
              "Are you sure you want to update '" + field.get_value() + "' form ?",
              () => {
                update_form_builder(field.get_value(), formBuilder);
              },
              () => {
                // do nothing
              }
            );
            
          } else {
            let d = new frappe.ui.Dialog({
              title: "Enter Details",
              fields: [
                {
                  label: "Form Name",
                  fieldname: "doc_name",
                  fieldtype: "Data"
                }
              ],
              primary_action_label: "Submit",
              primary_action(values) {
                d.hide();
                let fields_data_json = formBuilder.actions.getData("json");
                let fields_data_js = JSON.parse(fields_data_json);
                frappe
                  .call(
                    "erpnext_formbuilder.erpnext_formbuilder.doctype.form_builder.form_builder.create_form_builder",
                    {
                      doc_name: values.doc_name,
                      fields: fields_data_json
                    }
                  )
                  .then(r => {
                    $fbEditor.toggle();
                    $formContainer.toggle();
                    $("form", $formContainer).formRender({
                      formData: formBuilder.formData
                    });
                  });
              }
            });
            d.show();
          }
        }
      },
      formBuilder = $fbEditor.formBuilder(fbOptions);

    $(".edit-form", $formContainer).click(function() {
      $fbEditor.toggle();
      $formContainer.toggle();
    });

    let field = page.add_field({
      label: "Form",
      fieldtype: "Link",
      fieldname: "form",
      options: "Form Builder",
      change() {
        if (field.get_value()) {
          frappe
            .call(
              "erpnext_formbuilder.erpnext_formbuilder.doctype.form_builder.form_builder.get_form_builder",
              {
                doc_name: field.get_value()
              }
            )
            .then(r => {
              formBuilder.actions.setData(JSON.stringify(r.message));
            });
        } else {
          page.clear_primary_action();
          formBuilder.actions.setData("[]");
        }
      }
    });
  });
};

function update_form_builder(doc_name, formBuilder) {
  let fields_data_json = formBuilder.actions.getData("json");
  frappe
    .call(
      "erpnext_formbuilder.erpnext_formbuilder.doctype.form_builder.form_builder.update_form_builder",
      {
        doc_name: doc_name,
        fields: fields_data_json
      }
    )
    .then(r => {
      //do nothing
    });
}
