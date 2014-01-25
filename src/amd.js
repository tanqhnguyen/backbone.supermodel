(function (root, factory) {
  if (typeof exports === 'object') {
    var _ = require('underscore');
    var Backbone = require('backbone');
    module.exports = factory(_, Backbone);
  } else if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], factory);
  }
}(this, function (_, Backbone) {

  // @include backbone.supermodel.js  
  return Backbone.SuperModel;

}));