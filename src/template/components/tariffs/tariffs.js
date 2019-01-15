import tableData from './tariffsDataArr';
export default class TariffsTable {
	constructor() {
		this.app = $('#tarrifs');
		this.appData = tableData;
		this.currCity = 'Москва';
		this.currRegion = 'russia';
		this.currRegData = [];

		this.tabs();
		this.dropdownCities();
		this.tableRows();
		this.cityChange();
		this.regionChange();
	}

	tabs() {
		this.appData.forEach((item) => {
			this.app.find('.tariffs-tabs').append(`<div class="tariffs-tab ${this.currRegion === item.region ? 'tariffs-tab-active' : ''}" data-region="${item.region}">${item.regionTitle}</div>`);
		});
	}

	dropdownCities() {
		this.curRegDataUpdate();

		this.app.find('.tariffs-city').prepend(`<a data-city="${this.currCity}">${this.currCity}</a>`);
		this.currRegData[0].cities[0].prices.forEach(item => {
			this.app.find('.tariffs-city > ul').append(`<li><a data-city="${item.from}">${item.from}</a></li>`);
		});
	}

	tableRows() {
		this.curRegDataUpdate();
		let curRegionDataArr = [];
		let firstLetterOld = '';
		let firstLetter = '';

		this.currRegData[0].cities.map(item => {
			item.prices.filter(st => {
				if (st.from === this.currCity) curRegionDataArr.push({ name: item.name, prices: st });
			});
		});

		curRegionDataArr.sort((a, b) => {
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		});
	
		curRegionDataArr.forEach((item, index) => {
			firstLetter = item.name.split('')[0].toUpperCase() === firstLetterOld.toUpperCase() ? '' : item.name.split('')[0].toUpperCase();
			
			this.app.find('.tariffs-table tbody').append(`
			<tr class="tariffs-tr">
				<td><mark class="${firstLetter ? '' : 'g-op_0'}">${item.name.split('')[0].toUpperCase()}</mark><a href='#'>${item.name}</a></td>
				<td>${this.currencyFormat(item.prices.cars.t1)} &#8381;</td>
				<td>${this.currencyFormat(item.prices.cars.t15)} &#8381;</td>
				<td>${this.currencyFormat(item.prices.cars.t3)} &#8381;</td>
				<td>${this.currencyFormat(item.prices.cars.t5)} &#8381;</td>
				<td>${this.currencyFormat(item.prices.cars.t10)} &#8381;</td>
				<td>${this.currencyFormat(item.prices.cars.t20)} &#8381;</td>
			</tr>
			`);
			firstLetterOld = item.name.split('')[0].toLowerCase();
		});
	}

	cityChange() {
		let THIS = this;
		this.app.find('.tariffs-city a').click(function(e) {
			e.preventDefault();
			THIS.currCity = $(this).text();
			THIS.app.find('.tariffs-city > a').text(THIS.currCity);
			THIS.app.find('.tariffs-table tbody').html('');
			THIS.tableRows();
		});
	}

	regionChange() {
		let THIS = this;
		this.app.find('.tariffs-tabs .tariffs-tab').click(function(e) {
			e.preventDefault();

			$(this).addClass('tariffs-tab-active');
			THIS.app.find('.tariffs-tabs .tariffs-tab').not(this).removeClass('tariffs-tab-active');
			THIS.currRegion = $(this).data('region');
			THIS.app.find('.tariffs-table tbody').html('');
			THIS.tableRows();
			$('.scrollbar-outer').mCustomScrollbar('scrollTo', 'top');
		});
	}

	curRegDataUpdate() {
		this.currRegData = this.appData.filter(item => item.region === this.currRegion);
	}

	currencyFormat(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}
}