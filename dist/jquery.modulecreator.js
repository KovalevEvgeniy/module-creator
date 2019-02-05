/*
 * CreateModule (jquery.modulecreator.js) 1.2.0 | MIT & BSD
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
            throw 'Setting the value to "' + val + '" failed. Object "storage" is not editable';
          }
        });
        Object.defineProperty(inst, "list", {
          get: function get() {
            return list;
          },
          set: function set(val) {
            throw 'Setting the value to "' + val + '" failed. Object "list" is not editable';
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
        Object.defineProperty(inst, "data", {
          get: function get() {
            return Object.assign({}, props.data || {}, options.data || {});
          }
        });
        Object.defineProperty(inst, "options", {
          get: function get() {
            return Object.assign({}, props.options || {}, options.options || {}, {
              hash: inst.hash
            });
          }
        });
        var hooks = Object.assign({}, props.hooks, options.hooks);
        Object.defineProperty(inst, "hooks", {
          get: function get() {
            return function (name) {
              if (hooks[name]) {
                hooks[name].apply(inst, Array.prototype.slice.call(arguments, 1));
              }
            };
          }
        });
        Object.defineProperty(inst, "super", {
          get: function get() {
            return function (name) {
              if (this.__proto__[name]) {
                return this.__proto__[name].apply(this, Array.prototype.slice.call(arguments, 1));
              }
            };
          }
        });
        inst.hooks('beforeCreate');
        var privateMethods = {};

        if (props.privateMethods) {
          for (var key in props.privateMethods) {
            if (key[0] !== '_') {
              throw 'The name of the private method must begin with "_". Rename the method ' + key;
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
          for (var _key in props.publicMethods) {
            el[lib][_key] = props.publicMethods[_key].bind({
              inst: el[lib],
              private: privateMethods
            });

            if (inst[_key]) {
              throw 'The ' + _key + ' method is already defined in a private scope!';
            }

            if (_key[0] === '_') {
              throw 'The public method should not start with "_". Rename the method ' + _key;
            }
          }
        }

        inst.hooks('create');
        inst.hooks('bindEvent');
        inst.hooks('afterCreate');
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