# ModuleCreator
#### version 1.1

## Usage

### Quick start
#### Creating a module
``` js
$.CreateModule({
    name: 'Name',
    data: {},
    options: {},
    hooks: {
        beforeCreate: function () {},
        create: function () {
            this._create();
        },
        bindEvent: function () {
            $(this.element).on(this.getEventName('click'), this._onClick);
        },
        afterCreate: function () {}
    },
    privateMethods: {
        _create: function () {},
        _unBindEvent: function () {
            $(this.element).off(inst.hash);
        }
    },
    publicMethods: {
        destroy: function () {
            this.private._unBindEvent();
            this.private._destroy();
        },
        examplePublicMethod: function (arg1, arg2) {
            this.private._examplePrivateMethod();
        }
    }
});
```
#### Initializing the module
``` js
$(function () {
    $(selector).name([options])
})
```
Or, if you do not need to process the elements

``` js
$(function () {
    $.name([options])
})
```

### Methods
#### You can call public methods on an instance from an element
``` js
$(selector).name('examplePublicMethod', [arguments])
```
#### Or so, if initialization was not performed on the element
``` js
$.name('examplePublicMethod', [arguments])
```
#### Several methods already exist by default, but of course you can override them

``` js
inst._destroy = function () {
    delete inst.list[inst.hash];
    delete el.hash;
    delete el[lib];
};
```

### Custom hook
You can add hooks during module generation
``` js
hooks: {
    beforeCreate: function () {},
    create: function () {},
    bindEvent: function () {},
    afterCreate: function () {},
    myHook: function (arg1, arg2) {
        // code
    }
},
```
Or add it when you create an instance
``` js
$(function () {
    $.name({
        hooks: {
            myHook: function (arg1, arg2) {
                // code
            }
        }
    })
})
```
You can call them only in private methods
``` js
this.hooks('myHook', [arguments])
```

### Patch Notes
#### v 1.1 
Added global storage for all instances
``` js
this.storage // object
```
#### v 1.0
Release