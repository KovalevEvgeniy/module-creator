/*
 * CreateModule (jquery.modulecreator.js) 1.3.1 | MIT & BSD
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
          $[lib] = $[lib] || ($.fn[lib] = function () {
            var selector = this;

            if (typeof selector === 'function') {
              selector = $[lib].element || $('<div>');
              $[lib].element = selector;
            }

            var options = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            var result = selector;

            for (var i = 0; i < selector.length; i++) {
              if (_typeof(options) == 'object' || typeof options == 'undefined') {
                var inst = new Module(selector[i], options);
                inst.list[inst.hash] = inst;
              } else {
                result = selector[i][lib][options].apply(selector[i][lib], args) || selector;
              }
            }

            return result;
          });

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

          for (var i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i++) {
            var obj = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];

            for (var key in obj) {
              var current = obj[key];

              if (typeof current === 'function') {
                target[key] = current;
              } else if (Array.isArray(current)) {
                var tmpArr = current.slice();
                target[key] = tmpArr;
              } else if (_typeof(current) === 'object') {
                var tmpObj = {};

                if (Array.isArray(target[key])) {
                  tmpObj = Tools.extend({}, current);
                } else if (_typeof(target[key]) === 'object') {
                  tmpObj = Tools.extend(target[key], current);
                } else {
                  tmpObj = Tools.extend({}, current);
                }

                target[key] = tmpObj;
              } else {
                target[key] = current;
              }
            }
          }

          return target;
        }
      }, {
        key: "deepCopy",
        value: function deepCopy(target) {
          if (typeof target === 'function') {
            return target;
          } else if (Array.isArray(target)) {
            var tmpArr = target.slice();

            for (var i = 0; i < tmpArr.length; i++) {
              tmpArr[i] = Tools.deepCopy(tmpArr[i]);
            }

            return tmpArr;
          } else if (_typeof(target) === 'object') {
            var tmpObj = Tools.extend({}, target);

            for (var key in tmpObj) {
              tmpObj[key] = Tools.deepCopy(tmpObj[key]);
            }

            return tmpObj;
          } else {
            return target;
          }
        }
      }]);

      return Tools;
    }();

    var name = props.name;
    var lib = Tools.getLibName(name);
    var list = {};
    var storage = {};
    Tools.run();

    var Module =
    /*#__PURE__*/
    function () {
      function Module(el) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Module);

        var inst = this;
        var inheritOptipns = {};
        Object.defineProperty(inst, "storage", {
          get: function get() {
            return storage;
          },
          set: function set(val) {
            throw new Error('Setting the value to "' + val + '" failed. Object "storage" is not editable');
          }
        });
        Object.defineProperty(inst, "list", {
          get: function get() {
            return list;
          },
          set: function set(val) {
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

        var privateData = inst._extend({}, props.data || {}, options.data || {});

        Object.defineProperty(inst, "data", {
          get: function get() {
            return privateData;
          }
        });

        var privateOptions = inst._extend({}, props.options || {}, options.options || {}, {
          hash: inst.hash
        });

        Object.defineProperty(inst, "options", {
          get: function get() {
            return privateOptions;
          }
        });

        var hooks = inst._extend({}, props.hooks, options.hooks);

        Object.defineProperty(inst, "hook", {
          get: function get() {
            return function (name) {
              if (hooks[name]) {
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  args[_key - 1] = arguments[_key];
                }

                return hooks[name].apply(inst, args);
              }
            };
          }
        }); // console.log(props.parents);

        Tools.extend(inst.__proto__, Tools.parentMethods);
        Object.defineProperty(inst, "super", {
          get: function get() {
            return function (name, argument) {
              for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                args[_key2 - 2] = arguments[_key2];
              }

              if (props.parents[name] !== undefined) {
                if (props.parents[name][argument]) {
                  return props.parents[name][argument].apply(this, args);
                }
              } else if (this.__proto__[name]) {
                return inst.__proto__[name].apply(this, [argument].concat(args));
              }
            };
          }
        });
        inst.hook('beforeCreate');
        var privateMethods = {};

        if (props.privateMethods) {
          for (var key in props.privateMethods) {
            if (key[0] !== '_') {
              throw new Error('The name of the private method must begin with "_". Rename the method ' + key);
            }

            inst[key] = privateMethods[key] = props.privateMethods[key].bind(inst);
          }
        }

        el[lib] = {
          data: inst.data,
          getStruct: function getStruct() {
            return inst._getStruct();
          },
          destroy: function destroy() {
            inst._destroy();
          }
        };

        if (props.publicMethods) {
          for (var _key3 in props.publicMethods) {
            var publicContext = {};
            Object.defineProperty(publicContext, "inst", {
              get: function get() {
                return el[lib];
              }
            });
            Object.defineProperty(publicContext, "private", {
              get: function get() {
                return privateMethods;
              },
              set: function set(val) {
                throw new Error('Setting the value to "' + val + '" failed. Object "private" is not editable');
              }
            });
            el[lib][_key3] = props.publicMethods[_key3].bind(publicContext);

            if (inst[_key3]) {
              throw new Error('The ' + _key3 + ' method is already defined in a private scope!');
            }

            if (_key3[0] === '_') {
              throw new Error('The public method should not start with "_". Rename the method ' + _key3);
            }
          }
        }

        inst.hook('create');
        inst.hook('bindEvent');
        inst.hook('afterCreate');
      }

      _createClass(Module, [{
        key: "_getEventList",
        value: function _getEventList() {
          return {
            'click': 'touchstart',
            'mousedown': 'touchstart',
            'mouseup': 'touchend'
          };
        }
      }, {
        key: "_getEventName",
        value: function _getEventName(eventName, namespace) {
          namespace = (namespace ? '.' + namespace : '') + '.' + this.hash;
          return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (this._getEventList()[eventName] || eventName) + namespace : eventName + namespace;
        }
      }, {
        key: "_destroy",
        value: function _destroy() {
          var el = this.element.get(0);
          delete this.list[this.hash];
          delete el.hash;
          delete el[lib];
        }
      }, {
        key: "_extend",
        value: function _extend() {
          var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          for (var _len3 = arguments.length, objects = new Array(_len3 > 1 ? _len3 - 1 : 0), _key4 = 1; _key4 < _len3; _key4++) {
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