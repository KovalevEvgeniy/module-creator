/*
 * CreateModule (jquery.modulecreator.js) 1.4.5 | MIT & BSD
 * https://github.com/KovalevEvgeniy/module-creator
 */

"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($) {
  $.CreateModule = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var Tools =
    /*#__PURE__*/
    function () {
      function Tools() {
        _classCallCheck(this, Tools);
      }

      _createClass(Tools, null, [{
        key: "run",
        value: function run() {
          Tools.props = props;
          Tools.extendProps();
          Tools.makeLib();
        }
      }, {
        key: "getLibName",
        value: function getLibName(name) {
          return name.substr(0, 1).toLowerCase() + name.substr(1);
        }
      }, {
        key: "makeLib",
        value: function makeLib() {
          $.fn = $.fn || {};
          $[lib] = $[lib] ? $[lib] : $.fn[lib] = function () {
            var selector = this;

            if (typeof selector === 'function') {
              selector = $[lib].element || $('<div>');
              $[lib].element = selector;
            }

            var options = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            var result = selector;

            for (var i = 0; i < selector.length; i++) {
              var item = selector[i];

              if (_typeof(options) === 'object' || typeof options === 'undefined') {
                var inst = new Module(item, options);
                inst.list[inst.hash] = inst;
              } else {
                if (item[lib][options] && typeof item[lib][options] === 'function') {
                  result = item[lib][options].apply(item[lib], args) || selector;
                } else {
                  throw new Error('Method "' + options + '" is not defined in the "' + lib + '" module');
                }
              }
            }

            return result;
          };
          $[lib].struct = props;
        }
      }, {
        key: "extendProps",
        value: function extendProps() {
          if (props.extends && props.extends.length > 0) {
            Tools.parents = {};
            Tools.parent = {};
            var parentsProps = props.extends.map(function (parentName) {
              parentName = Tools.getLibName(parentName);
              var parentStruct = $[parentName].struct;
              Tools.parents[parentName] = parentStruct.privateMethods;
              return parentStruct;
            });
            Tools.parentMethods = Tools.extend.apply(Tools, [{}].concat(_toConsumableArray(parentsProps))).privateMethods;
            props.parents = Tools.parents;
            props = Tools.extend.apply(Tools, [{}].concat(_toConsumableArray(parentsProps), [props]));
          }
        }
      }, {
        key: "extend",
        value: function extend() {
          var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          for (var _len = arguments.length, objects = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            objects[_key - 1] = arguments[_key];
          }

          objects.map(function (obj) {
            for (var key in obj) {
              var current = obj[key];

              if (typeof current === 'function') {
                target[key] = current;
              } else if (Array.isArray(current)) {
                target[key] = Tools.deepCopy(current);
              } else if (_typeof(current) === 'object') {
                var clonedObject = void 0;

                if (Array.isArray(target[key])) {
                  clonedObject = Tools.extend({}, current);
                } else if (_typeof(target[key]) === 'object') {
                  clonedObject = Tools.extend(target[key], current);
                } else {
                  clonedObject = Tools.extend({}, current);
                }

                target[key] = clonedObject;
              } else {
                target[key] = current;
              }
            }
          });
          return target;
        }
      }, {
        key: "deepCopy",
        value: function deepCopy(target) {
          if (typeof target === 'function') {
            return target;
          } else if (Array.isArray(target)) {
            return target.map(function (item) {
              return Tools.deepCopy(item);
            });
          } else if (_typeof(target) === 'object') {
            var clonedObject = Tools.extend({}, target);

            for (var key in clonedObject) {
              clonedObject[key] = Tools.deepCopy(clonedObject[key]);
            }

            return clonedObject;
          } else {
            return target;
          }
        }
      }, {
        key: "haveFunctions",
        value: function haveFunctions(object) {
          for (var key in object) {
            if (typeof object[key] !== 'function') {
              throw new Error('The "' + key + '" element must be a function');
            }
          }
        }
      }]);

      return Tools;
    }();

    var WatchingData =
    /*#__PURE__*/
    function () {
      function WatchingData(inst, data, watch) {
        _classCallCheck(this, WatchingData);

        this.inst = inst;
        this.watch = watch;
        this.data = {};
        this.instData = data;
        this.setData(data);
      }

      _createClass(WatchingData, [{
        key: "setData",
        value: function setData() {
          var _this = this;

          var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var inst = this;

          for (var _name in data) {
            this.set(_name, data[_name], inst.watch[_name]);
          }

          Object.defineProperty(this.inst, 'data', {
            get: function get() {
              return _this.instData;
            }
          });
        }
      }, {
        key: "set",
        value: function set(name, value) {
          var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
          var inst = this;
          var data = inst.inst.data;
          Object.defineProperty(this.instData, name, {
            get: function get() {
              return inst.data[name];
            },
            set: function set(newValue) {
              if (callback && typeof callback === 'function') {
                callback(inst.data[name], newValue);
              }

              inst.data[name] = newValue;
            }
          });
          inst.data[name] = value;
        }
      }]);

      return WatchingData;
    }();

    var Factory =
    /*#__PURE__*/
    function () {
      function Factory(inst, options) {
        _classCallCheck(this, Factory);

        this.privateMethods = {};
        this.options = options;
        this.globalReg(inst);
        this.setData(inst);
        this.setOptions(inst);
        this.addHooks(inst);
        this.addSuperMethods(inst);
        this.addPrivateMethods(inst);
        this.addPublicMethods(inst);
      }

      _createClass(Factory, [{
        key: "globalReg",
        value: function globalReg(inst) {
          var storages = {
            storage: storage,
            list: list
          };

          var _loop = function _loop(key) {
            Object.defineProperty(inst, key, {
              get: function get() {
                return storages[key];
              },
              set: function set(val) {
                throw new Error('Setting the value to "' + val + '" failed. Object "' + key + '" is not editable');
              }
            });
          };

          for (var key in storages) {
            _loop(key);
          }
        }
      }, {
        key: "setData",
        value: function setData(inst) {
          var instData = Tools.extend({}, props.data || {}, this.options.data || {});
          var watch = Tools.extend({}, props.watch || {}, this.options.watch || {});
          Tools.haveFunctions(watch);
          watchingData = new WatchingData(inst, instData, watch);
        }
      }, {
        key: "setOptions",
        value: function setOptions(inst) {
          var hash = Math.round(new Date() * Math.random());
          var dataSet = inst.el.dataset[lib];
          var optionsFromData;

          try {
            optionsFromData = dataSet ? JSON.parse(dataSet) : {};
          } catch (error) {
            throw new Error('Check the data attributes in the element. ' + dataSet + ' is not valid JSON format.');
          }

          inst.hash = inst.el.hash = hash;
          var instOptions = Tools.extend({}, props.options || {}, this.options.options || {}, optionsFromData, {
            hash: hash
          });
          Object.defineProperty(inst, 'options', {
            get: function get() {
              return instOptions;
            }
          });
        }
      }, {
        key: "addHooks",
        value: function addHooks(inst) {
          var hooks = Tools.extend({
            beforeCreate: function beforeCreate() {},
            bindEvent: function bindEvent() {},
            afterCreate: function afterCreate() {}
          }, props.hooks || {}, this.options.hooks || {});
          Tools.haveFunctions(hooks);
          Object.defineProperty(inst, 'hook', {
            get: function get() {
              return function (name) {
                if (!hooks[name]) {
                  throw new Error('Hook "' + name + '" is not defined in the module');
                }

                for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  args[_key2 - 1] = arguments[_key2];
                }

                return hooks[name].apply(inst, args);
              };
            }
          });
        }
      }, {
        key: "addPrivateMethods",
        value: function addPrivateMethods(inst) {
          if (props.privateMethods) {
            Tools.haveFunctions(props.privateMethods);

            for (var key in props.privateMethods) {
              if (key[0] !== '_') {
                throw new Error('The name of the private method must begin with "_". Rename the method ' + key);
              }

              inst[key] = this.privateMethods[key] = props.privateMethods[key].bind(inst);
            }
          }
        }
      }, {
        key: "addPublicMethods",
        value: function addPublicMethods(inst) {
          var _this2 = this;

          inst.el[lib] = {
            data: inst.data,
            getStruct: function getStruct() {
              return inst._getStruct();
            },
            destroy: function destroy() {
              return inst._destroy();
            }
          };

          if (props.publicMethods) {
            Tools.haveFunctions(props.publicMethods);

            for (var key in props.publicMethods) {
              var publicContext = {};
              Object.defineProperty(publicContext, 'inst', {
                get: function get() {
                  return inst.el[lib];
                }
              });
              Object.defineProperty(publicContext, 'private', {
                get: function get() {
                  return _this2.privateMethods;
                },
                set: function set(val) {
                  throw new Error('Setting the value to "' + val + '" failed. Object "private" is not editable');
                }
              });
              inst.el[lib][key] = props.publicMethods[key].bind(publicContext);

              if (inst[key]) {
                throw new Error('The ' + key + ' method is already defined in a private scope!');
              }

              if (key[0] === '_') {
                throw new Error('The public method should not start with "_". Rename the method ' + key);
              }
            }
          }
        }
      }, {
        key: "addSuperMethods",
        value: function addSuperMethods(inst, methods) {
          Tools.extend(inst.__proto__, Tools.parentMethods);
          Object.defineProperty(inst, 'super', {
            get: function get() {
              return function (name, argument) {
                try {
                  for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
                    args[_key3 - 2] = arguments[_key3];
                  }

                  if (props.parents && _typeof(props.parents[name]) === 'object' && props.parents[name][argument]) {
                    return props.parents[name][argument].apply(this, args);
                  }

                  return inst.__proto__[name].apply(this, [argument].concat(args));
                } catch (error) {
                  throw new Error('Method "' + name + '" is not defined in the parents modules');
                }
              };
            }
          });
        }
      }]);

      return Factory;
    }();

    var name = props.name;
    var lib = Tools.getLibName(name);
    var list = {};
    var storage = {};
    var watchingData;
    Tools.run();

    var Module =
    /*#__PURE__*/
    function () {
      function Module(el) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Module);

        var inst = this;
        inst.element = $(el);

        if (inst.element.length > 1) {
          inst.element.map(function (el) {
            return new $[name](el, options);
          });
          return;
        }

        inst.el = el;
        new Factory(inst, options);
        inst.hook('beforeCreate');
        inst.hook('create');
        inst.hook('bindEvent');
        inst.hook('afterCreate');
      }

      _createClass(Module, [{
        key: "_set",
        value: function _set(name, value, callback) {
          watchingData.set(name, value, callback);
        }
      }, {
        key: "_getEventList",
        value: function _getEventList() {
          return {
            'click': 'touchstart',
            'mouseenter': 'touchstart',
            'mousedown': 'touchstart',
            'mouseup': 'touchend',
            'mouseleave': 'touchend'
          };
        }
      }, {
        key: "_getEventName",
        value: function _getEventName(eventName, namespace) {
          namespace = (namespace ? '.' + namespace : '') + '.' + this.hash;

          if (this._isMobile()) {
            return (this._getEventList()[eventName] || eventName) + namespace;
          } else {
            return eventName + namespace;
          }
        }
      }, {
        key: "_isMobile",
        value: function _isMobile() {
          return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }
      }, {
        key: "_destroy",
        value: function _destroy() {
          delete this.list[this.hash];
          delete this.el.hash;
          delete this.el[lib];
        }
      }, {
        key: "_extend",
        value: function _extend() {
          var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          for (var _len4 = arguments.length, objects = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            objects[_key4 - 1] = arguments[_key4];
          }

          return Tools.extend.apply(Tools, [target].concat(objects));
        }
      }, {
        key: "_deepCopy",
        value: function _deepCopy(target) {
          return Tools.deepCopy(target);
        }
      }]);

      return Module;
    }();
  };
})(jQuery);