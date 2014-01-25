var Backbone = require('backbone');
var model = new Backbone.Model();

module.exports = function() {
  model.set('nested.attribute', 'value');
  model.get('nested.attribute');  
}