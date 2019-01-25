// Load app style
import '../src/assets/styles/_app.scss';
// js components
import '../node_modules/jquery.nice-number/dist/jquery.nice-number';
import '../node_modules/jquery-mousewheel/jquery.mousewheel';

import '../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js';
import '../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';

import '../node_modules/magnific-popup/dist/jquery.magnific-popup.min.js';
import '../node_modules/magnific-popup/dist/magnific-popup.css';

import '../node_modules/jquery-nice-select/js/jquery.nice-select.min.js';
import '../node_modules/jquery-nice-select/scss/nice-select.scss';

import '../node_modules/jquery.mmenu/dist/jquery.mmenu.all.js';
import '../node_modules/jquery.mmenu/dist/jquery.mmenu.all.css';

import '../node_modules/overlayscrollbars/js/jquery.overlayScrollbars.min.js';
import '../node_modules/overlayscrollbars/css/OverlayScrollbars.min.css';

import '../src/assets/scripts/rsForm';
import imgToSvg from '../src/assets/scripts/imgToSvg';
import carousel from './template/components/carousel/carousel';
import TariffsTable from './template/components/tariffs/tariffs';
import Avtopark from './template/components/avtopark/avtopark';

const app = {
	load: () => {
		app.bindEvents();
	},
	scroll: () => {
		let st = $(window).scrollTop();

		const scrFUNC = {
			'showingSVG': () => {
				let sSVG = $('.showing-svg');

				if (sSVG.length) {
					if (st >= sSVG.offset().top - 300) {
						sSVG.addClass('animate');
					}
				}
			},
			'scrollBgZoom': () => {
				$('.js-scroll-zoom').css({
					backgroundSize: (100 + st / 15) + '%'
				});
			}
		};
		scrFUNC.scrollBgZoom();
		scrFUNC.showingSVG();
	},
	bindEvents: () => {
		let readyFUNC = {
			mobileMenu: () => {
				// $('.header-top__nav > ul').clone().appendTo('#menu');
				let menu = $('.header-top__nav > ul').clone();
				menu.children('li.dropdown').each(function() {
					$(this).children('a').first().replaceWith('<span>' + $(this).children('a').first().html() + '</span>');
				});
				menu.find('*').removeAttr('class');
				menu.removeAttr('class');
				menu.appendTo('#menu');
				$('#menu').mmenu({
					'extensions': [
						'theme-dark',
						'position-front',
						'position-right',
						'listview-50',
						'fx-panels-slide-up',
						'fx-listitems-drop',
						'border-offset',
						'pagedim-black',
						'border-none',
						'multiline',
						'shadow-panels'
					],
					'iconPanels': true,
					'navbar': {
						'title': '<a class="title_link" href="/"><img src="./assets/images/svg/logo.svg"></a>'
					},
					'navbars': [{
						'position': 'bottom',
						'content': [
							$('.header-top__phone').get(0).outerHTML,
							$('.header-top .btn.js-popup').get(0).outerHTML
						]
					}]
				});

				$('ul.mm-listview li a, .mm-panel_has-navbar .mm-navbar').each(function() {
					$(this).append("<div class='border'/>");
				});
			}
		};

		$('input[type="number"]').niceNumber();

		$('form').rsForm();

		$('select').niceSelect();

		$('.js-popup').magnificPopup({
			type: 'inline',
			fixedContentPos: false,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-slide-bottom',
			callbacks: {
				open: function() {

				},
				close: function() {

				}
			}
		});

		imgToSvg();

		carousel();

		readyFUNC.mobileMenu();

		// eslint-disable-next-line no-unused-vars
		let tariffsTable = new TariffsTable();
		// eslint-disable-next-line no-unused-vars
		let avtopark = new Avtopark();

		// $('.scrollbar-outer').mCustomScrollbar({
		// 	documentTouchScroll: false,
		// 	contentTouchScroll: true
		// });

		$('.scrollbar-outer').overlayScrollbars({ /* your options */ }); 
	}
};

$(document).ready(app.load);
$(window).scroll(app.scroll);

function requireAll(r) {
	r.keys().forEach(r);
}
requireAll(require.context('./assets/images/svg/', true, /\.svg$/));

function requireAllPug(r) { r.keys().forEach(r); }
requireAllPug(require.context('./template/pages/', true, /\.pug$/));