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

		// eslint-disable-next-line no-unused-vars
		let tariffsTable = new TariffsTable();
		// eslint-disable-next-line no-unused-vars
		let avtopark = new Avtopark();

		$('.scrollbar-outer').mCustomScrollbar({
			scrollInertia: 640,
			snapAmount: 220.5
		});
	}
};

$(document).ready(app.load);
$(window).scroll(app.scroll);

function requireAll(r) {
	r.keys().forEach(r);
}
requireAll(require.context('./assets/images/svg/', true, /\.svg$/));