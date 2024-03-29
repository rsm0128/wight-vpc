<?php
/**
 * WIGHT Design Group Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WIGHT Design Group
 * @since 1.0.0
 */

/**
 * Define Constants
 */
define( 'CHILD_THEME_WIGHT_DESIGN_GROUP_VERSION', '1.0.0' );
define( 'RSM_BUILDER_PAGE_URL', 'https://siteview.app/projects/wight/sample-page/configure/317/' );

/**
 * Enqueue styles
 */
add_action( 'wp_enqueue_scripts', 'child_enqueue_styles', 15 );
function child_enqueue_styles() {
	wp_enqueue_style( 'wight-design-group-theme-css', get_stylesheet_directory_uri() . '/style.css', array('astra-theme-css'), CHILD_THEME_WIGHT_DESIGN_GROUP_VERSION, 'all' );

	wp_enqueue_script('main-js', get_stylesheet_directory_uri() . '/assets/js/main.js', array('jquery'), wp_rand() );
	wp_localize_script('main-js', 'rsmJson', array( 'siteurl' => get_option('siteurl') ));
	wp_enqueue_script('ui', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js', array('jquery') );
	wp_enqueue_style('rsm-bootstrap-style', get_stylesheet_directory_uri() . '/assets/bootstrap/bootstrap.min.css');
	wp_enqueue_script('rsm-bootstrap-script', get_stylesheet_directory_uri() . '/assets/bootstrap/bootstrap.min.js', array('jquery'));

	// remove tooltip
	wp_dequeue_script('o-tooltip');
}

add_action( 'wp_footer', 'rsm_footer_enqueue_script', 15 );
function rsm_footer_enqueue_script() {
	wp_enqueue_style( 'wight-rsm-custom', get_stylesheet_directory_uri() . '/assets/css/rsm.css', array(), wp_rand() );
	wp_enqueue_style( 'wight-rsm-responsive', get_stylesheet_directory_uri() . '/assets/css/responsive.css', array(), wp_rand());
}

add_filter( 'vpc_output_editor', 'rsm_vpc_output_editor', 10, 3 );

function rsm_vpc_output_editor( $content, $product_id, $config_id ) {
	$content .= '<script>rsmInitCongurator();</script>';
	return $content;
}

// add visual product configurator option info block so that we can use the info for the description section
add_action('vpc_each_radio_end', 'rsm_vpc_option_info_block', 10, 7);
function rsm_vpc_option_info_block($option, $o_image, $price, $option_id, $component, $skin_name, $config_to_load) {
	echo sprintf('<div class="rsm-vpc-info" data-name="%s" data-price="%s">%s</div>', $option['name'], $price, $option['desc']);
}

function rsm_template_redirect() {
    if ( isset($_REQUEST['action']) && $_REQUEST['action'] == 'download-spec-pdf' ) {
		$upload_dir = wp_upload_dir();
		$file_name = $_REQUEST['base'] . '_' . $_REQUEST['color'] . '_' . $_REQUEST['pattern'] . '_' . $_REQUEST['shade'] . '.pdf';
		$file_full_path = $upload_dir['basedir'] . '/pdf/' . $file_name;
		if ( file_exists( $file_full_path ) ) {
			header("Content-type:application/pdf");
			header("Content-Disposition:attachment;filename=". $file_name);
			readfile($file_full_path);
		} else {
			$file_name = 'default.pdf';
			$default_full_path = $upload_dir['basedir'] . '/pdf/' . $file_name;
			header("Content-type:application/pdf");
			header("Content-Disposition:attachment;filename=". $file_name);
			readfile($default_full_path);
		}
		die();
    }
}
add_action( 'template_redirect', 'rsm_template_redirect' );

add_filter( 'wc_add_to_cart_message', 'custom_wc_add_to_cart_message', 10, 2 );

 function custom_wc_add_to_cart_message( $message, $product_id ) {

 $message = sprintf( '%s has been added to your selection.', get_the_title( $product_id ) );

 return $message;

 }

 add_action( 'vpc_after_components', 'rsm_sfl_form', 10, 3 );
 function rsm_sfl_form( $config, $product_id, $config_to_load ) {
 ?>
 		<div class="sfl-form-wrapper">
          <div class="sfl-form">
            <div>
                <div class="form-title">
				  <h1 class="sfl-form-title">LOVE IT</h1>
				  <div class="sfl-form-close">
					  &times;
				  </div>
                </div>
            </div>
            <div>
                <div class="sfl-form-name">
                    <span>SAVE TO MY GALLERY</span>
                    <input type="text" placeholder="" name="cname" id="config_name" required><br>
                    <label for="cname">name your lamp</label>
                </div>
			</div>

			<?php if ( is_user_logged_in() ) : ?>

			<div>
                <div class="sfl-form-save">
                    <span><a href="#" id="save_configuration">SAVE</a> TO NEW GALLERY</span><br>
                </div>
			</div>

			<?php else : ?>

			<div class="sfl-form-instruct">
                <p class="sfl-form-instruct-copy"><span class="title">HAVE AN EXISTING ACCOUNT?</span><br>
                <span style="font-style: italic">If so, login now to save this design to your existing gallery.</span></p>
                <p class="sfl-form-instruct-copy">
                <span style="font-style: italic">If not, create an account now or anytime before you leave to save all your beautiful designs into your account gallery.</span>
                </p>
            </div>
            <div>
                 <div class="sfl-form-login">
                    <a href="#">LOGIN</a> TO MY ACCOUNT
                </div>
                <div class="sfl-form-create">
                    <a href="#">CREATE</a> AN ACCOUNT
                </div>
                <div class="sfl-form-save">
                    <span><a href="#" id="save_configuration">SAVE</a> TO NEW GALLERY</span><br>
                    <span class="desc">I'll create my account later.</span>
                </div>
			</div>
			<?php endif; ?>

          </div>
		</div>

 <?php
 }

 add_filter( 'woocommerce_cart_item_permalink', '__return_null' );

 // /public_html/projects/wight/wp-content/themes/wight-child
