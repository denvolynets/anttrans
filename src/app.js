// Load app style
import '../src/assets/styles/_app.scss';
// js components
import '../node_modules/jquery.nice-number/dist/jquery.nice-number';
import '../node_modules/magnific-popup/dist/jquery.magnific-popup.min';
import '../node_modules/jquery-nice-select/js/jquery.nice-select.min';
import '../node_modules/jquery.mmenu/dist/jquery.mmenu.all';
import '../node_modules/overlayscrollbars/js/jquery.overlayScrollbars.min';
import '../node_modules/inputmask/dist/jquery.inputmask.bundle';

import '../src/assets/scripts/rsForm';
import imgToSvg from '../src/assets/scripts/imgToSvg';
import carousel from './template/components/carousel/carousel';
import TariffsTable from './template/components/tariffs/tariffs';
import Avtopark from './template/components/avtopark/avtopark';

import svg4everybody from 'svg4everybody';

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
			mfpOpt: {
				type: 'inline',
				fixedContentPos: false,
				fixedBgPos: true,
				overflowY: 'auto',
				closeBtnInside: true,
				preloader: false,
				midClick: true,
				removalDelay: 300,
				mainClass: 'my-mfp-slide-bottom'
			},
			isMobile: () => { return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); },
			isIE: () => {
				let ua = navigator.userAgent;
				let isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
				
				return isIE; 
			},
			mobileMenu: () => {
				if (readyFUNC.isMobile()) {
					$('html').addClass('ismobile');
				}

				// let menu = $('.header-top__nav > ul').clone();
				// menu.children('li.dropdown').each(function() {
				// 	$(this).children('a').first().replaceWith('<span>' + $(this).children('a').first().html() + '</span>');
				// });
				// menu.find('*').removeAttr('class');
				// menu.removeAttr('class');
				// menu.appendTo('#menu');
				
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
						'title': '<a class="title_link" href="./"><img class="svg" src="./assets/images/svg/logo.svg"></a>'
					},
					'navbars': [{
						'position': 'bottom',
						'content': [
							$('.header-top__phone').clone().removeClass('g-hide_lg').get(0).outerHTML,
							$('.header-top .btn').clone().removeClass('g-hide_lg').get(0).outerHTML
						]
					}]
				});

				$('ul.mm-listview li a, .mm-panel_has-navbar .mm-navbar').each(function() {
					$(this).append("<div class='border'/>");
				});
			}
		};

		readyFUNC.mobileMenu();

		$('input[type="number"]').niceNumber();

		$('form').rsForm();

		$('select').niceSelect();

		$('input[type="tel"]').inputmask('+7 (999) 999-99-99'); 

		$('.js-popup').magnificPopup(readyFUNC.mfpOpt);

		imgToSvg();

		carousel();

		svg4everybody();

		// eslint-disable-next-line no-unused-vars
		let tariffsTable = new TariffsTable();
		// eslint-disable-next-line no-unused-vars
		let avtopark = new Avtopark();

		$('.scrollbar-outer').overlayScrollbars({});

		if (readyFUNC.isIE()) $('body').addClass('ie');

		setTimeout(() => {
			$('body').addClass('show-body');
		}, 150);
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

if (module.hot) {
	module.hot.accept();
}