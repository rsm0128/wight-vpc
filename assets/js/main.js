var MOUSE_OVER = false;
document.addEventListener("mousewheel", function(e){
	if (MOUSE_OVER) {
		e.preventDefault();
		return false;
	}
}, { passive: false });

jQuery( document ).ready(function() {
	/*------------ZOOM------------*/
	var ul = jQuery('#vpc-preview');
    var ulHeight = jQuery('#vpc-preview').outerHeight();

	jQuery('body').on('mousemove', '#vpc-preview', function(e){
		var win = jQuery('#vpc-preview');
		var cST = win.scrollTop();

		ulHeight = jQuery('#vpc-preview').outerHeight();

		if ( e.pageY >= (ulHeight/1.2) ){
			win.scrollTop(cST + 10);
		} else {
			win.scrollTop(cST - 10);
		}
	});
	/*------------ZOOM------------*/

	/*-----UP AND DOWN MOVE FOR PATTERN IMAGES----*/


	var state = 'no';
	var scroll_state = 'yes';

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

	jQuery( "body" ).on( "click", '.Pattern .vpc-group .vpc-single-option-wrap:not(:last-child) label', function(){
		//var curr_scroll = jQuery(this).parent().position().top;
		var el_index = jQuery(this).closest('.vpc-group').find('label').index(jQuery(this));
		if(el_index !== 1){
			var el_height =  jQuery(this).parent().height();
			var curr_scroll = el_height * (el_index - 1);

			jQuery(this).parents('.vpc-group').animate({ scrollTop: curr_scroll }, 600 );
		}
	});
	/*-----UP AND DOWN MOVE FOR PATTERN IMAGES----*/

	/*-----SHOW HIDE FOR TABS----*/
	jQuery( "body" ).on( "click", '.vpc-tab-header', function(){
		//alert('click to show options');
		jQuery('.Color .vpc-component-header').hide();
		jQuery('.Color .vpc-options').hide();
		jQuery('.Shade .vpc-component-header').hide();
		jQuery('.Shade .vpc-options').hide();
		jQuery('.BaseTab .vpc-component-header').hide();
		jQuery('.BaseTab .vpc-options').hide();
		jQuery('.vpc-tab-header').css("background-color", "transparent");

		jQuery( this ).siblings('.vpc-options').show();
		jQuery( this ).css("background-color", "#f1f1f1");

		if ( jQuery( this ).hasClass( "Color" ) ) {
			jQuery( '.vpc-component.Pattern' ).show();
		}else{
			jQuery( '.vpc-component.Pattern' ).hide();
		}
	});
	/*-----SHOW HIDE FOR TABS----*/
});
