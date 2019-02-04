export default class ScrollParallax {
	constructor() {
		this.szDiv = $('.js-scroll-zoom');
		this.szImg = new Image();
		this.szImg.src = this.szDiv.length ? this.szDiv.css('background-image').replace(/url\(|\)$/ig, '').replace(/"/g, '') : '';
		this.szBgSize = 100;
        
		if (this.szDiv.length == 0) return;
		this.imgLoad();
		this.onResize();
	}

	imgLoad() {
		this.szImg.onload = () => {
			this.onScroll();
		};
	}
    
	setImgSize() {
		let st = $(window).scrollTop();
		let h = this.szImg.height;
		let w = this.szImg.width;
		let koef = w / h;
		let headerH = this.szDiv.parents('header').height();
		let headerW = this.szDiv.parents('header').width();
        
		if ($(window).width() < 768) {
			this.szDiv.css('background-size', `cover`);
		} else {
			if (headerW / koef < headerH) {
				this.szBgSize = 100;
				do {
					this.szBgSize += 1;
				} while ((headerW * (this.szBgSize / 100)) / koef < headerH);
			} else {
				this.szBgSize = 100;
			}
                
			this.szDiv.css('background-size', `${this.szBgSize + st / 15}%`);
		}
	}
    
	onResize() {
		$(window).resize(() => {
			this.setImgSize();
		});
	}
    
	onScroll() {
		$(window).on('scroll', () => {
			this.setImgSize();
		}).trigger('scroll');
	}
}