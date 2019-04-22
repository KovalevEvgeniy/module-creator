/**
* @ModuleCreator version 1.2.0
* @module TestName
* @plugin testName
* @example $.testName(object) || $('#example').testName(object)
* @author Kovalev Evgeniy
**/
const Test = {
	styles: {
		succes: 'color: #25a3ec',
		error: 'color: #d62020',
		life: 'color: #777'
	},
	log (message, type) {
		if (type === 'success') {
			console.log('%c 🔵 ' + message, this.styles.succes)
		} else if (type === 'error') {
			console.log('%c 🔴 ' + message, this.styles.error)
		} else if (type === 'life') {
			console.log('%c ⚫️ ' + message, this.styles.life)
		}
	}
};

$(function () {
	$.CreateModule({
		name: 'TestParent',
		data: {},
		options: {
			parentOption: true
		},
		hooks: {
			parentHook: function () {
				return true
			}
		},
		privateMethods: {
			_parentMethod: function () {
				return true
			},
			_testExtends: function () {
				return true
			},
			_testHigthLvlExtend: function () {
				return true
			},
			_testHigthLvlSuper: function () {
				return false
			},
			_testExtend: function () {
				Test.log(`Parent method called for name TestParent`, 'life')
				return true
			}
		}
	});

	$.CreateModule({
		name: 'TestParent2',
		data: {},
		options: {
			parentOption_2: true
		},
		hooks: {
			parentHook_2: function () {
				return true
			}
		},
		privateMethods: {
			_parentMethod_2: function () {
				return true
			},
			_testExtends_2: function () {
				return true
			},
			_testExtend: function (isSuper) {
				Test.log(`Parent method called for ${isSuper ? 'super' : 'name'} TestParent2`, 'life')
				return true
			}
		}
	});

	$.CreateModule({
		name: 'TestName',
		extends: ['testParent', 'testParent2'],
		data: {
			data1: true,
			data2: false,
		},
		options: {
			option1: true,
			option2: false,
		},
		hooks: {
			beforeCreate: function () {
				Test.log(`Life cycle: beforeCreate`, 'life')
			},
			create: function () {
				Test.log(`Life cycle: create`, 'life')
				this._init()
			},
			bindEvent: function () {
				Test.log(`Life cycle: bindEvent`, 'life')
				$(this.element).on(this._getEventName('click', this.hash), this._testClick)
				$(this.element).trigger('click')
			},
			afterCreate: function () {
				Test.log(`Life cycle: afterCreate`, 'life')
			},
			customHook: function () {
				Test.log(`Hook is working`, 'success')
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
			_examplePrivateMethod: function () {
				var element = this.element
				console.log('private code');
			},
			_tests: function () {
				console.log('Tests:');

				this._testHook()
				this._testEditable('storage')
				this._testEditable('list')
				this._testEditable('data')
				this._testEditable('options')
				this._testExtends()
				this._testInstanceOptions()
			},
			_testHook: function () {
				try {
					this.hook('customHook')
				} catch (err) {
					Test.log(`Hook dont working`, 'error')
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
					Test.log(`Object "${name}" is editable`, 'error')
				} else {
					Test.log(`Object "${name}" is not editable`, 'success')
				}

				if (isRewritableProp) {
					Test.log(`Object "${name}" properties rewritable`, 'success')
				} else {
					Test.log(`Object "${name}" is not properties rewritable`, 'error')
				}
			},
			_testClick: function (e) {
				if (e.type === 'click') {
					Test.log(`Event is available`, 'success')
				}
			},
			_testExtends: function () {
				console.log('extends:');
				if (this.options.parentOption && this.options.parentOption_2) {
					Test.log(`Parent options is available`, 'success')
				} else {
					Test.log(`Parent options is not available`, 'error')
				}

				try {
					this._parentMethod()
					this._parentMethod_2()
					Test.log(`Parent methods is available`, 'success')
				} catch (err) {
					Test.log(`Parent methods is not available`, 'error')
				}

				if (this.hook('parentHook') && this.hook('parentHook_2')) {
					Test.log(`Parent hooks is available`, 'success')
				} else {
					Test.log(`Parent hooks is not available`, 'error')
				}

				if (this.super('_testExtends') && this.super('_testExtends_2')) {
					Test.log(`Parent methods to be called with super`, 'success')
				} else {
					Test.log(`Parent methods cannot be called with super`, 'error')
				}
			},
			_testInstanceOptions () {
				console.log('instance properties:');
				if (this.options.option1) {
					Test.log(`Default options is available`, 'success')
				} else {
					Test.log(`Default options is not available`, 'error')
				}
				if (this.options.option2) {
					Test.log(`Inctance initing options is available`, 'success')
				} else {
					Test.log(`Inctance initing options is not available`, 'error')
				}
				if (this.data.data1) {
					Test.log(`Default data is available`, 'success')
				} else {
					Test.log(`Default data is not available`, 'error')
				}
				if (this.data.data2) {
					Test.log(`Inctance initing data is available`, 'success')
				} else {
					Test.log(`Inctance initing data is not available`, 'error')
				}

				this._defaultMethod()
				this.element.testName('default')
			},
			_defaultMethod () {
				Test.log(`Inctance initing private method is not available`, 'success')
			}
		},
		publicMethods: {
			test: function (e) {
				try {
					this.private = 'test string';
				} catch (err) {
					Test.log(`Object "private" is not editable`, 'success')
				}

				if (typeof this.private === 'object') {
					if (this.private && this.private._tests) {
						Test.log(`Private methods are available from the public method`, 'success')
					} else {
						Test.log(`Private methods are not available from the public method`, 'error')
					}
				} else {
					Test.log(`Object "private" is editable`, 'error')
				}
			},
			default: function () {
				Test.log(`Inctance initing public method is not available`, 'success')
			}
		}
	});

	$.CreateModule({
		name: 'TestChild',
		extends: ['TestName'],
		data: {},
		options: {},
		hooks: {
			create: function () {
				Test.log(`Life cycle: create`, 'life')
				this._testExtendsChild()
			},
			bindEvent: function () {
				// not parent hook
			}
		},
		privateMethods: {
			_testExtendsChild: function () {
				this.super('_testExtend', true)

				if (this.super('testParent', '_testExtend') && this.super('testParent2', '_testExtend')) {
					Test.log(`Parent hight lvl methods to be called with super`, 'success')
				} else {
					Test.log(`Parent hight lvl methods cannot be called with super`, 'error')
				}
				return true
			}
		},
		publicMethods: {
			testExtendsChild: function () {
				if (this.private._testHigthLvlExtend()) {
					Test.log(`Parent hight lvl methods is available`, 'success')
				} else {
					Test.log(`Parent hight lvl methods are not available`, 'error')
				}
			}
		}
	});
});

$(function() {
	$('#example').testName({
		hooks: {},
		data: {
			data2: true
		},
		options: {
			option2: true
		},
		publicMethods: {
			_defaultMethod: function () {
				Test.log(`Inctance initing private method is available`, 'error')
			}
		},
		publicMethods: {
			default: function () {
				Test.log(`Inctance initing public method is available`, 'error')
			}
		}
	})
	$('#example').testName('test')

	console.log('------------------------------');
	console.log('Children tests:');
	$('#example').testChild()
	$('#example').testChild('testExtendsChild')
});

