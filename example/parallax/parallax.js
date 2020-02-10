/**
* @ModuleCreator version 1.4.1
* https://github.com/KovalevEvgeniy/module-creator
* @module ModuleName
* @example $.moduleName(object)
* or
* @example $(selector).parallax({
*   options: {
*       scrollParallax: true,
*       scrollCoefficient: .5,
*       cursorParallaxX: false,
*       cursorCoefficientX: .05,
*       cursorParallaxY: false,
*       cursorCoefficientY: .05,
*   }
* })
* @author Author name
**/

$.CreateModule({
    name: 'Parallax',
    options: {
        scrollParallax: true,
        scrollCoefficient: .5,

        cursorParallaxX: false,
        cursorCoefficientX: .05,
        cursorParallaxY: false,
        cursorCoefficientY: .05,
    },
    hooks: {
        beforeCreate: function () {},
        create: function () {
            this._init();
        },
        bindEvent: function () {
            if (this.options.scrollParallax) {
                $(document).on('scroll.' + this.hash, this._onScroll)
            }

            if (this.options.cursorParallaxX || this.options.cursorParallaxY) {
                $(document).on('mousemove.' + this.hash, this._onMousemove)
            }

            $(document).on('resize.' + this.hash, this._onResize)
        },
        afterCreate: function () {}
    },
    privateMethods: {
        _init: function () {
            this.element.addClass('is-parallax');
            this._setCursorPosition(($(window).width() / 2), ($(window).height() / 2));
            this.baseLine = Number(this.element.offset().top) - Number(this.element.position().top);

            this._updatePosition();
        },
        _onScroll: function (event) {
            this._updatePosition()
        },
        _onResize: function (event) {
            this._destroy()
        },
        _setCursorPosition: function (x, y) {
            this.cursorPosition = {
                x: x,
                y: y
            };
        },
        _onMousemove: function (event) {
            this._setCursorPosition(event.clientX, event.clientY);
            this._updatePosition();
        },
        _updatePosition: function () {
            var pos = {
                x: (this._getCursorDependencyX()),
                y: (this._getScrollDependency() + this._getCursorDependencyY())
            };

            this.element.css({
                transform: `translate(${pos.x}px, ${pos.y}px)`
            });
        },
        _getScrollDependency: function () {
            if (this.options.scrollParallax) {
                var currY = this.baseLine - $(document).scrollTop();
                var dy = currY * this.options.scrollCoefficient;

                return dy;
            }

            return 0;
        },
        _getCursorDependencyX: function () {
            if (this.options.cursorParallaxX) {
                var currX = this.cursorPosition.x - $(window).width() / 2;
                return currX * this.options.cursorCoefficientX;
            }

            return 0;
        },
        _getCursorDependencyY: function () {
            if (this.options.cursorParallaxY) {
                var currY = this.cursorPosition.y - $(window).height() / 2;
               return currY * this.options.cursorCoefficientY;
            }

            return 0;
        },
        _destroy: function () {
            $(document).off('scroll.' + this.hash +' mousemove.' + this.hash + ' resize.' + this.hash);

            this.element.removeClass('is-parallax');
            this.element.removeAttr('style');
            this.super('_destroy');
        }
    },
    publicMethods: {
        destroy: function () {
            this.private._destroy()
        }
    }
});