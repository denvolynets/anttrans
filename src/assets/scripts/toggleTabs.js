export default function toggleTabs() {
	(function() {
		const tabs = '.js-tabs';

		$(tabs).each(function() {
			$(this).find('[data-choose]').each(function(index) {
				if (index !== 0) {
					$(this).hide();
				}
			});

			$(this).find('[data-target]').each(function(index) {
				if (index !== 0) {
					$(this).removeClass('active');
				} else {
					$(this).addClass('active');
				}
			});
		});

		$('[data-target]').click(function() {
			let dataTarget = $(this).data('target');

			$(this).parents(tabs).find('[data-target]').not(this).removeClass('active');
			$(this).addClass('active');

			$(this).parents(tabs).find('[data-choose]').each(function() {
				let dataChoose = $(this).data('choose');
				if (dataChoose === dataTarget) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});
		});
	})();
}
