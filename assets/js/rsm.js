jQuery(document).ready(function() {
	if ( jQuery('#vpc-ajax-container').length ) {
		// create a header section and move h1 to header, add logo
		jQuery('#vpc-ajax-container').before('<div id="vpc-header"></div>');
		jQuery('.page .entry-header').appendTo('#vpc-header');
		jQuery('#vpc-header').append('<img src="https://siteview.app/projects/wight/wp-content/themes/wight-child/logo.png" alt="logo" class="vpc-logo">');

		// create a temp div and move unused tags to temp
		// jQuery('#vpc-container').append('<div id="vpc-temp"></div>');
		// jQuery('#vpc-price-container').appendTo('#vpc-temp');

		jQuery(document).on('click', 'label.custom', function(){
			rsmUpdateProductInfo();
		});
	}
});

function rsmUpdateProductInfo() {
	var chked_option = '.vpc-options input:checked + label.custom';
	var base = jQuery('.BaseTab').find(chked_option).data('o-title');
	var color = jQuery('.Color').find(chked_option).data('o-title');
	var pattern = jQuery('.Pattern').find(chked_option).data('o-title');
	var shade = jQuery('.Shade').find(chked_option).data('o-title');

	var html = '<div class="vpc-info-block">' + 
			'<div class="info-row"><div class="info-label">BASE</div><div class="info-data">' + base + '</div></div>' +
			'<div class="info-row"><div class="info-label">COLOR</div><div class="info-data">' + color + '</div></div>' +
			'<div class="info-row"><div class="info-label">PATTERN</div><div class="info-data">' + pattern + '</div></div>' +
			'<div class="info-row"><div class="info-label">SHADE</div><div class="info-data">' + shade + '</div></div>' +
		'</div>';

	jQuery('.vpc-info-block').remove();
	jQuery('#vpc-price-container').prepend(html);
}

function rsmInitCongurator() {
	var oldHtml = jQuery('#vpc-price-container').html();
	jQuery('#vpc-price-container').html('');
	jQuery('#vpc-price-container').append('<div class="vpc-action-block"><div class="vpc-price-row">' + oldHtml + '</div><div class="vpc-action-row"></div></div>');
	jQuery('#vpc-save-btn').text('SAVE').appendTo('.vpc-action-row');
	jQuery('#vpc-add-to-cart').text('BUY').appendTo('.vpc-action-row');
	rsmUpdateProductInfo();
}
