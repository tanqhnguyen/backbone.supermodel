# Backbone.SuperModel
Super as in fashion supermodel, not supernatural power. `SuperModel` extend `Backbone.Model` directly and override several of `Backbone.Model` methods to add support for nested attributes and many other features (coming soon!)

## Install
### Using NPM
```
npm install backbone.supermodel
```

### Using bower
```
bower install backbone.supermodel
```

### Using AMD script loader
* Copy `build/backbone.supermodel.amd.js` to your project
* Load it with `require(['path/to/backbone.supermodel.amd'], function(SuperModel){})` and make sure that your have `underscore` and `backbone` stup correctly

### Use it the old fashion way
* Load `build/backbone.supermodel.js` in `<head>` or at the end of `<body>`
* Make sure that you have `underscore` and `backbone` loaded before that

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
        

### Support nested change events
Although it is not recommended to have deep-nested models, SuperModel supports it anyway. There are several change events when using `set`. Note that, the deeper the path goes, the more events will be fired. Therefore, be careful when using deep nested paths.

```js
// receive 6000 as the changed value
view.listenTo(myStuff, 'change:wallet.money.amount', view.doThing); 

// receive myStull.get('wallet.money') as the changed value
view.listenTo(myStuff, 'change:wallet.money', view.doThing);

// receive myStull.get('wallet') as the changed value
view.listenTo(myStuff, 'change:wallet', view.doThing);

// receive myStull.get('wallet.money') as the changed value
view.listenTo(myStull.get('wallet'), 'change:money', view.doThing);

// receive 6000 as the changed value
view.listenTo(myStull.get('wallet'), 'change:money.amount', view.doThing);

// receive 6000 as the changed value
view.listenTo(myStuff.get('wallet.money'), 'change:amount', view.doThing);

myStuff.set('wallet.money.amount', 6000);
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
By settings `unsafeAttributes` (an array or a function which returns an array), `toJSON` will exclude those attributes in the returned value
```js
var MyModel = Backbone.SuperModel.extend({
  'unsafeAttributes': ['password']
});

var myModel = new MyModel({
  'username': 'supermodel',
  'password': 'secret'
});
myModel.toJSON(); // return {"username": "supermodel"}
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

### Support backward reference
In some cases it might be useful that we can refer back to the upper level. For example, when rendering a list of posts, we might need to get the author information associated with each post. By setting `name` (can be a value or function), `SuperModel` will automatically build the back reference, if there is already an attribute with the same name, `SuperModel` will respect and skip it. The back reference is simply an attribute in the target model/collection in order to avoid circular reference when calling other methods such as `toJSON`

```javascript
var Post = Backbone.SuperModel.extend({

});

var Posts = Backbone.Collection.extend({
  model: Post
});

var User = Backbone.SuperModel.extend({
  name: 'user',
  relations: {
    'posts': Posts
  }
});

var user = new User({
  'username': 'supermodel'
  'posts': [
    {
      'title': 'Post number 1'
    },
    {
      'title': 'Post number 2'
    }
  ]
});

user.get('posts').at(0).user.get('username'); // return 'supermodel'
```

# TODOs
* Support validation
* Support as many `Backbone.Model` methods as possible
* ~~Support relations~~
* ~~Support back reference~~
* Implement `getRelation` to replace the current way of accessing relations
* Improve performance

# Benchmarks
```bash
Running benchmark model_get [benchmarks/model_get.js]...
>> model_get x 48,381,420 ops/sec ±0.96% (93 runs sampled)

Running benchmark model_set [benchmarks/model_set.js]...
>> model_set x 300,337 ops/sec ±1.49% (96 runs sampled)

Running benchmark model_setget [benchmarks/model_setget.js]...
>> model_setget x 130,590 ops/sec ±1.49% (95 runs sampled)

Running benchmark supermodel_get [benchmarks/supermodel_get.js]...
>> supermodel_get x 4,487,165 ops/sec ±0.61% (98 runs sampled)

Running benchmark supermodel_nested_get [benchmarks/supermodel_nested_get.js]...
>> supermodel_nested_get x 1,999,848 ops/sec ±1.30% (95 runs sampled)

Running benchmark supermodel_nested_set [benchmarks/supermodel_nested_set.js]...
>> supermodel_nested_set x 45,619 ops/sec ±1.62% (95 runs sampled)

Running benchmark supermodel_set [benchmarks/supermodel_set.js]...
>> supermodel_set x 68,673 ops/sec ±1.12% (99 runs sampled)

Running benchmark supermodel_setget [benchmarks/supermodel_setget.js]...
>> supermodel_setget x 78,513 ops/sec ±2.04% (94 runs sampled)
```
It is obviously slower than the original `Backbone.Model`

# Development
`Gruntfile.js`, `package.json` and `bower.json` are your friends

# Contributors
https://github.com/laoshanlung/backbone.supermodel/graphs/contributors

# License
MIT