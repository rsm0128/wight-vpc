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

/**
 * Enqueue styles
 */ 
add_action( 'wp_enqueue_scripts', 'child_enqueue_styles', 15 );
function child_enqueue_styles() {
	wp_enqueue_style( 'wight-design-group-theme-css', get_stylesheet_directory_uri() . '/style.css', array('astra-theme-css'), CHILD_THEME_WIGHT_DESIGN_GROUP_VERSION, 'all' );
	
	wp_enqueue_script('main-js', get_stylesheet_directory_uri() . '/assets/js/main.js', array('jquery') );	
	wp_enqueue_script('rsm-js', get_stylesheet_directory_uri() . '/assets/js/rsm.js', array('jquery'), wp_rand() );	
	//wp_enqueue_script('scroll-lock', get_stylesheet_directory_uri() . '/jquery-scrollLock.js', array('jquery') );	
	wp_enqueue_script('ui', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js', array('jquery') );
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