var should = require('should')
  , _ = require('underscore')._
  , Backbone = require('backbone')
  , SuperModel = require('./')


var Owner = SuperModel.extend({

});

var Animal = SuperModel.extend({

});

var Animals = Backbone.Collection.extend({
  model: Animal
});

var Zoo = SuperModel.extend({
  relations: {
    'owner': Owner,
    'animals': Animals
  }
});
describe('Backbone.SuperModel', function(){
  beforeEach(function(){
    this.zoo = new Zoo();
  });

  it('sets normal 2-level nested attributes', function(){
    var address = 'Some street';
    var city = 'Starling';
    var number = 9000;
    var open = true;
    var name = 'The zoo';

    this.zoo.set('location.address', address);
    this.zoo.set({
      'location.city': city,
      'location.number': number
    });
    this.zoo.set('location.open', open);
    
    should(this.zoo.get('location')).be.an.instanceOf(SuperModel);
    should(this.zoo.get('location.address')).eql(address);
    should(this.zoo.get('location.city')).eql(city);
    should(this.zoo.get('location.number')).eql(number);
    should(this.zoo.get('location.open')).eql(open);

    this.zoo.set('location.address', city);
    should(this.zoo.get('location.address')).eql(city);

    this.zoo.set('location.test.nested', 123);
    this.zoo.set('location.test.nested', 'blabla');
    should(this.zoo.get('location.test.nested')).eql('blabla');
    should(this.zoo.get('location.test').get('nested')).eql('blabla');

    this.zoo.set('name', name);
    should(this.zoo.get('name')).eql(name);
  });

  it('sets normal 3-level nested attributes', function(){
    var lat = -9000;
    var lng = 9000;
    var name = 'Some place';

    this.zoo.set('location.map.lat', lat);
    this.zoo.set({
      'location.map.lng': lng,
      'location.name': name
    });
    
    should(this.zoo.get('location')).be.an.instanceOf(SuperModel);
    should(this.zoo.get('location.map')).be.an.instanceOf(SuperModel);

    should(this.zoo.get('location.name')).eql(name);
    should(this.zoo.get('location.map.lat')).eql(lat);
    should(this.zoo.get('location.map.lng')).eql(lng);

    should(this.zoo.get('location').get('map')).be.an.instanceOf(SuperModel);
    should(this.zoo.get('location').get('map').get('lat')).eql(lat);
  });

  it('sets normal object as nested attributes', function(){
    var map = {
      lng: 9000,
      lat: -9000
    }

    var official = {
      old: 'old name'
    };

    this.zoo.set('location.map', map);
    this.zoo.set('name.official', official)
    
    should(this.zoo.get('location.map')).be.an.instanceOf(SuperModel);
    should(this.zoo.get('name.official')).be.an.instanceOf(SuperModel);

    should(this.zoo.get('location.map.lng')).eql(map.lng);
    should(this.zoo.get('location.map.lat')).eql(map.lat);

    should(this.zoo.get('name.official.old')).eql(official.old);
  });

  it('sets nested object as nested attributes', function(){
    var nested = {
      location: {
        address: 'address',
        map: {
          lat: 9000,
          lng: -9000
        }
      }
    };

    this.zoo.set(nested);
    
    should(this.zoo.get('location')).be.an.instanceOf(SuperModel);
    should(this.zoo.get('location.address')).be.eql(nested.location.address);
    should(this.zoo.get('location.map')).be.an.instanceOf(SuperModel);

    nested.location.address = 'new address';
    should(this.zoo.get('location.address')).be.eql('address');
  });

  it('sets array', function(){
    var locations = [
        {
          name: 'place 1',
          nested: {
            attr: 'value'
          }
        },
        {
          name: 'place 2'
        }
      ];

    var gates = ['gate1', 'gate2', 'gate3'];
    var numbers = [1,2,3,4,5];
    var booleans = [false, true, false];
    var emptyArray = [];

    this.zoo.set('location', locations);
    this.zoo.set('gates', gates);
    this.zoo.set('numbers', numbers);
    this.zoo.set('booleans', booleans);
    this.zoo.set('empty', emptyArray);
    
    should(this.zoo.get('location')).be.an.instanceOf(Backbone.Collection);
    should(this.zoo.get('location').size()).be.equal(locations.length);

    should(this.zoo.get('gates')).be.an.instanceOf(Array);
    should(this.zoo.get('gates').length).be.equal(gates.length);

    should(this.zoo.get('numbers')).be.an.instanceOf(Array);
    should(this.zoo.get('numbers').length).be.equal(numbers.length);

    should(this.zoo.get('booleans')).be.an.instanceOf(Array);
    should(this.zoo.get('booleans').length).be.equal(booleans.length);

    should(this.zoo.get('empty')).be.an.instanceOf(Backbone.Collection);
    should(this.zoo.get('empty').length).be.equal(0);

    should(this.zoo.get('location').at(0)).be.an.instanceOf(SuperModel);
    should(this.zoo.get('location').at(0).get('name')).be.equal(locations[0].name)
    should(this.zoo.get('location').at(0).get('nested.attr')).be.equal(locations[0].nested.attr)
  });

  it('initializes the model', function(){
    var first = 'First';
    var arr1 = [{
      'key': 'value'
    }]
    var model = new SuperModel({
      'nested.first': first,
      'nested': {
        arr1: arr1
      },
      'normal': 'string'
    });
    should(model.get('nested')).be.an.instanceOf(SuperModel);
    should(model.get('nested').get('arr1')).be.an.instanceOf(Backbone.Collection);

    should(model.get('normal')).be.equal('string');
  });

  it('supports hasChanged()', function(){
    this.zoo.set('something.else', 'bla bla bla');

    should(this.zoo.hasChanged('something.else')).be.ok;
    should(this.zoo.get('something').hasChanged('else')).be.ok;

    this.zoo.set('some.array', [1,2,3,4]);
    should(this.zoo.hasChanged('some.array')).be.ok;
    should(this.zoo.get('some').hasChanged('array')).be.ok;
  });

  it('supports changedAttributes()', function(){
    var bla = 'bla bla bla';
    this.zoo.set('something.else', bla);

    should(this.zoo.changedAttributes().something.else).be.equal(bla);
    should(this.zoo.get('something').changedAttributes()['else']).be.equal(bla);
  });

  it('supports previousAttributes()', function(){
    var bla = 'bla bla bla';
    this.zoo.set('something.else', 123);
    this.zoo.set('something.else', bla);

    should(this.zoo.previousAttributes().something.else).be.equal(123);
    should(this.zoo.get('something').previousAttributes().else).be.equal(123);
  });

  it('supports previous()', function(){
    var bla = 'bla bla bla';
    this.zoo.set('something.else', 123);
    this.zoo.set('something.else', bla);

    should(this.zoo.previous('something.else')).be.equal(123);
    should(this.zoo.get('something').previous('else')).be.equal(123);
  });

  it('supports normal change events on the main model', function(){
    var bla = 'bla bla bla';
    this.zoo.on('change:something.else', function(model, options){
      should(model.get('something.else')).equal(bla);
    }, this);

    this.zoo.set('something.else', bla);
  });

  it('supports change events on the nested model', function(){
    var bla = 'bla bla bla';
    this.zoo.set('something.else', 123);
    this.zoo.get('something').on('change:else', function(model, options){
      should(model.get('else')).equal(bla);
    }, this);
    this.zoo.set('something.else', bla);
  });

  it('supports change events on the second level nested model', function(){
    var bla = 'bla bla bla';
    this.zoo.set('some.other.thing', 123);
    this.zoo.get('some').on('change:other.thing', function(model, options){
      should(model.get('other.thing')).equal(bla);
    }, this);

    this.zoo.set('some.other.thing', bla);
  });

  it('supports relations', function(){
    var animals = [
      {
        'name': 'penguin'
      },
      {
        'name': 'doge'
      }
    ];

    this.zoo.set('owner', {name: 'Tan Nguyen'});
    should(this.zoo.get('owner')).be.an.instanceOf(Owner);

    this.zoo.set('animals', animals);
    should(this.zoo.get('animals')).be.an.instanceOf(Animals);
  });

});