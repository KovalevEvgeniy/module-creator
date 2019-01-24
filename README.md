# ModuleCreator 
#### version 1.1

## Usage

### Create module
``` js
$.CreateModule({
	name: 'Name',
	data: {},
	options: {},
	hooks: {
		beforeCreate: function () {},
		create: function () {
			this._create()
		},
		bindEvent: function () {
			$(this.element).on(this.getEventName('click'), this._onClick)
		},
		afterCreate: function () {}
	},
	privateMethods: {
		_create: function () {},
		_onClick: function (e) {},
		_examplePrivateMethod: function () {}
	},
	publicMethods: {
		examplePublicMethod: function (arg1, arg2) {
			this.private._examplePrivateMethod()
		}
	}
});
```
### Init module
``` js
$(function () {
	$.name([options])
})
```
or
``` js
$(function () {
	$(selector).name([options])
})
```
### Call methods
``` js
$.name('examplePublicMethod', [arguments])
```
### Custom hook
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
or
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
and coll in private methods
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