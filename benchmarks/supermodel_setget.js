var SuperModel = require('../build/backbone.supermodel.amd');

var model = new SuperModel();

module.exports = function() {
  model.set('attribute', 'value');
  model.get('attribute');  
}