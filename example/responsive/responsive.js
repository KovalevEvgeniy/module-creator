
/**
 * @ModuleCreator version 1.4.9
 * https://github.com/KovalevEvgeniy/module-creator
 * @module ModuleResponsive
 * Usage: extend only
 *     extends: ['moduleResponsive'],
 * @author Kovalev Evgeniy
 **/
$.CreateModule({
	name: 'ModuleResponsive',
	options: {
		mobileFirst: false,
		breakpoints: [320, 760, 960, 1280, 1680],
		currentBreakpoint: 0,
		responsive: {
			// '760': {},
			// '960': {},
			// '1280': {},
			// '1680': {}
		}
	},
	hooks: {
		create() {
			$(window).on(this._getEventName('resize'), this._onChangeBreakpoint);
		},
		changeBreakpoint(newBreakpoint, oldBreakpoint) {
			$(document).trigger('changebreakpoint', [newBreakpoint, oldBreakpoint]);
		}
	},
	privateMethods: {
		_getOption (options, key) {
			if (options.responsive && typeof options.responsive === 'object') {
				let breakpoints = Object.keys(options.responsive).sort((a, b) => {
					return parseFloat(a) - parseFloat(b);
				});

				if (!options.mobileFirst) {
					breakpoints.reverse();
				}

				const windowWidth = $(window).outerWidth();
				let value = options[key];

				breakpoints.map(breakpoint => {
					const currentValue = options.responsive[breakpoint][key];
					const validSize = options.mobileFirst ? windowWidth > breakpoint : windowWidth < breakpoint;

					if (validSize && typeof(currentValue) !== 'undefined') {
						value = currentValue;
					}
				});

				return value;
			} else {
				return options[key];
			}
		},
		_onChangeBreakpoint (event) {
			const currentWidth = $(window).width();
			const oldBreakpoint = this.options.currentBreakpoint;
			let currentBreakpoint = Infinity;

			this.options.breakpoints.sort((a, b) => a - b).map(breakpoint => {
				if (currentWidth > breakpoint) {
					currentBreakpoint = breakpoint;
				}
			});

			if (currentBreakpoint !== oldBreakpoint) {
				this.options.currentBreakpoint = currentBreakpoint;
				this.hook('changeBreakpoint', currentBreakpoint, oldBreakpoint);
			}
		}
	},
	publicMethods: {}
});
