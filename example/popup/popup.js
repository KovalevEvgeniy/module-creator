/**
* @ModuleCreator version 1.3.1
* @module Popup
* @example $.popup(object)
* @author Author name
**/
$.CreateModule({
	name: 'Popup',
	options: {
		btnDataName: 'popup-open',
		popupDataName: 'popup-id',
		closeDataName: 'popup-close',
		hashDataName: 'popup-hash',

		bodyOpenedClass: 'have-opened-popup',
		setHash: true
	},
	hooks: {
		create: function () {
			this._init();
		},
		bindEvent: function () {
			$(document).on(this._getEventName('click'), `[data-${this.options.btnDataName}]`, this._onBtnClick);
			$(document).on(this._getEventName('click'), `[data-${this.options.closeDataName}]`, this._onCloseClick);
		}
	},
	privateMethods: {
		_init: function () {

		},
		_onBtnClick (event) {
			const btn = $(event.currentTarget)
			const id = btn.data(this.options.btnDataName)

			this._open(id)
		},
		_onCloseClick (event) {
			const btn = $(event.currentTarget)
			const id = btn.data(this.options.closeDataName)

			this._close(id)
		},
		_open (id) {
			const inst = this
			const popup = $(`[data-${inst.options.popupDataName}="${id}"]`)


			inst._closeAll(function () {
				popup.addClass('popup-active')
				$('body').addClass(inst.options.bodyOpenedClass)

				inst._show(popup)
				inst._setHash(popup)

				$(document).trigger('popupopen', popup, id);
			})
		},
		_show (popup) {},
		_closeAll (callback = $.noop) {
			const popups = $(`[data-${this.options.popupDataName}].popup-active`)

			for (var i = 0; i < popups.length; i++) {
				let id = popups.eq(i).data(this.options.popupDataName)
				this._close(id)
			}

			if (callback) {
				callback()
			}
		},
		_close (id) {
			const popup = $(`[data-${this.options.popupDataName}="${id}"]`)
			popup.removeClass('popup-active')
			$('body').removeClass(this.options.bodyOpenedClass)

			this._hide(popup)
			if (this.options.setHash) {
				history.pushState('', '', location.origin);
			}

			$(document).trigger('popupclose', popup, id)
		},
		_hide (popup) {},
		_setHash (popup) {
			if (this.options.setHash) {
				let hash = popup.data(this.options.hashDataName)
				let id = popup.data(this.options.popupDataName)

				if (hash !== false) {
					if (hash === undefined) {
						hash = id
					}
					location.hash = hash;
				}
			}
		}
	},
	publicMethods: {
		open (id) {
			this.private._open(id)
		},
		close (id) {
			this.private._close(id)
		}
	}
});
