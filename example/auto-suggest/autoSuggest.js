/**
 * @ModuleCreator version 1.2.0
 * @module AutoSuggest
 * @plugin autoSuggest
 * @example $.autoSuggest(object)
 * @author Kovalev Evgeniy
 **/


$(function () {
	$.CreateModule({
		name: 'AutoSuggest',
		data: {},
		options: {
			editable: true,
			filtred: true,
			value: '',
			ajaxUrl: '',
			attrs: {
				name: ''
			},
			placeholder: ''
		},
		hooks: {
			beforeCreate: function () {},
			create: function () {
				this._create();
			},
			bindEvent: function () {
				var inst = this
				var input = this.views.input
				var list = this.views.list

				input.on(inst._getEventName('click'), inst._onClickInput)
				input.on(inst._getEventName('keyup'), inst._onPressKey);

				list.parent().on(this._getEventName('mousedown'), '.js-suggest-item', this._onTouchStart);
			}
		},
		privateMethods: {
			_create: function () {
				var inst = this
				var element = inst.element
				var items = element.find('span')
				var list = inst.options.ajaxUrl ? inst._createList() : inst._createList(items)
				element.empty()
				var input = inst._createInput()
				inst.views = {
					input: input,
					list: list
				}

				if (element.hasClass('disabled')) {
					input.attr('disabled', true);
				}
				if (inst.options.value) {
					inst._setValue(inst.options.value, inst.options.name)
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
					tpl = $('<input>')
						.attr(inst.options.attrs)
						.addClass('js-suggest-input')
						.attr('placeholder', inst.options.placeholder);
				} else {
					var input = $('<input>').attr(inst.options.attrs).attr('name', inst.options.name).attr('type', 'hidden')
					inst.element.append(input)
					tpl = $('<div>').addClass('js-suggest-input')
				}

				return tpl
			},
			_onClickInput: function (e) {
				e.stopPropagation();

				var inst = this;

				var isOpen = $(e.currentTarget).parent().hasClass('opened');
				var isDisabled = $(e.currentTarget).parent().hasClass('disabled');
				var list = $(e.currentTarget).parent().find('.js-suggest-list');

				if (!isDisabled && !inst.options.ajaxUrl) {
					if (isOpen) {
						inst._closeList()
					} else {
						inst._openList()
					}
				}
			},
			_createList: function (items) {
				var inst = this
				var tpl = $('<div>').addClass('js-suggest-list')

				if (items) {
					$(items).each(function (index, item) {
						tpl.append(inst._createItem(index, item))
					})
				}

				return tpl
			},
			_updateListContent (items) {
				const inst = this;

				if (items && items.length > 0) {
					this.views.list.empty();
					$(items).each( (index, item) => {
						this.views.list.append(inst._createItem(index, item));
					})
				}
			},
			_createItem: function (index, item) {
				var inst = this
				var text = typeof(item) === 'string' ? item : $(item).text();

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
						$(document).on(inst._getEventName('mousedown'), inst._onTouchStart)
						$(document).on(inst._getEventName('keyup'), inst._onPressKey)
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
				$(document).off(inst._getEventName('mousedown'))
				$(document).off(inst._getEventName('keyup'))
			},
			_selectItem: function (el) {
				var inst = this
				var item = $(el)
				var text = item.find('span').text()

				item.parents('.js-suggest-list').find('.js-suggest-item').each(function (index, el) {
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
				} else if (inst.options.editable && !inst.options.ajaxUrl) {
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
				} else if (inst.options.editable && inst.options.ajaxUrl) {
					clearTimeout(inst.timer);
					inst.timer = setTimeout(() => {
						if (value.length >= 2) {
							inst._getJSON(function (data) {
								const items = data.items;

								inst._updateListContent(items);

								if (typeof(data) != 'undefined') {
									inst._openList();
								} else {
									inst._closeList();
								}
							})
						} else if (value.length < 1) {
							inst._closeList();
						}
					}, 400);
				}
			},
			_getJSON: function(callback) {
				const inst = this;
				const value = inst.views.input.val();

				return $.ajax({
					url: this.options.ajaxUrl,
					data: {
						q: value
					},
					success: callback
				});
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
			},

			_onOutClick: function (event) {
				if (this.element.find(event.target).length === 0 && this.element !== $(event.target)) {
					this._closeList();
				}
			},

			_onTouchStart: function(event) {
				this.touchStart = event.screenY || event.touches[0].screenY;

				$(document).on(this._getEventName('mousemove'), this._onTouchMove);
				this.views.list.parent().on(this._getEventName('mouseup'), '.js-suggest-item', this._onTouchEnd);
				$(document).on(this._getEventName('mouseup'), this._onClearEvent);
			},
			_onTouchMove: function(event) {
				this.touchDiff = Math.abs(this.touchStart - (event.screenY || event.touches[0].screenY));
			},
			_onTouchEnd: function(event) {
				const item = $(event.currentTarget);

				if ((this.touchDiff || 0) < 10) {
					this._selectItem(item)
					this._closeList();
				}

				this.views.list.parent().off(this._getEventName('mouseup'));
				$(document).off(this._getEventName('mousemove'));
			},
			_onClearEvent: function(event) {
				if ((this.touchDiff || 0) < 10) {
					this._onOutClick(event);
				}
				this.touchDiff = 0;
				$(document).off(this._getEventName('mouseup'));
			},
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
});
