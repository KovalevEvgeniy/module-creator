# ModuleCreator
#### latest version 1.4.5

## Usage

### Quick start

#### Dependencies
``` html
<script src="jquery.min.js"></script>
<script src="jquery.modulecreator.min.js"></script>
```

#### Creating a module
``` js
// Start creating the module by copying this code:

/**
* @ModuleCreator version 1.4.5
* https://github.com/KovalevEvgeniy/module-creator
* @module ModuleName
* @example $.moduleName(object)
* or
* @example $(selector).moduleName(object)
* @author Author name
**/
$.CreateModule({
    name: 'Name',
    options: {},
    hooks: {
        create: function () {
            this._create();
        },
        bindEvent: function () {
            $(this.element).on(this._getEventName('click'), this._exampleHandler);
        }
    },
    privateMethods: {
        _create: function () {},
        _exampleHandler (event) {}
    },
    publicMethods: {}
});
```

``` js
// example with comments
$.CreateModule({
    name: 'ModuleName',
    extends: ['parentModule'],
    data: {},
    options: {},
    hooks: {
        beforeCreate: function () {},
        create: function () {
            // this - a link to a private instance
            this._create();
        },
        bindEvent: function () {
            $(this.element).on(this._getEventName('click'), this._exampleHandler);
        },
        afterCreate: function () {}
    },
    privateMethods: {
        _create: function () {
            // this - a link to a private instance
        },
        _unBindEvent: function () {
            $(this.element).off(this.hash);
        },
        _exampleHandler: function (event) {
            // this - is stilla link to a private instance
        },
        _examplePrivateMethod: function (arg1, arg2) {
            // code...
        }
    },
    publicMethods: {
        destroy: function () {
            this.private._unBindEvent();
            this.private._destroy();
        },
        examplePublicMethod: function (arg1, arg2) {
            // this - a link to the public instance
            // this.inst - a link to a private instance from a public area
            // this.private - a link to a private methods from the public area

            this.private._examplePrivateMethod(arg1, arg2);
        }
    }
});
```
#### Initializing the module
``` js
$(function () {
    $(selector).name([options]);
});
```
Or, if you do not need to process the elements.

``` js
$(function () {
    $.name([options]);
});
```


## Documentation
### Methods
You can call public methods on an instance from an element
``` js
$(selector).name('examplePublicMethod', [arguments]);
```
Or so, if initialization was not performed on the element
``` js
$.name('examplePublicMethod', [arguments]);
```
You can access private methods from the `this.private` object
``` js
this.private._examplePrivateMethod(arg1, arg2);
```


### Parent methods
Several methods already exist by default, but of course you can override them.

Wrapper method for adding event listeners. You can read more about its use in the Bindings block.
``` js
inst._getEventList()
```
``` js
inst._getEventName()
```
``` js
inst._destroy()
```

This method works just like `Object.assign` or `$.extend`, but does it deeply. Note that internal functions still do not lose context, call them via `call` or `apply`.
``` js
inst._extend({}, obj1, obj2)
```

This method returns a deep copy of the argument.
``` js
inst._deepCopy()
```

This method returns `true` or `false` if you use mobile agent or not.
``` js
inst._isMobile()
```

You can call the parent method in a private area as follows:
``` js
this.super('_destroy');
this.super('_getEventList');
this.super('_parentMethodName', arg1, arg2);
```


### Bindings
The `bindEvent` hook is called after the instance is created. This allows you to bind an event handler.
For example so:
``` js
$(this.element).on(this._getEventName('click'), this._onClick);
```
The `_getEventName` method takes the event name as the first argument, and namespace as the second optional parameter.
It returns the name of the event depending on the client type (desktop, mobile).
``` js
this._getEventName('click'); // for mobile 'touchstart.[instanse hash]'
this._getEventName('click'); // for desktop 'click.[instanse hash]'
this._getEventName('click','exampleNamespace'); // for desktop 'click.exampleNamespace.[instanse hash]'
```
The default object with events looks like this.
``` js
{
    'click': 'touchstart',
    'mousedown': 'touchstart',
    'mouseup': 'touchend'
}
```
But you can override it or extend the returned object.
``` js
privateMethods: {
    // ...
    _getEventList: function () {
        return $.extend({}, this.super('_getEventList'), {
            'myEvent': 'myMobileEvent'
        })
    }
    // ...
}
```
Since there is always a hash in namespace, you can quickly remove all handlers associated with that instance.
``` js
$('*').off(this.hash);
```


### Options and data
`data` and `options` are basically the same. The difference is in the scope and the possibility of observation.
In a private area, you can use them like this:
``` js
// get
this.options.optionName
this.data.propName
// set
this.options.optionName = 'new options'
this.data.propName = 'new data'
```
The module also accepts options from the date attribute in JSON of the same name for our module, only in the kebab-case style.

```html
    <div class="example" data-test-name='{"option-name": true}'></div>
``` 

But you can also access the `data` from the public area.
``` js
this.inst.data
```
And you can add methods to the `watch` object. They should be named as `data` properties.
``` js
watch: {
    // ...
    propName: function (oldValue, newValue) {
        // this method will be called after the change `data.propName`
        // and you get the old and new values in the arguments
    }
    // ...
}
```
Observer methods will be called only for properties existing in the `data` or in its `data` parents at the time of module creation.

If you want to add the observed property dynamically, you need to use the `_set` method:
``` js
// syntax:
this._set(propName, propValue[, ...callback])

// example:
this._set('propsName', 'propsValue', function (oldValue, newValue) {
    // Observer callback
})
```


### Storage
Storage is also very similar to the options. The only difference is that different instances of the same class have access to the same storage.
``` js
this.storage // object
```


### Custom hook
In addition to standard hooks, you can add your own. But they will also have to call yourself.
You can add them when generating the module.
``` js
hooks: {
    beforeCreate: function () {/* code... */},
    create: function () {/* code... */},
    bindEvent: function () {/* code... */},
    afterCreate: function () {/* code... */},
    customHook: function (arg1, arg2) {
        // code
    }
},
```
Or creating an instance.
``` js
$(function () {
    $(select).moduleName({
        hooks: {
            customHook: function (arg1, arg2) {
                // code
            }
        }
    })
})
```
You can call them only in private methods.
``` js
this.hook('customHook', arg1, arg2);
```


### Extends
You can now inherit from previously created modules. You can now inherit from existing modules. Just add their names to the `extends` field as an array.
Your copy works immediately. Because all hooks, private methods and options are inherited.
Of course, all overridden methods can be called via `super`.

``` js
$.CreateModule({
    name: 'ParentModule',
    data: {},
    options: {
        parentOption: true,
        secondOption: true
    },
    privateMethods: {
        _create: function () {
            console.log('this is parent method');
        },
        _testMethod: function () {
            console.log('this method not be called');
            return 'called parent method'
        }
    },
    publicMethods: {}
});

$.CreateModule({
    name: 'ChildrenModule',
    extends: ['parentModule'],
    data: {},
    options: {
        childrenOption: true,
        secondOption: false
    },
    hooks: {
        create: function () {
            this._create()
        }
    },
    privateMethods: {
        _testMethod: function () {
            console.log('this method to be called');
            console.log(this.options); // {parentOption: true, childrenOption: true, secondOption: false}
            this.super('_testMethod') // 'called parent method'
        }
    },
    publicMethods: {}
});
```

You can inherit your module from multiple parents. If parents have methods with the same name, then `super` will call the method of the last parent in the inheritance chain.
``` js
this.super(parentMethodName[, ...arguments])
```
// If you want to specify which parent method to call, you can specify the parent name as the first argument.
``` js
this.super(parentName, parentMethodName[, ...arguments])
```

``` js
// Examples:
$.CreateModule({
    name: 'ParentModule',
    // code
    privateMethods: {
        _create: function (isReturn) {
            if (isReturn) {
                return 'first parent method';
            }
        }
    },
});

$.CreateModule({
    name: 'ParentModule2',
    // code
    privateMethods: {
        _create: function () {
            return 'second parent method';
        }
    },
});

$.CreateModule({
    name: 'ChildrenModule',
    extends: ['parentModule', 'parentModule2'],
    // code
    privateMethods: {
        _create: function () {
            this.super('_create') // 'second parent method'

            this.super('parentModule', '_create', true) // 'first parent method'
            this.super('parentModule2', '_create') // 'second parent method'
        }
    },
});
```


### Patch Notes
#### v 1.4.1
Add method `_set`

#### v 1.4.0
Added watching methods.
You can add methods to the `watch` object. They should be named as `data` properties.

#### v 1.3.1
Extended extend!
Now you can choose which parent to call the method through `super`.
And added methods `_extend` and `_deepCopy`

#### v 1.3.0
You can now inherit from existing modules using the `extends` property.

#### v 1.2.0
Transferring sources to es6. Added method `super` to call parent methods.

#### v 1.1.0
Added global storage for all instances.

#### v 1.0.0
Release.
