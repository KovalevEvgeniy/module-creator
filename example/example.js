/**
* @ModuleCreator version 1.0
* @module ModuleName
* @plugin moduleName
* @example $.moduleName(object)
* @author Kovalev Evgeniy
**/
$(function () {
	$.CreateModule({
		name: 'ModuleName',
		data: {},
		options: {
			exampleOption: false,
		},
		hooks: {
			beforeCreate: function () {},
			create: function () {
				this._create()
			},
			bindEvent: function () {
				$(this.element).on(getEventName('click', this.hash), this._onClick)
			},
			afterCreate: function () {},
			customHook: function () {
				console.log('custom code')
			}
		},
		privateMethods: {
			_create: function () {
				if (this.options.exampleOption) {
					console.log('base initing')
				}
				$(this.element).trigger('create', {})
			},
			_onClick: function (e) {
				// this - инст модуля
				var element = $(e.currentTarget)
				console.log('anithing code')
				this.hooks('customHook')
			},
			_examplePrivateMethod: function () {
				var element = this.element
				console.log('private code');
			}
		},
		publicMethods: {
			examplePublicMethod: function (e) {
				// this.inst - инст модуля
				// this.private - доступ к приватным методам из публичной области
				this.private._examplePrivateMethod()
			}
		}
	});
});

