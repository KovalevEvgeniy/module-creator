/**
* @ModuleCreator version 1.2.0
* @module TestName
* @plugin testName
* @example $.testName(object) || $('#example').testName(object)
* @author Kovalev Evgeniy
**/
$(function () {
	$.CreateModule({
		name: 'TestName',
		data: {},
		options: {
			succesStyle: 'color: #bada55',
			errorStyle: 'color: #ff528a',
			lifeStyle: 'color: #777'
		},
		hooks: {
			beforeCreate: function () {console.log('%c' + 'Life cycle: beforeCreate', this.options.lifeStyle)},
			create: function () {
				console.log('%c' + 'Life cycle: create', this.options.lifeStyle);
				this._init()
			},
			bindEvent: function () {
				console.log('%c' + 'Life cycle: bindEvent', this.options.lifeStyle);
				$(this.element).on(this._getEventName('click', this.hash), this._testClick)
				$(this.element).trigger('click')
			},
			afterCreate: function () {console.log('%c' + 'Life cycle: afterCreate', this.options.lifeStyle);},
			customHook: function () {
				this._console(`Hook is working`, true)
			}
		},
		privateMethods: {
			_init: function () {
				if (this.options.exampleOption) {
					console.log('base initing')
				}
				this._tests()
			},
			_getEventList: function () {
				return $.extend({}, this.super('_getEventList'), {
					'myEvent': 'myMobileEvent'
				})
			},
			_onClick: function (e) {
				// this - инст модуля
				var element = $(e.currentTarget)
				console.log('anithing code')
				
			},
			_examplePrivateMethod: function () {
				var element = this.element
				console.log('private code');
			},
			_console: function (message, success) {
				if (success) {
					console.log('%c' + message, this.options.succesStyle)
				} else {
					console.log('%c' + message, this.options.errorStyle)
				}
			},

			_tests: function () {
				console.log('Tests:');

				this._testHook()
				this._testEditable('storage')
				this._testEditable('list')
				this._testEditable('data')
				this._testEditable('options')
			},
			_testHook: function () {
				try {
					this.hook('customHook');
				} catch (err) {
					this._console(`Hook dont working`, false)
				}
			},
			_testEditable: function (name) {
				console.log(name + ':');
				let isEditableObject = false
				let isRewritableProp = false
				try {
					this[name] = 'test string';
				} catch (err) {}

				if (typeof this[name] === 'object') {
					this[name].test = 'test string';
					if (typeof this[name].test === 'string') {
						isRewritableProp = true
					}
				} else {
					isEditableObject = true
				}

				if (isEditableObject) {
					this._console(`Object "${name}" is editable`, false)
				} else {
					this._console(`Object "${name}" is not editable`, true)
				}

				if (isRewritableProp) {
					this._console(`Object "${name}" properties rewritable`, true)
				} else {
					this._console(`Object "${name}" is not properties rewritable`, false)
				}
			},
			_testClick: function (e) {
				if (e.type === 'click') {
					console.log('Event: ' + true);
				}
			}
		},
		publicMethods: {
			test: function (e) {
				try {
					this.private = 'test string';
				} catch (err) {
					this.private._console('Object "private" is not editable', true)
				}

				if (typeof this.private === 'object') {
					if (this.private && this.private._console) {
						this.private._console('Private methods are available from the public method', true)
					} else {
						this.private._console('Private methods are not available from the public method', false)
					}
				} else {
					console.log('%c' + 'Object "private" is editable', 'color: #ff528a')
				}
			}
		}
	});
});

$(function() {
	$('#example').testName()
	$('#example').testName('test')
})
