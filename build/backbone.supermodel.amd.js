(function (root, factory) {
  if (typeof exports === 'object') {
    var _ = require('underscore');
    var Backbone = require('backbone');
    module.exports = factory(_, Backbone);
  } else if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], factory);
  }
}(this, function (_, Backbone) {

  Backbone.SuperModel = (function(_, Backbone){
    // http://stackoverflow.com/a/16190716/386378
    var getObjectValue = function(obj, path, def){
      path = path.split('.');
      var len = path.length;
      for(var i = 0; i < len; i++){
          if(!obj || typeof obj !== 'object') return def;
          obj = obj[path[i]];
      }
  
      if(obj === undefined) return def;
      return obj;
    };
  
    // http://stackoverflow.com/a/5484764/386378
    var setObjectValue = function(obj, keyPath, value) {
      lastKeyIndex = keyPath.length-1;
      for (var i = 0; i < lastKeyIndex; ++ i) {
        key = keyPath[i];
        if (!(key in obj))
          obj[key] = {};
        obj = obj[key];
      }
      obj[keyPath[lastKeyIndex]] = value;
    };
  
    var Model = Backbone.Model.extend({
      relations: {},
      unsafeAttributes: [],
  
      _getRelation: function(attr, value) {
        var relation;
  
        if (attr) {
          var relations = _.result(this, 'relations');
          relation = relations[attr];
        }
  
        if (value && !relation) {
          if (this._valueForCollection(value)) {
            relation = Collection; 
          } else {
            relation = Model;
          }        
        }
  
        // catch all the weird stuff
        if (typeof(relation) == 'undefined') {
          relation = Model;
        }
  
        return relation;
      },
  
      _valueForCollection: function(value) {
        if (_.isArray(value)) {
          if (value.length >= 1) {
            return _.isObject(value[0]);
          }
          return true;
        }
  
        return false;
      },
  
      _nestedSet: function(path, value) {
        path = path.split('.');
        var lastKeyIndex = path.length - 1;
        var obj = this;
        var nestedChanges = [];
  
        for (var i = 0; i < lastKeyIndex; ++i) {
          var key = path[i];
          var check = obj.attributes[key];
          if (!check) {
            // to be Model or not to be Model!!!
            var relation = this._getRelation(key, value);
            obj.attributes[key] = new relation();
          }
          obj = obj.attributes[key];
        }
  
        var finalPath = path[lastKeyIndex];
        if (!_.isArray(value) && _.isObject(value)) {
          for (var j in value) {
            var newPath = finalPath + '.' + j;
            // let _nestedSet do its things
            obj._nestedSet(newPath, value[j]);
          }
        } else {
          if (this._valueForCollection(value)) {
            // here we need to initiate the collection manually
            var collection = obj.attributes[finalPath];
            if (!collection) {
              var _relation = this._getRelation(finalPath, value);
              collection = obj.attributes[finalPath] = new _relation();
            }
            // maybe allow other methods as well? like reset
            collection.add(value);
          } else {
            // a simplified flow for setting new value
            obj._setChanging();
            obj.attributes[finalPath] = value;
            obj._setChange(finalPath, value, true);
            obj._triggerChanges([finalPath], {});
          }
        }
      },
  
      _setChanging: function() {
        this._previousAttributes = this.toJSON();
        this.changed = {};
      },
  
      _triggerChanges: function(changes, options, changeValue) {
  
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          if (!changeValue) {
            changeValue = this.get(changes[i]);
          }
  
          this.trigger('change:' + changes[i], this, changeValue, options);
        }
      },
  
      _setChange: function(attr, val, force) {
        var currentValue = this.get(attr);
        attr = attr.split('.');
        if (!_.isEqual(currentValue, val) || force) {
          setObjectValue(this.changed, attr, val);
          return true;
        } else {
          setObjectValue(this.changed, attr, undefined);
          return false;
        }
      },
  
      set: function(key, val, options) {
        var attr, attrs, unset, changes, silent, changing, prev, current, skipNested;
        if (key == null) return this;
  
        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (typeof key === 'object') {
          attrs = key;
          options = val;
        } else {
          attrs = {};
          attrs[key] = val;
        }
  
        options = options || {};
  
        // Run validation.
        // TODO: Need to work on this so that we can validate nested models
        if (!this._validate(attrs, options)) return false;
  
        // Extract attributes and options.
        unset           = options.unset;
        silent          = options.silent;
        changes         = [];
        changing        = this._changing;
        skipNested      = options.skipNested;
        this._changing  = true;
  
        if (!changing) {
          this._setChanging();
        }
  
        // Check for changes of `id`.
        if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];
  
        // For each `set` attribute, update or delete the current value.
        for (attr in attrs) {
          val = attrs[attr];
          
          if (this._setChange(attr, val)) {
            changes.push(attr);
          }
  
          if (unset) {
            this.set(attr, undefined, options);
          } else {
            if (skipNested) {
              this.attributes[attr] = val;
            } else {
              this._nestedSet(attr, val);  
            }
          }
        }
  
        // Trigger all relevant attribute changes.
        if (!silent) {
          this._triggerChanges(changes, options);
        }
  
        // You might be wondering why there's a `while` loop here. Changes can
        // be recursively nested within `"change"` events.
        if (changing) return this;
        if (!silent) {
          while (this._pending) {
            this._pending = false;
            this.trigger('change', this, options);
          }
        }
        this._pending = false;
        this._changing = false;
        return this;
      },
  
      get: function(attr) {
        var nestedAttrs = attr.split('.');
  
        if (nestedAttrs.length > 1) {
          var nestedAttr = this.attributes[_.first(nestedAttrs)];
          if (!nestedAttr) {
            return;
          }
  
          var rest = _.rest(nestedAttrs).join('.');
  
          if (_.isFunction(nestedAttr.get)) {
            return nestedAttr.get(rest);
          }
  
          return nestedAttr[rest];
        }
        return this.attributes[attr];
      },
  
      toJSON: function(options) {
        var unsafeAttributes = _.result(this, 'unsafeAttributes');
        var attributes = _.clone(this.attributes);
        _.each(this.unsafeAttributes, function(attr){
          delete attributes[attr];
        });
        
        _.each(attributes, function(val, key){
          if (_.isFunction(val.toJSON)) {
            attributes[key] = val.toJSON();  
          }
        });
  
        return attributes;
      },
  
      hasChanged: function(attr) {
        if (attr == null) return !_.isEmpty(this.changed);
        return getObjectValue(this.changed, attr);
      },
  
      previous: function(attr) {
        if (attr == null || !this._previousAttributes) return null;
        return getObjectValue(this._previousAttributes, attr);
      }
    });
  
    var Collection = Backbone.Collection.extend({
      model: Model
    });
  
    return Model;
  })(_, Backbone);
  return Backbone.SuperModel;

}));