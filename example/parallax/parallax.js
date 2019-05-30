/**
* @ModuleCreator version 1.4.1
* https://github.com/KovalevEvgeniy/ModuleCreator
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
            this._create();
        },
        bindEvent: function () {
            $(document).on('scroll', this._onScroll)
            $(document).on('mousemove', this._onMousemove)
        },
        afterCreate: function () {}
    },
    privateMethods: {
        _create: function () {
            this._setCursorPosition(($(window).width() / 2), ($(window).height() / 2));
            this.baseY = Number(this.element.offset().top) - Number(this.element.position().top);

            this._updatePosition();
        },
        _onScroll: function (event) {
            this._updatePosition()
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
            var shift = {
                x: (this._getCursorDependencyX()),
                y: (this._getScrollDependency() + this._getCursorDependencyY())
            };

            this.element.css({
                transform: `translate(${shift.x}px, ${shift.y}px)`
            });
        },
        _getScrollDependency: function () {
            if (this.options.scrollParallax) {
                var currY = this.baseY - $(document).scrollTop();
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
    },
    publicMethods: {}
});