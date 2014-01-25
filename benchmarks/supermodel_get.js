var SuperModel = require('../build/backbone.supermodel.amd');

var model = new SuperModel();
model.set('nested.attribute', 'value');

module.exports = function() {
  model.get('nested.attribute');  
}