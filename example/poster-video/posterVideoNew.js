/**
* @ModuleCreator version 1.2.0
* @module PosterVideo
* @author Max Makarov
*
* @example
*
*	<div class="js__video"
*		data-poster-video-preview="./f/i/video-block__preview.jpg"
*		data-poster-video-src="https://www.youtube.com/embed/0XsE6m-gP78"
*	></div>
*
*	<script src="./f/js/jquery.min.js"></script>
*	<script src="./f/js/jquery.modulecreator.min.js"></script>
*	$('.js__video').posterVideo({
*		options: {}
*	})
*
**/

$.CreateModule({
	name: 'PosterVideo',
	options: {
		videoType: 'youtube', // 'youtube'
		needBtnPtay: true, // if false, then the entire block clickable
		relation: (16 / 9), // width to height ratio (width / height)
		src: '', // you can set default props
		preview: '', // you can set default props
	},
	hooks: {
		beforeCreate () {},
		create () {
			this._init();
		},
		bindEvent () {
			this.element.off('click')
			this.elements.btnPlay.off(this._getEventName('click'))
			this.elements.btnPlay.on(this._getEventName('click'), this._onPlay);
			$(window).off(this._getEventName('resize'))
			$(window).on(this._getEventName('resize'), this._onResize);
		},
		afterCreate () {}
	},
	privateMethods: {
		_init () {
			this._setOptions();
			this._createElements();
			this._updateElementsSize();

			this.element.addClass('poster-video');
		},
		_setOptions () {
			let inlineData = this.element.data();

			this.options.src = inlineData.posterVideoSrc || this.options.src;
			this.options.preview = inlineData.posterVideoPreview || this.options.preview;
		},
		_createElements () {
			this.element.empty()
			this.elements = {
				preview: this._createPreview(),
				btnPlay: this._createBtnPlay(),
				video: this._createVideo()
			};
		},
		_createPreview () {
			let preview = $('<img>');

			preview
				.addClass('poster-video__preview')
				.attr('src', this.options.preview)
				.css({
					width: '100%',
					position: 'absolute'
				})
				.appendTo(this.element);

			return preview;
		},
		_createBtnPlay () {
			if (this.options.needBtnPtay) {
				let btnPlay = $('<div>');

				btnPlay
					.addClass('poster-video__btn-play')
					.appendTo(this.element);

				return btnPlay;
			} else {
				return this.element;
			}
		},
		_createVideo () {
			return {
				'youtube': this._createVideoYoutube,
				'html5': this._createVideoHtml5
			}[this.options.videoType]();
		},
		_createVideoYoutube () {
			let video = $(
			`<iframe
				width="100%" height="100%"
				src="${this.options.src}?rel=0&autoplay=1&amp;showinfo=0"
				frameborder="0" allow="autoplay; encrypted-media"
				allowfullscreen>
			</iframe>')`);

			video.addClass('poster-video-video');

			return video;
		},
		_createVideoHtml5: function _createVideoHtml5() {
			let video = $('<video autoplay loop muted controls><source src="' + this.options.src + '" type="video/mp4" /></video>');

			video.addClass('poster-video-video');

			return video;
		},
		_onPlay (e) {
			if (this.options.needBtnPtay) {
				this.elements.btnPlay.remove();
			}
			this.elements.preview.fadeOut(300);
			this.element.append(this.elements.video);
		},
		_updateElementsSize () {
			let width = this.element.width();

			this.options.height = width / this.options.relation;

			this.elements.preview.width(width);
			this.elements.preview.height(this.options.height);
			this.element.height(this.options.height);
		},
		_onResize (e) {
			this._updateElementsSize();
		},
		_destroy () {
			this.element.empty()
			this.element.removeClass('poster-video');
		}
	},
	publicMethods: {
		destroy () {
			this.private._destroy()
		}
	}
});
