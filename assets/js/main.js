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
	jQuery('body').on('click', '.vpc-component.Base .vpc-options label', function(){
		jQuery('.vpc-component.Shade').hide();
		jQuery('.vpc-component.Pattern').hide();
		jQuery('.vpc-component.Base').show();

		jQuery('.vpc-tab-header.ShadeType').removeClass('label-active');
		jQuery('.vpc-tab-header.Color').removeClass('label-active');
		jQuery('.vpc-tab-header.Base').addClass('label-active');
	});

	jQuery('body').on('click', '.vpc-component.Color .vpc-options label', function(e){
		if (jQuery('.Base .vpc-options input:checked').length == 0 ) {
			// base is not selected
			if (jQuery('#rsmModal').length == 0) {
				var modalHTML = '<div class="modal fade" id="rsmModal" role="dialog"><div class="modal-dialog">' +
								'<div class="modal-content"><div class="modal-header">' +
								'<button type="button" class="close" data-dismiss="modal">&times;</button>' +
								'<h4 class="modal-title">Please choose base first</h4>' +
								'</div></div>' +
								'</div></div>';
				jQuery('body').append(modalHTML);
			}
			jQuery('#rsmModal').modal();
			return;
		}
		jQuery('.vpc-component.Shade').hide();
		jQuery('.vpc-component.Base').hide();
		jQuery('.vpc-component.Pattern').show();

		jQuery('.vpc-tab-header.ShadeType').removeClass('label-active');
		jQuery('.vpc-tab-header.Base').removeClass('label-active');
		jQuery('.vpc-tab-header.Color').addClass('label-active');

		jQuery('.vpc-component.Pattern .vpc-options .vpc-group').scrollTop(0);
		jQuery('.vpc-component.Color').removeClass('rsm-initial');
	});

	jQuery('body').on('click', '.vpc-component.ShadeType .vpc-options label', function(){
		jQuery('.vpc-component.Shade').show();
		jQuery('.vpc-component.Pattern').hide();
		jQuery('.vpc-component.Base').hide();

		jQuery('.vpc-tab-header.Color').removeClass('label-active');
		jQuery('.vpc-tab-header.Base').removeClass('label-active');
		jQuery('.vpc-tab-header.ShadeType').addClass('label-active');
	});

	jQuery('body').on('click', '.vpc-tab-header', function(){
		jQuery('.vpc-tab-header').removeClass('label-active');
		jQuery(this).addClass('label-active');
	});

	jQuery('body').on('click', '.vpc-component.Base .vpc-options label, .vpc-component.Base .vpc-options label', function(){
		setTimeout(() => {
			if (jQuery('.vpc-component.Base .vpc-options input:checked').length > 0) {
				jQuery('#vpc-preview').addClass('filled-base');
			} else {
				jQuery('#vpc-preview').removeClass('filled-base');
			}
		}, 10);
	});
	jQuery('body').on('click', '.vpc-component.ShadeType .vpc-options label, .vpc-component.Shade .vpc-options label', function(){
		setTimeout(() => {
			if ( jQuery('.vpc-component.Shade .vpc-options input:checked').length > 0 ) {
				jQuery('#vpc-preview').addClass('filled-shade');
			} else {
				jQuery('#vpc-preview').removeClass('filled-shade');
			}
		}, 100);
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

		var xPosSTR = (event.pageX - objLeft) + 'px';
		var yPosSTR = (event.pageY - objTop) + 'px';
		jQuery('#vpc-preview:hover img').css({
			'transform-origin': xPosSTR + ' ' + yPosSTR + ' 0px',
			'-webkit-transform-origin': xPosSTR + ' ' + yPosSTR + ' 0px'
		});
	});

	// scroll action to pattern
	jQuery( "body" ).on( "click", '.Pattern .vpc-group .vpc-single-option-wrap label', function(){
		var el_index = jQuery(this).closest('.vpc-group').find('label').index(jQuery(this));
		if(el_index > 0){
			var el_height = 100;
			var curr_scroll = el_height * (el_index - 1);

			jQuery(this).parents('.vpc-group').animate({ scrollTop: curr_scroll }, 600 );
		} else {
			jQuery(this).parents('.vpc-group').animate({ scrollTop: 0 }, 600);
		}
	});

	if (jQuery('#vpc-ajax-container').length) {
		// create a header section and move h1 to header, add logo
		jQuery('#vpc-ajax-container').before('<div id="vpc-header"><style>.entry-content{padding:50px;margin-left:-50px;margin-right:-50px;border: solid 1px #666;}</style></div>');
		jQuery('.page .entry-header').appendTo('#vpc-header');
		jQuery('#vpc-header').append('<img src="https://siteview.app/projects/wight/wp-content/themes/wight-child/logo.png" alt="logo" class="vpc-logo">');

		// update product info
		jQuery(document).on('click', 'label.custom', function (e) {
			// delay so that makes sure it called lately
			setTimeout(() => {
				rsmUpdateProductInfo(e);
			}, 10);
		});

		jQuery(document).on('click', '.info-row', function () {
			jQuery(this).toggleClass('active');
		});
	}
});

function rsmUpdateProductInfo(e) {
	var base = getOptionAttribute('.Base');
	var color = getOptionAttribute('.Color');
	var pattern = getOptionAttribute('.Pattern');
	var shade = getOptionAttribute('.Shade');

	var label = '';
	label = (base.name != '') ? base.name + ' $' + base.price : '';
	console.log(label);
	jQuery('.vpc-component.Base .vpc-options').attr('data-content', label);

	label = (pattern.name != '') ? pattern.name + ' $' + pattern.price : '';
	jQuery('.vpc-component.Pattern .vpc-options').attr('data-content', label);
	console.log(label);

	label = (shade.name != '') ? shade.name + ' $' + shade.price : '';
	jQuery('.vpc-component.Shade .vpc-options').attr('data-content', label);

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
	// move price field
	var oldHtml = jQuery('#vpc-price-container').html();
	jQuery('#vpc-price-container').html('');
	jQuery('#vpc-price-container').append('<div class="vpc-action-block"><div class="vpc-price-row">' + oldHtml + '</div><div class="vpc-action-row"></div></div>');

	// move save and buy button
	jQuery('#vpc-save-btn').text('SAVE').appendTo('.vpc-action-row');
	jQuery('#vpc-add-to-cart').text('BUY').appendTo('.vpc-action-row');

	// upate product info
	rsmUpdateProductInfo('');

	// make base as clicked
	jQuery('.vpc-component.Base .vpc-options label').click();

	// set all color as selected on load
	jQuery(".vpc-component.Color").addClass('rsm-initial');
}
