// Load app style
import '../src/assets/styles/_app.scss';
// js components
import '../node_modules/jquery.nice-number/dist/jquery.nice-number';
import '../src/assets/scripts/rsForm';
import imgToSvg from '../src/assets/scripts/imgToSvg';
import carouselBanner from './template/components/banner/banner';

const app = {
	load: () => {
		app.bindEvents();
	},
	bindEvents: () => {
		console.log('Re1ady!');
		$(document).ready(function() {
			$('input[type="number"]').niceNumber();
		});
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
	}
};
carouselBanner();
window.addEventListener('load', app.load);

function requireAll(r) {
	r.keys().forEach(r);
}
requireAll(require.context('./assets/images/svg/', true, /\.svg$/));