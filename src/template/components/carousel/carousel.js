export default function carousel() {
	let slidersCategories = [];

	$('.carousel .swiper-container').each(function() {
		let t = $(this);
		let params = t.parent().data('swiper');
	
		let dataParams = {
			effect: 'fade',
			speed: 800,
			slidesPerView: 1,
			slidesPerGroup: 1,
			loop: false,
			navigation: {
				nextEl: t.find('.swiper-button-next')[0],
				prevEl: t.find('.swiper-button-prev')[0]
			},
			autoHeight: true
		};
	
		if (params) {
			dataParams = Object.assign(dataParams, params);
		}
	
		let categoriesSwiper = new Swiper(t[0], dataParams);
	
		slidersCategories.push(categoriesSwiper);
	});

	setTimeout(() => {
		slidersCategories.forEach(item => {
			item.update();
		});
	}, 350);
}
