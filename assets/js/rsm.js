jQuery(document).ready(function() {
	if ( jQuery('#vpc-ajax-container').length ) {
		// create a header section and move h1 to header, add logo
		jQuery('#vpc-ajax-container').before('<div id="vpc-header"><style>.entry-content{padding:50px;margin-left:-50px;margin-right:-50px;border: solid 1px #666;}</style></div>');
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
	var base = removeParenthesis(jQuery('.BaseTab').find(chked_option).data('o-title'));
	var color = removeParenthesis(jQuery('.Color').find(chked_option).data('o-title'));
	var pattern = removeParenthesis(jQuery('.Pattern').find(chked_option).data('o-title'));
	var shade = removeParenthesis(jQuery('.Shade').find(chked_option).data('o-title'));
	var spec = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

	var html = '<div class="vpc-info-block">' + 
			'<div class="info-row"><div class="info-label">BASE</div><div class="info-data">' + base + '</div></div>' +
			'<div class="info-row"><div class="info-label">COVER</div><div class="info-data">' + color + ' ' + pattern + '</div></div>' +
			'<div class="info-row"><div class="info-label">SHADE</div><div class="info-data">' + shade + '</div></div>' +
			'<div class="info-row"><div class="info-label">SPECS</div><div class="info-data">' + spec + '</div></div>' +
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

function removeParenthesis(str) {
	str = str.trim();
	if (str.charAt(0) == '(') str = str.substr(1);
	if (str.substr(-1) == ')') str = str.substr(0, str.length - 1);
	return str;
}
