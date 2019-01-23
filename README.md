# ModuleCreator 
#### version 1.1

## Usage

### Create module
``` js
CreateModule({
	name: 'Name',
	data: {},
	options: {},
	hooks: {
		beforeCreate: function () {},
		create: function () {
			this._create()
		},
		bindEvent: function () {
			$(el).on(getEventName('click', this.hash), this._onClick)
		},
		afterCreate: function () {}
	},
	privateMethods: {
		_create: function () {},
		_onClick: function (e) {},
		_examplePrivateMethod: function (e) {}
	},
	publicMethods: {
		examplePublicMethod: function (e) {
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

### Patch Notes
#### v 1.1 
Add global storage

#### v 1.0
Release