var should = require('should')
  , _ = require('underscore')._
  , Backbone = require('backbone')
  , SuperModel = require('./')

var Owner = SuperModel.extend({
  name: 'owner'
});

var Animal = SuperModel.extend({
  name: 'animal'
});

var Animals = Backbone.Collection.extend({
  model: Animal
});

var Zoo = SuperModel.extend({
  name: 'zoo',

  relations: {
    'owner': Owner,
    'animals': Animals
  }
});
describe('Backbone.SuperModel', function(){
  beforeEach(function(){
    this.zoo = new Zoo();
    this.doc = new Backbone.Model();
  });

  // it('sets normal 2-level nested attributes', function(){
  //   var address = 'Some street';
  //   var city = 'Starling';
  //   var number = 9000;
  //   var open = true;
  //   var name = 'The zoo';

  //   this.zoo.set('location.address', address);
  //   this.zoo.set({
  //     'location.city': city,
  //     'location.number': number
  //   });
  //   this.zoo.set('location.open', open);
    
  //   should(this.zoo.get('location')).be.an.instanceOf(SuperModel);
  //   should(this.zoo.get('location.address')).eql(address);
  //   should(this.zoo.get('location.city')).eql(city);
  //   should(this.zoo.get('location.number')).eql(number);
  //   should(this.zoo.get('location.open')).eql(open);

  //   this.zoo.set('location.address', city);
  //   should(this.zoo.get('location.address')).eql(city);

  //   this.zoo.set('location.test.nested', 123);
  //   this.zoo.set('location.test.nested', 'blabla');
  //   should(this.zoo.get('location.test.nested')).eql('blabla');
  //   should(this.zoo.get('location.test').get('nested')).eql('blabla');

  //   this.zoo.set('name', name);
  //   should(this.zoo.get('name')).eql(name);
  // });

  // it('sets normal 3-level nested attributes', function(){
  //   var lat = -9000;
  //   var lng = 9000;
  //   var name = 'Some place';

  //   this.zoo.set('location.map.lat', lat);
  //   this.zoo.set({
  //     'location.map.lng': lng,
  //     'location.name': name
  //   });
    
  //   should(this.zoo.get('location')).be.an.instanceOf(SuperModel);
  //   should(this.zoo.get('location.map')).be.an.instanceOf(SuperModel);

  //   should(this.zoo.get('location.name')).eql(name);
  //   should(this.zoo.get('location.map.lat')).eql(lat);
  //   should(this.zoo.get('location.map.lng')).eql(lng);

  //   should(this.zoo.get('location').get('map')).be.an.instanceOf(SuperModel);
  //   should(this.zoo.get('location').get('map').get('lat')).eql(lat);
  // });

  // it('sets normal object as nested attributes', function(){
  //   var map = {
  //     lng: 9000,
  //     lat: -9000
  //   }

  //   var official = {
  //     old: 'old name'
  //   };

  //   this.zoo.set('location.map', map);
  //   this.zoo.set('name.official', official)
    
  //   should(this.zoo.get('location.map')).be.an.instanceOf(SuperModel);
  //   should(this.zoo.get('name.official')).be.an.instanceOf(SuperModel);

  //   should(this.zoo.get('location.map.lng')).eql(map.lng);
  //   should(this.zoo.get('location.map.lat')).eql(map.lat);

  //   should(this.zoo.get('name.official.old')).eql(official.old);
  // });

  // it('sets nested object as nested attributes', function(){
  //   var nested = {
  //     location: {
  //       address: 'address',
  //       map: {
  //         lat: 9000,
  //         lng: -9000
  //       }
  //     }
  //   };

  //   this.zoo.set(nested);
    
  //   should(this.zoo.get('location')).be.an.instanceOf(SuperModel);
  //   should(this.zoo.get('location.address')).be.eql(nested.location.address);
  //   should(this.zoo.get('location.map')).be.an.instanceOf(SuperModel);

  //   nested.location.address = 'new address';
  //   should(this.zoo.get('location.address')).be.eql('address');
  // });

  // it('sets array', function(){
  //   var locations = [
  //       {
  //         name: 'place 1',
  //         nested: {
  //           attr: 'value'
  //         }
  //       },
  //       {
  //         name: 'place 2'
  //       }
  //     ];

  //   var gates = ['gate1', 'gate2', 'gate3'];
  //   var numbers = [1,2,3,4,5];
  //   var booleans = [false, true, false];
  //   var emptyArray = [];

  //   this.zoo.set('location', locations);
  //   this.zoo.set('gates', gates);
  //   this.zoo.set('numbers', numbers);
  //   this.zoo.set('booleans', booleans);
  //   this.zoo.set('empty', emptyArray);
    
  //   should(this.zoo.get('location') instanceof Backbone.Collection).be.equal(true);
  //   should(this.zoo.get('location').size()).be.equal(locations.length);

  //   should(this.zoo.get('gates')).be.an.instanceOf(Array);
  //   should(this.zoo.get('gates').length).be.equal(gates.length);

  //   should(this.zoo.get('numbers')).be.an.instanceOf(Array);
  //   should(this.zoo.get('numbers').length).be.equal(numbers.length);

  //   should(this.zoo.get('booleans')).be.an.instanceOf(Array);
  //   should(this.zoo.get('booleans').length).be.equal(booleans.length);

  //   should(this.zoo.get('empty') instanceof Backbone.Collection).be.equal(true);
  //   should(this.zoo.get('empty').length).be.equal(0);

  //   should(this.zoo.get('location').at(0)).be.an.instanceOf(SuperModel);
  //   should(this.zoo.get('location').at(0).get('name')).be.equal(locations[0].name);
  //   should(this.zoo.get('location').at(0).get('nested.attr')).be.equal(locations[0].nested.attr);
  // });

  // it('initializes the model', function(){
  //   var first = 'First';
  //   var arr1 = [{
  //     'key': 'value'
  //   }]
  //   var model = new SuperModel({
  //     'nested.first': first,
  //     'nested': {
  //       arr1: arr1
  //     },
  //     'normal': 'string'
  //   });
  //   should(model.get('nested')).be.an.instanceOf(SuperModel);
  //   should(model.get('nested').get('arr1')).be.an.instanceOf(Backbone.Collection);

  //   should(model.get('normal')).be.equal('string');
  // });

  // it('hasChanged()', function(){
  //   this.zoo.set('something.else', 'bla bla bla');

  //   should(this.zoo.hasChanged('something.else')).be.ok;
  //   should(this.zoo.get('something').hasChanged('else')).be.ok;

  //   this.zoo.set('some.array', [1,2,3,4]);
  //   should(this.zoo.hasChanged('some.array')).be.ok;
  //   should(this.zoo.get('some').hasChanged('array')).be.ok;
  // });

  // it('changedAttributes()', function(){
  //   var bla = 'bla bla bla';
  //   this.zoo.set('something.else', bla);

  //   should(this.zoo.changedAttributes().something.else).be.equal(bla);
  //   should(this.zoo.get('something').changedAttributes()['else']).be.equal(bla);
  // });

  // it('previousAttributes()', function(){
  //   var bla = 'bla bla bla';
  //   this.zoo.set('something.else', 123);
  //   this.zoo.set('something.else', bla);
  //   should(this.zoo.previousAttributes().something.else).be.equal(123);
  //   should(this.zoo.get('something').previousAttributes().else).be.equal(123);
  // });

  // it('previous()', function(){
  //   var bla = 'bla bla bla';
  //   this.zoo.set('something.else', 123);
  //   this.zoo.set('something.else', bla);

  //   should(this.zoo.previous('something.else')).be.equal(123);
  //   should(this.zoo.get('something').previous('else')).be.equal(123);
  // });

  // it('supports normal change events on the main model', function(){
  //   var bla = 'bla bla bla';
  //   this.zoo.on('change:something.else', function(model, newValue){
  //     should(model.hasChanged('something.else')).be.ok;
  //     should(newValue).equal(bla);
  //     should(model.get('something.else')).equal(bla);
  //   }, this)
  //   .set('something.else', bla);
  // });

  // it('supports change events on the nested model', function(){
  //   var bla = 'bla bla bla';
  //   this.zoo.set('something.else', 123);
  //   this.zoo.get('something').on('change:else', function(model, newValue){
  //     should(model.get('else')).equal(bla);
  //   }, this);
  //   this.zoo.set('something.else', bla);
  // });

  // it('supports change events on the second level nested model', function(){
  //   var bla = 'bla bla bla';
  //   this.zoo.set('some.other.thing', 123);
  //   this.zoo.get('some').on('change:other.thing', function(model, newValue){
  //     should(model.get('other.thing')).equal(bla);
  //   }, this);

  //   this.zoo.set('some.other.thing', bla);
  // });

  // it('supports relations', function(){
  //   var animals = [
  //     {
  //       'name': 'penguin'
  //     },
  //     {
  //       'name': 'doge'
  //     }
  //   ];

  //   this.zoo.set('owner', {name: 'Tan Nguyen'});
  //   should(this.zoo.get('owner')).be.an.instanceOf(Owner);

  //   this.zoo.set('animals', animals);
  //   should(this.zoo.get('animals')).be.an.instanceOf(Animals);
  // });

  // it('escape()', function(){
  //   this.zoo.set('nested.value', 'Bill & Bob');
  //   should(this.zoo.escape('nested.value')).be.equal('Bill &amp; Bob');
  // });

  // it('has()', function(){
  //   this.zoo.set('nested.value', 'test');
  //   should(this.zoo.has('nested.value')).be.ok;
  // });

  // it('unset()', function(){
  //   this.zoo.set('nested.value', 'test');
  //   this.zoo.unset('nested.value');
  //   should(this.zoo.has('nested.value')).not.be.ok;
  //   should(this.zoo.hasChanged('nested.value')).be.ok;
  // });

  // it('can be used with Backbone.Collection normally', function(){
  //   var animals = new Backbone.Collection();
  //   var dog = new Animal({
  //     name: 'Golden'
  //   });
  //   dog.set('food', {some: 'bones'}, {skipNested: true});

  //   animals.add(dog);

  //   should(animals.at(0)).be.an.instanceOf(Animal);
  //   should(animals.at(0).get('name')).be.equal(dog.get('name'));
  //   should(animals.at(0).get('food').some).be.equal('bones');
  // });

  // // the following tests are from Backbone with the title renamed and some
  // // modifications in order to be used with mocha and should

  // it("prevent nested change events from clobbering previous attributes", function() {
  //   new SuperModel()
  //   .on('change:nested.value', function(model, newState) {
  //     should(model.previous('nested.value')).not.be.ok;
  //     should(newState).be.equal('hello');
  //     // Fire a nested change event.
  //     model.set({'nested.value': 'whatever'});
  //   })
  //   .on('change:nested.value', function(model, newState) {
  //     should(model.previous('nested.value')).not.be.ok;
  //     should(newState).be.equal('hello');
  //   })
  //   .set({state: 'hello'});
  // });

  // it("use the same comparison for hasChanged/set", function() {
  //   var changed = 0, model = new SuperModel({'a.b': null});
  //   model.on('change', function() {
  //     should(this.hasChanged('a.b')).be.ok;
  //   })
  //   .on('change:a.b', function() {
  //     changed++;
  //   })
  //   .set({'a.b': undefined});
  //   should(changed).be.equal(1);
  // });

  // it("fire change:attribute callbacks after all changes have occurred", function() {
  //   var model = new SuperModel;

  //   var assertion = function() {
  //     should(model.get('nested.a')).equal('a');
  //     should(model.get('nested1.b')).equal('b');
  //     should(model.get('nested2.c')).equal('c');
  //   };

  //   model.on('change:nested.a', assertion);
  //   model.on('change:nested1.b', assertion);
  //   model.on('change:nested2.c', assertion);

  //   model.set({'nested.a': 'a', 'nested1.b': 'b', 'nested2.c': 'c'});
  // });

  // it("supports backref to upper level", function(){
  //   var anotherZoo = new Zoo({
  //     'owner': {
  //       name: 'Tan Nguyen'
  //     },
  //     'animals': [
  //       {
  //         name: 'duck'
  //       },
  //       {
  //         name: 'platypus'
  //       }
  //     ]
  //   });

  //   should(anotherZoo.get('owner').zoo).be.an.instanceOf(Zoo);
  //   should(anotherZoo.get('animals').zoo).be.an.instanceOf(Zoo);
  //   should(anotherZoo.get('animals').zoo.cid).equal(anotherZoo.cid);
  //   should(anotherZoo.get('owner').zoo.cid).equal(anotherZoo.cid);
  // });

  // it("toJSON()", function(){
  //   var anotherZoo = new Zoo({
  //     'owner': {
  //       name: 'Tan Nguyen'
  //     },
  //     'animals': [
  //       {
  //         name: 'duck'
  //       },
  //       {
  //         name: 'platypus'
  //       }
  //     ]
  //   });

  //   var json = anotherZoo.toJSON();
  //   should(json.owner.name).equal(anotherZoo.get('owner.name'));
  //   should(json.animals).be.an.instanceOf(Array);
  //   should(json.animals.length).equal(anotherZoo.get('animals').size());
  // });

  // it("toJSON() with unsafeAttributes", function(){
  //   var anotherZoo = new Zoo({
  //     'owner': {
  //       name: 'Tan Nguyen'
  //     },
  //     'animals': [
  //       {
  //         name: 'duck'
  //       },
  //       {
  //         name: 'platypus'
  //       }
  //     ]
  //   });
  //   anotherZoo.unsafeAttributes = ['password'];
  //   anotherZoo.set('password', 'something-strong');

  //   var json = anotherZoo.toJSON();
  //   should(json.owner.name).equal(anotherZoo.get('owner.name'));
  //   should(json.animals).be.an.instanceOf(Array);
  //   should(json.animals.length).equal(anotherZoo.get('animals').size());
  //   should(json.password).equal(undefined);
  // });

  // it("correctly converts second level array into collection", function(){
  //   var model = new SuperModel({ prop1 : { prop2 : [{a:1}, {a:2}] } });
  //   should(model.get('prop1')).be.an.instanceOf(Backbone.Model);
  //   should(model.get('prop1.prop2')).be.an.instanceOf(Backbone.Collection);
  //   should(model.get('prop1.prop2').size()).be.equal(2);
  // });

  // it("correctly converts third level array into collection", function(){
  //   var model = new SuperModel({ prop1 : { prop2 : {prop3: [{a:1}, {a:2}]} } });
  //   should(model.get('prop1')).be.an.instanceOf(Backbone.Model);
  //   should(model.get('prop1.prop2')).be.an.instanceOf(Backbone.Model);
  //   should(model.get('prop1.prop2.prop3')).be.an.instanceOf(Backbone.Collection);
  //   should(model.get('prop1.prop2.prop3').size()).be.equal(2);
  // });

  it("supports clear", function(){
    var model = new SuperModel({
      id: 1,
      prop1: 'value1', 
      'prop2.a': 'value2',
      'prop3': [
        {'name': 'a'},
        {'name': 'b'}
      ]
    });
    model.clear();

    should(model.get('prop1')).be.not.ok;
    should(model.get('prop2.a')).be.not.ok;
    should(model.get('prop2')).be.an.instanceOf(Backbone.Model);
    should(model.get('prop3')).be.an.instanceOf(Backbone.Collection);
    should(model.get('prop3').size()).be.equal(0);
    should(model.id).be.not.ok;
  });
});