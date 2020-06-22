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

        translate: true,
        scale: false,
    },
    hooks: {
        beforeCreate() {},
        create() {
            this._init();
        },
        bindEvent() {
            if (this.options.scrollParallax) {
                $(document).on('scroll.' + this.hash, this._onScroll)
            }

            if (this.options.cursorParallaxX || this.options.cursorParallaxY) {
                $(document).on('mousemove.' + this.hash, this._onMousemove)
            }

            $(document).on('resize.' + this.hash, this._onResize)
        },
        afterCreate() {}
    },
    privateMethods: {
        _init() {
            this.element.addClass('is-parallax');
            this._setCursorPosition(($(window).width() / 2), ($(window).height() / 2));
            this.baseLine = Number(this.element.offset().top) - Number(this.element.position().top);

            this._updatePosition();
        },
        _onScroll(event) {
            this._updatePosition()
        },
        _onResize(event) {
            this._destroy()
        },
        _setCursorPosition(x, y) {
            this.cursorPosition = {
                x: x,
                y: y
            };
        },
        _onMousemove(event) {
            this._setCursorPosition(event.clientX, event.clientY);
            this._updatePosition();
        },
        _updatePosition() {
            var pos = {
                x: (this._getCursorDependencyX()),
                y: (this._getScrollDependency() + this._getCursorDependencyY())
            };
            const translate = this.options.translate ? `translate(${pos.x}px, ${pos.y}px)` : '';
            const scale = this.options.scale ? `translate(${pos.x}px, ${pos.y}px)` : '';
            const transform = `${translate} ${scale}`;

            this.element.css({transform});
        },
        _getScrollDependency() {
            if (this.options.scrollParallax) {
                var currY = this.baseLine - $(document).scrollTop();
                var dy = currY * this.options.scrollCoefficient;

                return dy;
            }

            return 0;
        },
        _getCursorDependencyX() {
            if (this.options.cursorParallaxX) {
                var currX = this.cursorPosition.x - $(window).width() / 2;
                return currX * this.options.cursorCoefficientX;
            }

            return 0;
        },
        _getCursorDependencyY() {
            if (this.options.cursorParallaxY) {
                var currY = this.cursorPosition.y - $(window).height() / 2;
               return currY * this.options.cursorCoefficientY;
            }

            return 0;
        },
        _destroy() {
            $(document).off('scroll.' + this.hash +' mousemove.' + this.hash + ' resize.' + this.hash);

            this.element.removeClass('is-parallax');
            this.element.removeAttr('style');
            this.super('_destroy');
        }
    },
    publicMethods: {
        destroy() {
            this.private._destroy()
        }
    }
});
