export default class Avtopark {
	constructor() {
		this.app = $('#avtopark');
		this.carChange();
		this.setActive();
	}

	setActive() {
		this.app.find('li.avtopark-list__item').first().click();
	}

	carChange() {
		this.app.find('li.avtopark-list__item').click((e) => {
			let $t = $(e.currentTarget);
			let car = $t.data('car');

			$('li.avtopark-list__item').removeClass('active');
			$t.addClass('active');

			this.app.find('.avtopark-preview__img').css('background-image', `url(./assets/images/temp/${car.img})`);
			this.app.find('.a-length').text(car.length);
			this.app.find('.a-width').text(car.width);
			this.app.find('.a-height').text(car.height);
			this.app.find('.a-volume').text(car.volume);
			this.app.find('.a-capacity').text(car.capacity);
			this.app.find('.a-pallets').text(car.pallets);

			this.app.find('.avtopark-cartext .h3').text(`Область применения автомобиля ${car.name}`);
			this.app.find('.avtopark-cartext .p').text(car.info);
			this.app.find('.avtopark-cartext .btn').attr('href', car.link);
		});
	}
}