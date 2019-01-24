$.CreateModule({
	name: 'AutoSuggest',
	data: {},
	options: {
		editable: true,
		filtred: true,
		value: '',
		attrs: {
			name: ''
		}
	},
	hooks: {
		beforeCreate: function () {},
		create: function () {
			this._create()
		},
		bindEvent: function () {
			var inst = this
			var input = this.views.input
			var list = this.views.list

			$(document).on(inst.getEventName('click'), inst._onClick)
			input.on(inst.getEventName('click'), inst._onClickInput)
			list.on(inst.getEventName('click'), '.js-suggest-item', function (e) {
				inst._selectItem(e.currentTarget)
			})
		},
		afterCreate: function () {},
	},
	privateMethods: {
		// olol: function () {},
		_onClick: function () {
			this.hooks('customHook', 'arg1', 'arg2')
		},
		_create: function () {
			console.log(this);
			var inst = this
			var element = inst.element
			var items = element.find('span')
			var list = inst._createList(items)
			element.empty()
			var input = inst._createInput()
			inst.views = {
				input: input,
				list: list
			}

			if (inst.options.value) {
				inst._setValue(inst.options.value)
			}
			element
				.append(input)
				.append(list)
				.addClass('js-suggest')

			element.trigger('created')
		},
		_createInput: function () {
			var inst = this
			var tpl

			if (inst.options.editable) {
				tpl = $('<input>').attr(inst.options.attrs).addClass('js-suggest-input')
			} else {
				var input = $('<input>').attr(inst.options.attrs).attr('type', 'hidden')
				inst.element.append(input)
				tpl = $('<div>').addClass('js-suggest-input')
			}

			return tpl
		},
		_onClickInput: function (e) {
			var inst = this
			e.stopPropagation()
			inst._openList()
			console.log(1);
		},
		_createList: function (items) {
			var inst = this
			var tpl = $('<div>').addClass('js-suggest-list')

			items.each(function (index, item) {
				tpl.append(inst._createItem(index, item))
			})

			return tpl
		},
		_createItem: function (index, item) {
			var inst = this
			var text = $(item).text()
			var tpl = $('<div>').addClass('js-suggest-item')
			var description = $('<span>').appendTo(tpl).text(text)

			if (inst.options.value && inst.options.value == text) {
				tpl.addClass('active')
			}

			return tpl
		},
		_openList: function () {
			var inst = this
			var list = inst.views.list

			for (var key in inst.list) {
				if (inst.hash == key) {
					list.slideDown(75)
					$(document).on(inst.getEventName('click'), inst._closeList)
					$(document).on(inst.getEventName('keyup'), inst._onPressKey)
				} else {
					inst.list[key]._closeList()
				}
			}

			inst.element.addClass('opened')
			inst.element.trigger('open')
		},
		_closeList: function () {
			var inst = this
			var list = inst.views.list

			list.slideUp(75)
			inst.element.removeClass('opened')
			$(document).off(inst.getEventName('click'))
			$(document).off(inst.getEventName('keyup'))
		},
		_selectItem: function (el) {
			var inst = this
			var item = $(el)
			var text = item.find('span').text()

			inst.views.list.find('.js-suggest-item').each(function (index, el) {
				$(el).removeClass('active')
			})

			item.addClass('active')

			inst._setValue(text)
		},
		_onPressKey: function (e) {
			var inst = this
			var value = inst._getValue().toLowerCase()
			var list = inst.views.list
			var items = list.find('.js-suggest-item')

			if (e.key == 'ArrowUp') {
				if (items.hasClass('active')) {
					inst._selectItem(list.find('.js-suggest-item.active').prev(':visible'))
				} else {
					inst._selectItem(list.find('.js-suggest-item:last-child:visible'))
				}
			} else if (e.key == 'ArrowDown') {
				if (items.hasClass('active')) {
					inst._selectItem(list.find('.js-suggest-item.active').next(':visible'))
				} else {
					inst._selectItem(list.find('.js-suggest-item:first-child:visible'))
				}
			} else if (e.key == 'Enter' || e.key == 'Escape') {
				inst._closeList()
			} else if (inst.options.editable) {
				if (value.length == 0) {
					items.show()
				} else {
					items.each(function (index, el) {
						var item = $(el)
						if (item.text().toLowerCase().indexOf(value) >= 0) {
							item.show()
						} else {
							item.hide()
						}
					})
				}
			}
		},
		_setValue: function (text) {
			var inst = this
			var input = inst.views.input

			if (inst.options.editable) {
				input.val(text)
			} else {
				input.text(text)
				input.prev('input').val(text)
			}

			inst.element.trigger('change')
		},
		_getValue: function () {
			var inst = this
			var input = inst.views.input

			if (inst.options.editable) {
				return input.val()
			} else {
				return input.text()
			}
		}
	},
	publicMethods: {
		open: function (e) {
			var inst = this // this.inst - инст экземпляра
			inst.private._openList() // this.private - доступ к приватным методам
		},
		close: function (e) {
			var inst = this
			inst.private._closeList()
		},
		selectItem: function (item) {
			var inst = this
			inst.private._selectItem(item)
		}
	}
});

