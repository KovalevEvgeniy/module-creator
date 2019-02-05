;(function ($) {
	$.CreateModule = function (props = {}) {
		const name = props.name;
		const lib = name.substr(0,1).toLowerCase() + name.substr(1);
		const list = {};
		const storage = {};

		class Module {
			constructor(el, options = {}) {
				const inst = this;
				Object.defineProperty(inst, "storage", { get: () => storage });
				Object.defineProperty(inst, "list", { get: () => list });

				inst.element = $(el);

				if (inst.element.length > 1) {
					inst.element.each(function (index, el) {
						new $[name](el, options);
					});
					return;
				}

				el = inst.element.get(0);
				inst.hash = el.hash = Math.round(new Date() * Math.random());
				inst.data = Object.assign({}, (props.data || {}), (options.data || {}));
				inst.options = Object.assign({}, (props.options || {}), (options.options || {}), {hash: inst.hash});

				let hooks = Object.assign({}, props.hooks, options.hooks);
				inst.hooks = function (name) {
					if (hooks[name]) {
						hooks[name].apply(inst, Array.prototype.slice.call(arguments, 1));
					}
				};

				inst.hooks('beforeCreate');

				let privateMethods = {};
				if (props.privateMethods) {
					for (let key in props.privateMethods) {
						if (key[0] !== '_') {
							throw ('The name of the private method must begin with "_". Rename the method ' + key);
						}
						inst[key] = privateMethods[key] = props.privateMethods[key].bind(inst);
					}
				}

				el[lib] = {
					data: inst.data,
					destroy: function () {
						inst._destroy();
					}
				};

				if (props.publicMethods) {
					for (let key in props.publicMethods) {
						el[lib][key] = props.publicMethods[key].bind({inst: el[lib], private: privateMethods});

						if (inst[key]) {
							throw ('The ' + key + ' method is already defined in a private scope!');
						}
						if (key[0] === '_') {
							throw ('The public method should not start with "_". Rename the method ' + key);
						}
					}
				}

				inst.hooks('create');
				inst.hooks('bindEvent');
				inst.hooks('afterCreate');
			}

			_getEventList () {
				return {
					'click': 'touchstart',
					'mousedown': 'touchstart',
					'mouseup': 'touchend'
				}
			}

			_getEventName (eventName, namespace) {
				namespace = (namespace ? '.' + namespace : '') + '.' + this.hash;
				return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (_getEventList()[eventName] || eventName) + namespace : eventName + namespace);
			}

			_destroy () {
				let el = this.element.get(0)

				delete this.list[this.hash];
				delete el.hash;
				delete el[lib];
			}
		}

		$[lib] = $[lib] || ($.fn[lib] = function () {
			let selector = this;
			if (typeof selector === 'function') {
				selector = $[lib].element || $('<div>');
				$[lib].element = selector;
			}
			let opt = arguments[0],
				args = Array.prototype.slice.call(arguments, 1),
				l = selector.length,
				ret = selector;

			for (let i = 0; i < l; i++) {
				if (typeof opt == 'object' || typeof opt == 'undefined') {
					let inst = new Module(selector[i], opt);
					inst.list[inst.hash] = inst;
				} else {
					ret = (selector[i][lib][opt].apply(selector[i][lib], args) || selector);
				}
			}

			return ret;
		});
	}
})(jQuery);

