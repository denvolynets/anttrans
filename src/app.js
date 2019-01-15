// Load app style
import '../src/assets/styles/_app.scss';
// js components
import '../node_modules/jquery.nice-number/dist/jquery.nice-number';
import '../node_modules/jquery.scrollbar/jquery.scrollbar.min';
import '../node_modules/jquery-mousewheel/jquery.mousewheel';
import '../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js';
import '../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';

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
				if (st >= sSVG.offset().top - 300) {
					sSVG.addClass('animate');
				}

				$('.swiper-slide').css({
					backgroundSize: (100 + st / 15) + '%'
				});
			}
		};

		scrFUNC.showingSVG();
	},
	bindEvents: () => {
		$('input[type="number"]').niceNumber();

		$('form').rsForm();

		$('select').each(function() {
			let defText = $(this).data('default-text').length > 0 ? $(this).data('default-text') : '';
			$(this).selectBoxIt({
				defaultText: defText,
				showEffect: 'fadeIn',
				showEffectSpeed: 150,
				hideEffect: 'fadeOut',
				hideEffectSpeed: 150
			});
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