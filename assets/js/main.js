var MOUSE_OVER = false;
document.addEventListener("wheel", function(e){
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
		jQuery('.vpc-component.ShadeSub').hide();
		jQuery('.vpc-component.Pattern').hide();
		jQuery('.vpc-component.BaseTab').show();

		jQuery('.vpc-tab-header.Shade').removeClass('label-active');
		jQuery('.vpc-tab-header.Color').removeClass('label-active');
		jQuery('.vpc-tab-header.Base').addClass('label-active');
	});

	jQuery('body').on('click', '.vpc-component.Color .vpc-options label', function(e){
		if (jQuery('.BaseTab .vpc-options input:checked').length == 0 ) {
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
		jQuery('.vpc-component.ShadeSub').hide();
		jQuery('.vpc-component.BaseTab').hide();
		jQuery('.vpc-component.Pattern').show();

		jQuery('.vpc-tab-header.Shade').removeClass('label-active');
		jQuery('.vpc-tab-header.Base').removeClass('label-active');
		jQuery('.vpc-tab-header.Color').addClass('label-active');

		// jQuery('.vpc-component.Pattern .vpc-options .vpc-group').scrollTop(0);
		jQuery('.vpc-component.Color').removeClass('rsm-initial');
	});

	jQuery('body').on('click', '.vpc-component.Shade .vpc-options label', function(){
		jQuery('.vpc-component.ShadeSub').show();
		jQuery('.vpc-component.Pattern').hide();
		jQuery('.vpc-component.BaseTab').hide();

		jQuery('.vpc-tab-header.Color').removeClass('label-active');
		jQuery('.vpc-tab-header.Base').removeClass('label-active');
		jQuery('.vpc-tab-header.Shade').addClass('label-active');
	});

	jQuery('body').on('click', '.vpc-tab-header', function(){
		jQuery('.vpc-tab-header').removeClass('label-active');
		jQuery(this).addClass('label-active');
	});

	jQuery('body').on('click', '.vpc-component.Base .vpc-options label, .vpc-component.BaseTab .vpc-options label', function(){
		setTimeout(() => {
			if (jQuery('.vpc-component.BaseTab .vpc-options input:checked').length > 0) {
				jQuery('#vpc-preview').addClass('filled-base');
			} else {
				jQuery('#vpc-preview').removeClass('filled-base');
			}
		}, 10);
	});
	jQuery('body').on('click', '.vpc-component.Shade .vpc-options label, .vpc-component.ShadeSub .vpc-options label', function(){
		setTimeout(() => {
			if ( jQuery('.vpc-component.ShadeSub .vpc-options input:checked').length > 0 ) {
				jQuery('#vpc-preview').addClass('filled-shade');
			} else {
				jQuery('#vpc-preview').removeClass('filled-shade');
			}
		}, 100);
	});

	// mouse wheel activity
	jQuery('body').on('mousemove','.Pattern .vpc-group', function(){
		if(state == 'no'){ // ensures only call at first
			state = 'yes';
			jQuery('body .Pattern .vpc-group').mouseenter(function(){ MOUSE_OVER=true; });
			jQuery('body .Pattern .vpc-group').mouseleave(function(){ MOUSE_OVER=false; });
		}
	});

	jQuery('body').on('wheel', '.vpc-group', function (event) {
		var curr_scroll = jQuery(this).scrollTop();

		// var delta = e.originalEvent.wheelDelta;
		if (scroll_state == 'yes') {
			if (event.originalEvent.deltaY < 0) {
				// if(delta > 0){
				//go up
				scroll_state = 'no';
				jQuery(this).animate({ scrollTop: curr_scroll - 300 }, 600, function () {
					scroll_state = 'yes';
				});
			} else {
				//go down
				scroll_state = 'no';
				jQuery(this).animate({ scrollTop: curr_scroll + 300 }, 600, function () {
					scroll_state = 'yes';
				});
			}
		} else {
		}
	});

	var leftButtonDown = false;
	jQuery('body').on('mouseup', function(e){
		if (e.which === 1 && leftButtonDown) {
			leftButtonDown = false;
			jQuery('#vpc-preview').removeClass('active');
		}
	});

	jQuery('body').on('mousedown', '#vpc-preview', function(e){
		if (e.which === 1) {
			leftButtonDown = true;
			jQuery('#vpc-preview').addClass('active');
			jQuery('#vpc-preview:hover img').attr('draggable', false);
			jQuery('#vpc-preview:hover img').attr('ondragstart', 'return false;');
		}
	});

	jQuery('body').on('mousemove', function(e){
		if (!leftButtonDown) return;
		var objLeft = jQuery('#vpc-preview').offset().left;
		var objTop = jQuery('#vpc-preview').offset().top;

		var xPosSTR = (event.pageX - objLeft) + 'px';
		var yPosSTR = (event.pageY - objTop) + 'px';
		jQuery('#vpc-preview:hover img').css({
			'transform-origin': xPosSTR + ' ' + yPosSTR + ' 0px',
			'-webkit-transform-origin': xPosSTR + ' ' + yPosSTR + ' 0px'
		});
	});

	// scroll action to pattern
	jQuery( "body" ).on( "click", '.Pattern .vpc-group .vpc-single-option-wrap label', function(){

	});

	jQuery("body").on("click", '.ShadeSub .vpc-group .vpc-single-option-wrap label', function(){
		moveToCenter( jQuery(this), 80 );
	});

	function moveToCenter(obj, el_height) {
		var el_index = obj.closest('.vpc-group').find('label').index(obj);
		if (el_index > 0) {
			var curr_scroll = el_height * (el_index - 1);

			obj.parents('.vpc-group').animate({ scrollTop: curr_scroll }, 600);
		} else {
			obj.parents('.vpc-group').animate({ scrollTop: 0 }, 600);
		}
	}

	jQuery('body').on('click', '.sfl-form-close', function(){
		jQuery('.sfl-form-wrapper').hide();
	});

	jQuery('body').on('click', '#vpc-save-btn', function (e) {
		e.stopPropagation();
		e.preventDefault();
		jQuery('.sfl-form-wrapper').show();
		return false;
	});

	jQuery('body').on('click', '#save_configuration', function (e) {
		e.stopPropagation();
		e.preventDefault();
		jQuery('.loader').show('slow');

		var pid = jQuery('#vpc-save-btn').data('pid');
		var config_name = jQuery('#config_name').val();
		var recap = jQuery('#vpc-container').find(':input').serializeJSON();
		if (!vpc.log) {
			jQuery.post(
				ajax_object.ajax_url,
				{
					action: "save_in_cookies",
					pid: pid,
					recap: recap,
					config_name: config_name
				},
				function (data) {
					jQuery('.loader').hide();
					window.location = vpc.login_page;
				}
			);
		}
		else {
			jQuery.post(
				ajax_object.ajax_url,
				{
					action: "save_for_later",
					pid: pid,
					recap: recap,
					config_name: config_name
				},
				function (id) {
					jQuery('.loader').hide();

					var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?edit_config=' + id;
					var newHtml = '<div class="saved_bloc"><a class="save_later" href="' + newUrl + '">' + config_name + '</a><span id="delete_saved" data-id="' + id + '">x</span></div>';
					jQuery('.saved_panel .saved_configurations').append(newHtml);

					jQuery('#debug').html('<div class="vpc-success f-right">' + vpc.success_msg + '</div>').show().delay(1000).fadeOut(1000);
					// location.reload();
				}
			);
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
	var base = getOptionAttribute('.BaseTab');
	var color = getOptionAttribute('.Color');
	var pattern = getOptionAttribute('.Pattern');
	var shade = getOptionAttribute('.ShadeSub');

	var label = '';
	label = (base.name != '') ? base.name + ' $' + base.price : '';
	jQuery('.vpc-component.BaseTab .vpc-options').attr('data-content', label);

	label = (pattern.name != '') ? pattern.name + ' $' + pattern.price : '';
	jQuery('.vpc-component.Pattern .vpc-options').attr('data-content', label);

	label = (shade.name != '') ? shade.name + ' $' + shade.price : '';
	jQuery('.vpc-component.ShadeSub .vpc-options').attr('data-content', label);

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

	if (jQuery('.vpc-component.BaseTab .vpc-options input:checked').length > 0) {
		jQuery('#vpc-preview').addClass('filled-base');
	}
	if (jQuery('.vpc-component.ShadeSub .vpc-options input:checked').length > 0) {
		jQuery('#vpc-preview').addClass('filled-shade');
	}

	// add loader
	jQuery("#vpc-container").append("<div class='loader'><img src='" + myPluginVars.pluginUrl + "loader.gif'></div>");
}
