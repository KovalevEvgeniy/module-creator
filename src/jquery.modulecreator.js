;(function ($) {
	$.CreateModule = function (props = {}) {
		const name = props.name;
		const getLibName = function (name) {
			return name.substr(0,1).toLowerCase() + name.substr(1);
		}
		const lib = getLibName(name);
		const list = {};
		const storage = {};
		

		class Module {
			constructor(el, options = {}) {
				const inst = this;
				let inheritOptipns = {}

				inst.struct = props

				if (props.extends && props.extends.length > 0) {
					for (let key in props.extends) {
						let name = props.extends[key]
						let parentInstans = $[getLibName(name)]();
						let parentStruct = parentInstans[getLibName(name)]('getStruct');

						// Add the ability to call private parent methods with super
						inst._extend(inst.__proto__, parentStruct.privateMethods)

						// Updated our properties using the parent struct and save him in struct of the current instance
						inst.struct = inst._extend({}, parentStruct, props);
						props = inst.struct;
					}
				}

				Object.defineProperty(inst, "storage", {
					get: () => storage,
					set (val) {
						throw new Error('Setting the value to "' + val + '" failed. Object "storage" is not editable');
					}
				});
				Object.defineProperty(inst, "list", {
					get: () => list,
					set (val) {
						throw new Error('Setting the value to "' + val + '" failed. Object "list" is not editable');
					}
				});

				inst.element = $(el);

				if (inst.element.length > 1) {
					inst.element.each(function (index, el) {
						new $[name](el, options);
					});
					return;
				}

				el = inst.element.get(0);
				inst.hash = el.hash = Math.round(new Date() * Math.random());
				
				const privateData = inst._extend({}, (props.data || {}), (options.data || {}))
				Object.defineProperty(inst, "data", {
					get: () => privateData
				});
				const privateOptions = inst._extend({}, (props.options || {}), (options.options || {}), {hash: inst.hash})
				Object.defineProperty(inst, "options", {
					get: () => privateOptions
				});
				const hooks = inst._extend({}, props.hooks, options.hooks);
				Object.defineProperty(inst, "hook", {
					get: () => (function (name, ...args) {
						if (hooks[name]) {
							return hooks[name].apply(inst, args);
						}
					})
				});
				Object.defineProperty(inst, "super", {
					get: () => (function (name, ...args) {
						if (this.__proto__[name]) {
							return inst.__proto__[name].apply(this, args);
						}
					})
				});

				inst.hook('beforeCreate');

				let privateMethods = {};
				if (props.privateMethods) {
					for (let key in props.privateMethods) {
						if (key[0] !== '_') {
							throw new Error('The name of the private method must begin with "_". Rename the method ' + key);
						}
						inst[key] = privateMethods[key] = props.privateMethods[key].bind(inst);
					}
				}

				el[lib] = {
					data: inst.data,
					getStruct () {
						return inst._getStruct();
					},
					destroy () {
						inst._destroy();
					}
				};

				if (props.publicMethods) {
					for (let key in props.publicMethods) {
						const publicContext = {}
						Object.defineProperty(publicContext, "inst", {
							get: () => el[lib]
						});
						Object.defineProperty(publicContext, "private", {
							get: () => privateMethods,
							set (val) {
								throw new Error('Setting the value to "' + val + '" failed. Object "private" is not editable');
							}
						});
						el[lib][key] = props.publicMethods[key].bind(publicContext);

						if (inst[key]) {
							throw new Error('The ' + key + ' method is already defined in a private scope!');
						}
						if (key[0] === '_') {
							throw new Error('The public method should not start with "_". Rename the method ' + key);
						}
					}
				}

				inst.hook('create');
				inst.hook('bindEvent');
				inst.hook('afterCreate');
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
				return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (this._getEventList()[eventName] || eventName) + namespace : eventName + namespace);
			}

			_destroy () {
				let el = this.element.get(0)

				delete this.list[this.hash];
				delete el.hash;
				delete el[lib];
			}

			_extend (result = {}, ...objects) {
				for (let i = 0; i < objects.length; i++) {
					let obj = objects[i];

					for (let key in obj) {
						let current = obj[key]

						if (typeof current === 'function') {
							result[key] = current
						} else if (Array.isArray(current)) {
							let tmpArr = current.slice()

							result[key] = tmpArr
						} else if (typeof current === 'object') {
							let tmpObj = {}

							if (Array.isArray(result[key])) {
								tmpObj = this._extend({}, current)
							} else if (typeof result[key] === 'object') {
								tmpObj = this._extend(result[key], current)
							} else {
								tmpObj = this._extend({}, current)
							}

							result[key] = tmpObj
						} else {
							result[key] = current
						}
					}
				}

				return result
			}

			_deepCopy (target) {
				if (typeof target === 'function') {
					return target
				} else if (Array.isArray(target)) {
					let tmpArr = target.slice()

					for (var i = 0; i < tmpArr.length; i++) {
						tmpArr[i] = this._deepCopy(tmpArr[i])
					}

					return tmpArr
				} else if (typeof target === 'object') {
					let tmpObj = this._extend({}, target)

					for (let key in tmpObj) {
						tmpObj[key] = this._deepCopy(tmpObj[key])
					}

					return tmpObj
				} else {
					return target
				}
			}

			_getStruct () {
				return this._deepCopy(this.struct)
			}
		}

		$[lib] = $[lib] || ($.fn[lib] = function () {
			let selector = this;
			if (typeof selector === 'function') {
				selector = $[lib].element || $('<div>');
				$[lib].element = selector;
			}

			let options = arguments[0];
			let args = Array.prototype.slice.call(arguments, 1);
			let result = selector;

			for (let i = 0; i < selector.length; i++) {
				if (typeof options == 'object' || typeof options == 'undefined') {
					let inst = new Module(selector[i], options);
					inst.list[inst.hash] = inst;
				} else {
					result = (selector[i][lib][options].apply(selector[i][lib], args) || selector);
				}
			}

			return result;
		});
	}
})(jQuery);
