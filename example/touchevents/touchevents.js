
/**
 * @ModuleCreator version 1.4.9
 * https://github.com/KovalevEvgeniy/module-creator
 * @module ModuleTouchEvents
 * Usage: extend only
 * extends: ['ModuleTouchEvents'],
 * @author Kovalev Evgeniy
 **/
$.CreateModule({
	name: 'ModuleTouchEvents',
	options: {
		touchMoveRange: 10
	},
	hooks: {
		create() {}
	},
	privateMethods: {
		_addEvent(eventName, target, handler) {
			const events = {
				'tap': () => {
					this._eventTap(eventName, target, handler);
				},
				'swipe': () => {
					this._eventSwipe(eventName, target, handler);
				}
			};

			events[eventName]();
		},
		_eventTap(eventName, target, handler) {
			if (this._isMobile()) {
				$(target).on('touchstart.tap', (eventStart) => {
					let startY = eventStart.screenY || eventStart.touches[0].screenY;
					let startX = eventStart.screenX || eventStart.touches[0].screenX;
					let dy = 0;
					let dx = 0;

					$(document).on('touchmove.tap', (eventMove) => {
						dy = startY - (eventMove.screenY || eventMove.touches[0].screenY);
						dx = startX - (eventMove.screenX || eventMove.touches[0].screenX);
					});

					$(document).on('touchend.tap', (eventEnd) => {
						$(document).off('touchmove.tap');
						$(document).off('touchend.tap');

						if (Math.abs(dy) < this.options.touchMoveRange && Math.abs(dx) < this.options.touchMoveRange) {
							setTimeout(() => {
								console.log('tap');
								handler(eventStart);
							}, 0);
						}
					});
				})
			} else {
				$(target).on('click', handler);
			}
		},
		_eventSwipe(eventName, target, handler) {
			if (this._isMobile()) {
				$(target).on('touchstart.tap', (eventStart) => {
					let startY = eventStart.screenY || eventStart.touches[0].screenY;
					let startX = eventStart.screenX || eventStart.touches[0].screenX;
					let dy = 0;
					let dx = 0;

					$(document).on('touchmove.tap', (eventMove) => {
						dy = startY - (eventMove.screenY || eventMove.touches[0].screenY);
						dx = startX - (eventMove.screenX || eventMove.touches[0].screenX);
					});

					$(document).on('touchend.tap', (eventEnd) => {
						$(document).off('touchmove.tap');
						$(document).off('touchend.tap');

						if (Math.abs(dy) > this.options.touchMoveRange || Math.abs(dx) > this.options.touchMoveRange) {
							setTimeout(() => {
								console.log('swipe');
								handler(eventStart, dx, dy);
							}, 0);
						}
					});
				})
			} else {
				$(target).on('click', handler);
			}
		}
	}
});
