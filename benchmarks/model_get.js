var Backbone = require('backbone');
var model = new Backbone.Model();
model.set('attribute', 'value');

module.exports = function() {
  model.get('attribute');  
}