function initComponents() {
  // Shape
  var shapeList = [].slice.call(document.querySelectorAll('.m-shape-container'))
  var shapes = shapeList.map(function (s) {
    return new materialstyle.Shape(s)
  })

  // Button Ripple
  var buttonList = [].slice.call(document.querySelectorAll('.ripple-surface'))
  buttonList.map(function (button) {
    new materialstyle.Ripple(button)
  })

  // Text Field
  var textFieldList = [].slice.call(document.querySelectorAll('.form-control'))
  var textFields = textFieldList.map(function (textField) {
    return new materialstyle.TextField(textField)
  })

  // Select Field
  var selectList = [].slice.call(document.querySelectorAll('.form-select'))
  var selects = selectList.map(function (select) {
    return new materialstyle.SelectField(select)
  })

  var tabs = [].slice.call(document.querySelectorAll('.nav-tabs'))
  tabs.map(function (tab) {
    new materialstyle.Tab(tab)
  })
}

document.addEventListener("DOMContentLoaded", function () {
  initComponents()
});
