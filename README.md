# ModuleCreator
#### version 1.1

## Usage

### Quick start
#### Creating a module

``` js
// clear

/**
* @ModuleCreator version 1.1.0
* @module ModuleName
* @example $.moduleName(object)
* @author Author name
**/
$.CreateModule({
    name: 'Name',
    data: {},
    options: {},
    hooks: {
        beforeCreate: function () {},
        create: function () {
            this._create();
        },
        bindEvent: function () {},
        afterCreate: function () {}
    },
    privateMethods: {
        _create: function () {},
        _unBindEvent: function () {
            $(this.element).off(this.hash);
        }
    },
    publicMethods: {}
});
```
``` js
// example with comments

$.CreateModule({
    name: 'ModuleName',
    data: {},
    options: {},
    hooks: {
        beforeCreate: function () {},
        create: function () {
            // this - a link to a private instance
            this._create();
        },
        bindEvent: function () {
            $(this.element).on(this._getEventName('click'), this._examplePrivateMethod);
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
Or, if you do not need to process the elements

``` js
$(function () {
    $.name([options]);
});
```

Since there is always a hash in namespace, you can quickly remove all handlers associated with that instance
``` js
$('*').off(this.hash);
```

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
Several methods already exist by default, but of course you can override them
``` js
inst._getEventList()
inst._getEventName()
inst._destroy()
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
The default object with events looks like this
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

### Options and Data
`data` and `options` are basically the same. the only difference is the scope.
In a private area, you can use them like this:
``` js
this.options.optionName
this.data.propName
```
But you can also access the `data` from the public area
``` js
this.inst.data
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
this.hooks('customHook', arg1, arg2);
```

### Patch Notes
#### v 1.2.0
Transferring sources to es6. Added method "super" to call parent methods.
``` js
this.super('_parentMethodName', arg1, arg2);
```
#### v 1.1.0
Added global storage for all instances.
``` js
this.storage // object
```
#### v 1.0.0
Release.