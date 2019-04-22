;(function ($) {
	$.CreateModule = function (props = {}) {
		class Tools {
			static run () {
				Tools.props = props

				Tools.extendProps()
				Tools.makeLib()
			}

			static getLibName (name) {
				return name.substr(0,1).toLowerCase() + name.substr(1);
			}

			static makeLib () {
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

				$[lib].struct = props
			}

			static extendProps () {
				if (props.extends && props.extends.length > 0) {
					Tools.parents = {}
					Tools.parent = {}
					let parentsProps = props.extends.map(function (parentName) {
						let parentStruct = $[Tools.getLibName(parentName)].struct
						Tools.parents[parentName] = parentStruct.privateMethods
						return parentStruct
					})

					Tools.parentMethods = Tools.extend({}, ...parentsProps).privateMethods;
					props = Tools.extend({}, ...parentsProps, props);
				}
			}

			static extend (target = {}, ...objects) {
				for (let i = 0; i < objects.length; i++) {
					let obj = objects[i];

					for (let key in obj) {
						let current = obj[key]

						if (typeof current === 'function') {
							target[key] = current
						} else if (Array.isArray(current)) {
							let tmpArr = current.slice()

							target[key] = tmpArr
						} else if (typeof current === 'object') {
							let tmpObj = {}

							if (Array.isArray(target[key])) {
								tmpObj = Tools.extend({}, current)
							} else if (typeof target[key] === 'object') {
								tmpObj = Tools.extend(target[key], current)
							} else {
								tmpObj = Tools.extend({}, current)
							}

							target[key] = tmpObj
						} else {
							target[key] = current
						}
					}
				}

				return target
			}

			static deepCopy (target) {
				if (typeof target === 'function') {
					return target
				} else if (Array.isArray(target)) {
					let tmpArr = target.slice()

					for (var i = 0; i < tmpArr.length; i++) {
						tmpArr[i] = Tools.deepCopy(tmpArr[i])
					}

					return tmpArr
				} else if (typeof target === 'object') {
					let tmpObj = Tools.extend({}, target)

					for (let key in tmpObj) {
						tmpObj[key] = Tools.deepCopy(tmpObj[key])
					}

					return tmpObj
				} else {
					return target
				}
			}
		}

		const name = props.name;
		const lib = Tools.getLibName(name);
		const list = {};
		const storage = {};

		Tools.run()

		class Module {
			constructor(el, options = {}) {
				const inst = this;
				let inheritOptipns = {};

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

				Tools.extend(inst.__proto__, Tools.parentMethods);
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

			_extend (target = {}, ...objects) {
				return Tools.extend(target, ...objects)
			}

			_deepCopy (target) {
				return Tools.deepCopy(target)
			}
		}
	}
})(jQuery);
