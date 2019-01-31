/*
 * CreateModule (jquery.modulecreator.js) 1.1 | MIT & BSD
 */
;(function ($) {
	$.CreateModule = function (props) {
		props = props || {};
		var name = props.name;
		var lib = name.substr(0,1).toLowerCase() + name.substr(1);
		var list = {};
		var storage = {};

		var Module = function (el, options) {
			var inst = this;
			var storage = {};
			Object.defineProperty(inst, "storage", {
				get: function() {
					return storage;
				}
			});
			options = options || {};
			inst.data = $.extend({}, (props.data || {}), (options.data || {}));
			inst.list = list;
			inst.element = $(el);

			if (inst.element.length > 1) {
				inst.element.each(function (index, el) {
					new window[name](el, options);
				});
				return;
			}

			el = inst.element.get(0);
			inst.hash = Math.round(new Date() * Math.random());
			el.hash = inst.hash;
			inst.options = $.extend({}, (props.options || {}), (options.options || {}), {hash: inst.hash});
			var hooks = $.extend({}, props.hooks, options.hooks);
			inst.hooks = function (name) {
				if (hooks[name]) {
					hooks[name].apply(inst, Array.prototype.slice.call(arguments, 1));
				}
			};
			inst.getEventName = getEventName = function (eventName, namespace) {
				namespace = (namespace ? '.' + namespace : '') + '.' + inst.hash;

				var events = {
					'click' : 'touchstart',
					'mousedown' : 'touchstart',
					'mouseup' : 'touchend'
				};

				return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (events[eventName] || eventName) + namespace : eventName + namespace);
			};

			inst._destroy = function () {
				delete inst.list[inst.hash];
				delete el.hash;
				delete el[lib];
			};

			inst.hooks('beforeCreate');

			// private methods
			var privateMethods = {};
			if (props.privateMethods) {
				for (var key in props.privateMethods) {
					if (key[0] !== '_') {
						throw ('The name of the private method must begin with "_". Rename the method ' + key);
					}
					inst[key] = props.privateMethods[key].bind(inst);
					privateMethods[key] = props.privateMethods[key].bind(inst);
				}
			}

			el[lib] = {
				data: inst.data,
				destroy: function () {
					inst._destroy();
				}
			};

			// private methods
			if (props.publicMethods) {
				for (var key in props.publicMethods) {
					el[lib][key] = props.publicMethods[key].bind({inst: el[lib], private: privateMethods});

					if (inst[key]) {
						throw ('The ' + key + ' method is already defined in a private scope!');
					}
				}
			}

			inst.hooks('create');
			inst.hooks('bindEvent');
			inst.hooks('afterCreate');
		};
		$[lib] = $[lib] || ($.fn[lib] = function () {
			var selector = this;
			if (typeof selector === 'function') {
				selector = $[lib].element || $('<div>');
				$[lib].element = selector;
			}
			var opt = arguments[0],
				args = Array.prototype.slice.call(arguments, 1),
				l = selector.length,
				ret = selector;

			for (var i = 0; i < l; i++) {
				if (typeof opt == 'object' || typeof opt == 'undefined') {
					var inst = new Module(selector[i], opt);
					inst.list[inst.hash] = inst;
				} else {
					ret = (selector[i][lib][opt].apply(selector[i][lib], args) || selector);
				}
			}

			return ret;
		});
	}
})(jQuery);

