var MOUSE_OVER = false;
document.addEventListener("mousewheel", function(e){
	if (MOUSE_OVER) {
		e.preventDefault();
		return false;
	}
}, { passive: false });

jQuery(document).ready(function() {

	var state = 'no';
	var scroll_state = 'yes';

	// middle column
	jQuery('body').on('click', '.vpc-component.BaseType .vpc-options label', function(){
		jQuery('.vpc-component.Shade').hide();
		jQuery('.vpc-component.Pattern').hide();
		jQuery('.vpc-component.BaseTab').show();

		jQuery('.vpc-tab-header.ShadeType').removeClass('label-active');
		jQuery('.vpc-tab-header.Color').removeClass('label-active');
		jQuery('.vpc-tab-header.BaseType').addClass('label-active');
	});

	jQuery('body').on('click', '.vpc-component.Color .vpc-options label', function(){
		jQuery('.vpc-component.Shade').hide();
		jQuery('.vpc-component.BaseTab').hide();
		jQuery('.vpc-component.Pattern').show();

		jQuery('.vpc-tab-header.ShadeType').removeClass('label-active');
		jQuery('.vpc-tab-header.BaseType').removeClass('label-active');
		jQuery('.vpc-tab-header.Color').addClass('label-active');
	});

	jQuery('body').on('click', '.vpc-component.ShadeType .vpc-options label', function(){
		jQuery('.vpc-component.Shade').show();
		jQuery('.vpc-component.Pattern').hide();
		jQuery('.vpc-component.BaseTab').hide();

		jQuery('.vpc-tab-header.Color').removeClass('label-active');
		jQuery('.vpc-tab-header.BaseType').removeClass('label-active');
		jQuery('.vpc-tab-header.ShadeType').addClass('label-active');
	});

	// mouse wheel activity
	jQuery('body').on('mousemove','.Pattern .vpc-group', function(){
		if(state == 'no'){
			state = 'yes';

			jQuery('body .Pattern .vpc-group').mouseenter(function(){ MOUSE_OVER=true; });
			jQuery('body .Pattern .vpc-group').mouseleave(function(){ MOUSE_OVER=false; });

			jQuery('body .vpc-group').bind('mousewheel', function(e){
				var curr_scroll = jQuery(this).scrollTop();

				var delta = e.originalEvent.wheelDelta;
				if(scroll_state == 'yes'){
					if(delta > 0){
						//go up
						scroll_state = 'no';
						jQuery(this).animate({ scrollTop: curr_scroll - 300 }, 600, function(){
							scroll_state = 'yes';
						});
					}
					else{
						//go down
						scroll_state = 'no';
						jQuery(this).animate({ scrollTop: curr_scroll + 300 }, 600, function(){
							scroll_state = 'yes';
						});
					}
				}else {
				}
			});
		}
	});

	jQuery('body').on('mousemove', '#vpc-preview', function(e){
		var objLeft = jQuery(this).offset().left;
		var objTop = jQuery(this).offset().top;

		// var objCenterX = objLeft + jQuery(this).width() / 2;
		// var objCenterY = objTop + jQuery(this).height() / 2;
		var xPosSTR = (event.pageX - objLeft) + 'px';
		var yPosSTR = (event.pageY - objTop) + 'px';
		jQuery('#vpc-preview:hover img').css({
			'transform-origin': xPosSTR + ' ' + yPosSTR + ' 0px',
			'-webkit-transform-origin': xPosSTR + ' ' + yPosSTR + ' 0px'
		});
	});

	// scroll action to pattern
	jQuery( "body" ).on( "click", '.Pattern .vpc-group .vpc-single-option-wrap label', function(){
		//var curr_scroll = jQuery(this).parent().position().top;
		var el_index = jQuery(this).closest('.vpc-group').find('label').index(jQuery(this));
		if(el_index !== 1){
			// var el_height =  jQuery(this).parent().height();
			var el_height = 100;
			var curr_scroll = el_height * (el_index - 1);

			jQuery(this).parents('.vpc-group').animate({ scrollTop: curr_scroll }, 600 );
		}
	});

	if (jQuery('#vpc-ajax-container').length) {
		// create a header section and move h1 to header, add logo
		jQuery('#vpc-ajax-container').before('<div id="vpc-header"><style>.entry-content{padding:50px;margin-left:-50px;margin-right:-50px;border: solid 1px #666;}</style></div>');
		jQuery('.page .entry-header').appendTo('#vpc-header');
		jQuery('#vpc-header').append('<img src="https://siteview.app/projects/wight/wp-content/themes/wight-child/logo.png" alt="logo" class="vpc-logo">');

		// update product info
		jQuery(document).on('click', 'label.custom', function () {
			rsmUpdateProductInfo();
		});

		jQuery(document).on('click', '.info-row', function () {
			jQuery(this).toggleClass('active');
		});
	}
});

function rsmUpdateProductInfo() {
	var base = getOptionAttribute('.BaseTab');
	var color = getOptionAttribute('.Color');
	var pattern = getOptionAttribute('.Pattern');
	var shade = getOptionAttribute('.Shade');
	var spec = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

	var html = '<div class="vpc-info-block">' +
		'<div class="info-row"><div class="info-label">BASE</div><div class="info-data"><div class="info-name">' + base.name + '</div><div class="info-desc">' + base.description + '</div></div></div>' +
		'<div class="info-row"><div class="info-label">COVER</div><div class="info-data"><div class="info-name">' + color.name + ' ' + pattern.name + '</div><div class="info-desc">' + pattern.description + '</div></div></div>' +
		'<div class="info-row"><div class="info-label">SHADE</div><div class="info-data"><div class="info-name">' + shade.name + '</div><div class="info-desc">' + shade.description + '</div></div></div>' +
		'<div class="info-row"><div class="info-label">SPECS</div><div class="info-data"><a href="' + rsmJson.siteurl + '?' + 'action=download-spec-pdf&base=' + base.name + '&color=' + color.name + '&pattern=' + pattern.name + '&shade=' + shade.name + '" target="_blank">Download Spec</a></div></div>' +
		'</div>';

	jQuery('.vpc-info-block').remove();
	jQuery('#vpc-price-container').prepend(html);
}

function getOptionAttribute(str_selector) {
	str_selector += ' .vpc-options input:checked';
	var obj = jQuery(str_selector).parent().next('.rsm-vpc-info');
	if (obj.length == 0) {
		return {
			name: '',
			price: '',
			description: '',
		};
	} else {
		return {
			name: obj.data('name'),
			price: obj.data('price'),
			description: obj.html(),
		};
	}
}

function rsmInitCongurator() {
	var oldHtml = jQuery('#vpc-price-container').html();
	jQuery('#vpc-price-container').html('');
	jQuery('#vpc-price-container').append('<div class="vpc-action-block"><div class="vpc-price-row">' + oldHtml + '</div><div class="vpc-action-row"></div></div>');
	jQuery('#vpc-save-btn').text('SAVE').appendTo('.vpc-action-row');
	jQuery('#vpc-add-to-cart').text('BUY').appendTo('.vpc-action-row');
	rsmUpdateProductInfo();
	jQuery('.vpc-component.BaseType .vpc-options label').click();
}
