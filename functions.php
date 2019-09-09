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
	wp_enqueue_style('rsm-bootstrap-style', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
	wp_enqueue_script('rsm-bootstrap-script', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', array('jquery'));

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

add_action( 'woocommerce_before_cart_table', 'rsm_woo_add_continue_shopping_button_to_cart' );
function rsm_woo_add_continue_shopping_button_to_cart() {
 $shop_page_url = empty(RSM_BUILDER_PAGE_URL) ? get_permalink( wc_get_page_id( 'shop' ) ) : RSM_BUILDER_PAGE_URL;

 echo '<div class="woocommerce-message">';
 echo ' <a href="'.$shop_page_url.'" class="button">Continue Shopping →</a> Would you like some more goods?';
 echo '</div>';
}
