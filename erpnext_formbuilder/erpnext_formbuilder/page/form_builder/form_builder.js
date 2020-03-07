frappe.pages["form-builder"].on_page_load = function(wrapper) {
  var page = frappe.ui.make_app_page({
    parent: wrapper,
    title: "Form Builder",
    single_column: true
  });
	$(frappe.render_template("form_builder")).appendTo(page.main);
	// console.log(page)
  // debugger;
  jQuery(function($) {
    var $fbEditor = $("#fb-editor"),
      $formContainer = $("#fb-rendered-form"),
      fbOptions = {
        fieldRemoveWarn: true,
        scrollToFieldOnAdd: true,
        onSave: function() {
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
              console.log("New form name:", values.doc_name);
              d.hide();
              let fields_data_json = formBuilder.actions.getData("json");
              // console.log(fields_data_json);
              let fields_data_js = JSON.parse(fields_data_json);
              // for (let i in fields_data_js) {
              //   console.log(fields_data_js[i]);
              //   // console.log(JSON.stringify(fields_data_js[i]));
              // }
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
                  console.log(r.message);
                });
            }
          });
          d.show();
          // debugger;
        }
      },
      formBuilder = $fbEditor.formBuilder(fbOptions);

    $(".edit-form", $formContainer).click(function() {
      $fbEditor.toggle();
      $formContainer.toggle();
    });

		// debugger
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
              // console.log(r.message);
							formBuilder.actions.setData(JSON.stringify(r.message));
							let $btn = page.set_primary_action('Update', () => update_form_builder(field.get_value(), formBuilder), 'octicon octicon-plus')
            });
				}
				else{
					page.clear_primary_action();
					formBuilder.actions.setData('[]');
				}
      }
		});
		// console.log(field)
  });
};


function update_form_builder(doc_name, formBuilder){
	console.log('Hey there!');
	let fields_data_json = formBuilder.actions.getData("json");
	console.log(fields_data_json)
	console.log(doc_name)
	frappe.call("erpnext_formbuilder.erpnext_formbuilder.doctype.form_builder.form_builder.update_form_builder",{
		doc_name: doc_name,
		fields: fields_data_json
	})
	.then(r => {
		console.log(r.message)
	})
}