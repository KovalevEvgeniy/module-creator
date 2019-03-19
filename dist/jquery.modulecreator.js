/*
 * CreateModule (jquery.modulecreator.js) 1.2.1 | MIT & BSD
 */
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($) {
  $.CreateModule = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var name = props.name;
    var lib = name.substr(0, 1).toLowerCase() + name.substr(1);
    var list = {};
    var storage = {};

    var Module =
    /*#__PURE__*/
    function () {
      function Module(el) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Module);

        var inst = this;
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
        var privateData = $.extend({}, props.data || {}, options.data || {});
        Object.defineProperty(inst, "data", {
          get: function get() {
            return privateData;
          }
        });
        var privateOptions = $.extend({}, props.options || {}, options.options || {}, {
          hash: inst.hash
        });
        Object.defineProperty(inst, "options", {
          get: function get() {
            return privateOptions;
          }
        });
        var hooks = $.extend({}, props.hooks, options.hooks);
        Object.defineProperty(inst, "hook", {
          get: function get() {
            return function (name) {
              if (hooks[name]) {
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  args[_key - 1] = arguments[_key];
                }

                hooks[name].apply(inst, args);
              }
            };
          }
        });
        Object.defineProperty(inst, "super", {
          get: function get() {
            return function (name) {
              if (this.__proto__[name]) {
                for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                  args[_key2 - 1] = arguments[_key2];
                }

                return this.__proto__[name].apply(this, args);
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
      }]);

      return Module;
    }();

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
  };
})(jQuery);