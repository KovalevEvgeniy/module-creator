
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
		responsive: {
			// '760': {},
			// '960': {},
			// '1280': {},
			// '1680': {}
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
		}
	},
	publicMethods: {}
});
