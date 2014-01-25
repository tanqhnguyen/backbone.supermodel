# Backbone.SuperModel
Super as in fashion supermodel, not supernatural power. `SuperModel` extend `Backbone.Model` directly and override several of `Backbone.Model` methods to add support for nested attributes and many other features (coming soon!)

## Nested attribute
It is quite often that nested attributes are used in an application. Considering this object structure
```js
var wallet = {
  'money': {
    'amount': 4000,
    'currency': 'euro'
  },
  'name': 'Tan Nguyen'
}
```
With `Backbone.Model` we can have a model with an attribute `wallet` to store the above information, like this
```js
var myStuff = new Backbone.Model();
myStuff.set('wallet', wallet);
myStuff.get('wallet').money.amount; // 4000
```
Although there is nothing wrong with this approach, it has several side-effects

* By default an object is passed by reference and any changes to the object will affect all other variables that are storing that object. So if `wallet.money.amount = 2000`, then `myStuff.get('wallet').money.amount` will also be changed (unwillingly). It can sometimes cause weird behaviour in the application (trust me, I have been there before)

* Nested attributes can not be listened to. In Backbone, a change to an attribute can be listened to by using `change:[attribute]` event. How about nested attributes? Nobody cares about nested attributes, that's why you can't listen to their changes, and they feel lonely, too

* Get and set is not-so-backbone-style. So to change nested attribute value, one must do this `myStuff.get('wallet').money.amount = 6000`, it's totally ok to do this, it's just ugly and inconvenient. How about validation? there is no way we can validate it. How about previous value? forget it. We loose all the benefits of `Backbone.Model` when we use nested attribute that way

## SuperModel to the rescue!!!
With `SuperModel` we will have a (maybe) better way to deal with nested attributes. Here is the list of some features

### Support nested set and get
Each level of nested attribute is represented by a model or a collection depend on the value. It also supports `relations` which will be discussed later.

```js
myStuff.get('wallet.money.amount');
myStuff.set('wallet.money.amount', 6000);
wallet.money.amout = 0; // this won't affect the data inside SuperModel
```

* `Array` of number, string is reserved as it is
* `Array` of object is turned into `Collection`
* Empty `Array` is turned into `Collection`
* `Object` is turned into `Model`
* If the path points to a collection, the value is set as a key of the collection itself
        

### Support change events
There are only 2 change events are fired, one for the top level (`myStuff` in this case) and the other one is for the last level (`wallet.money` in this case). The main reason is to discourage the use of deep nested model, and to simplify the implementation (hence an increase in the performance). The same idea applied to other change related methods such 

```js
myStuff.set('wallet.money.amount', 6000); // will fire 2 different events
view.listenTo(myStuff, 'change:wallet.money.amount', view.doThing);
view.listenTo(myStuff.get('wallet.money'), 'change:amount', view.doThing);
```

### `toJSON`
The standard `toJSON` is now able to return the correct nested format

```js
myStuff.set('wallet.money.amount', 6000); // will fire 2 different events
var json = myStuff.toJSON(); 
// json = {
//   "wallet": {
//     "money": {
//       "amount": 6000
//     }
//   }
// }
```

### Support `relations`
By defining `relations`, `SuperModel` can automatically initiate the corresponding class when it processes the attributes
```js
var AnotherModel = SuperModel.extend({
  hello: function() {
    return this.get('hello');
  }
});

var Child = SuperModel.extend({
  name: function() {
    return this.get('name');
  }
});

var Children = Backbone.Collection.extend({
  model: Child,
  firstChild: function() {
    return this.at(0);
  }
});

var MyModel = SuperModel.extend({
  relations: {
    'another': AnotherModel,
    'children': Children
  }
});

var model = new MyModel({
  'another': {
    'hello': 'SuperModel'
  },
  'children': [
    {
      'name': 'First baby'
    },
    {
      'name': 'Second baby'
    }
  ]
});

model.get('another').hello(); // returns 'SuperModel'
model.get('children'); // returns Children object
model.get('children').firstChild(); // returns Child object
model.get('children').firstChild().name(); // returns 'First baby'
```
At the moment, the relation must be an instance of `Backbone.Model` or `Backbone.Collection`

# TODOs
* Support better validation
* Support as many `Backbone.Model` method as possible
* More tests
* More docs
* More examples
* More features

# Development
`Gruntfile.js` and `package.json` are your friends

# License
MIT