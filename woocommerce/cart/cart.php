<?php
/**
 * Cart Page
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/cart/cart.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates
 * @version 3.7.0
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_cart' ); ?>

<form class="woocommerce-cart-form" action="<?php echo esc_url( wc_get_cart_url() ); ?>" method="post">
	<?php do_action( 'woocommerce_before_cart_table' ); ?>
	<div class="shop_table shop_table_responsive cart woocommerce-cart-form__contents" cellspacing="0">
	<?php
		global $woocommerce,$vpc_settings;
		foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
			$_product   = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
			$product_id = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );

			if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
				$product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
				$product_id = ($cart_item["variation_id"]) ? $cart_item["variation_id"] : $cart_item["product_id"];

				$config_url = vpc_get_configuration_url($product_id);
				$cart_content = $woocommerce->cart->cart_contents;
				$item_content = $cart_content[$cart_item_key];
				$edit_url = (get_option('permalink_structure')) ? $config_url . "?edit=$cart_item_key&qty=" . $item_content['quantity'] : $config_url . "&edit=$cart_item_key&qty=" . $item_content['quantity'];

				$config = get_product_config($product_id);
				$recap = get_recap_from_cart_item($cart_item);
				$filtered_recap = apply_filters("vpc_filter_recap", $recap, $config, true);
				$base_img_src = o_get_proper_image_url( VPC_Public::extract_option_field_from_config($filtered_recap['BaseTab'], 'BaseTab', $config->settings, "image") );
				$cover_img_src = o_get_proper_image_url( VPC_Public::extract_option_field_from_config($filtered_recap['Pattern'], 'Pattern', $config->settings, "icon") );
				$shade_img_src = o_get_proper_image_url( VPC_Public::extract_option_field_from_config($filtered_recap['ShadeSub'], 'ShadeSub', $config->settings, "image") );
				$img_src = o_get_proper_image_url( VPC_Public::extract_option_field_from_config($filtered_recap['ShadeSub'], 'ShadeSub', $config->settings, "image") );
				?>
				<div class="woocommerce-cart-form__cart-item rsm-flex-wrapper <?php echo esc_attr( apply_filters( 'woocommerce_cart_item_class', 'cart_item', $cart_item, $cart_item_key ) ); ?>">
					<div class="product-thumbnail rsm-flex-half">
						<div class="product-thumbnail-wrapper">
							<?php
								$thumbnail = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );

								if ( ! $product_permalink ) {
									echo $thumbnail; // PHPCS: XSS ok.
								} else {
									printf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $thumbnail ); // PHPCS: XSS ok.
								}
							?>
						</div>
						<div class="product-action-wrapper rsm-flex-wrapper">
							<?php
								echo apply_filters( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									'woocommerce_cart_item_remove_link',
									sprintf(
										'<a href="%s" class="remove" aria-label="%s" data-product_id="%s" data-product_sku="%s">REMOVE LAMP</a>',
										esc_url( wc_get_cart_remove_url( $cart_item_key ) ),
										esc_html__( 'REMOVE LAMP', 'woocommerce' ),
										esc_attr( $product_id ),
										esc_attr( $_product->get_sku() )
									),
									$cart_item_key
								);
							?>
							<a class="edit-lamp" href="<?php echo $edit_url ?>">EDIT LAMP</a>
						</div>
					</div>
					<div class="product-name rsm-flex-half" data-title="Product">
						<div class="rsm-flex-wrapper">
							<div class="rsm-flex-half base-image">
								<div class="attribute-title">BASE</div>
								<div class="attribute-thumbnail"><img src="<?php echo $base_img_src ?>"></div>
							</div>
							<div class="rsm-flex-half cover-image">
								<div class="attribute-title">COVER</div>
								<div class="attribute-thumbnail"><img src="<?php echo $cover_img_src ?>"></div>
							</div>
						</div>
						<div class="rsm-flex-wrapper">
							<div class="rsm-flex-half shade-image">
								<div class="attribute-title">SHADE</div>
								<div class="attribute-thumbnail"><img src="<?php echo $shade_img_src ?>"></div>
							</div>
							<div class="rsm-flex-half accessory-image">
								<div class="attribute-title">ACCESSORY</div>
								<!-- <div class="attribute-thumbnail"><img src="<?php echo $img_src ?>"></div> -->
							</div>
						</div>
						<div class="product-quantity" data-title="Quantity">
							<div class="quantity cleafix">
								<?php
								if ( $_product->is_sold_individually() ) {
									$product_quantity = sprintf( '1 <input type="hidden" name="cart[%s][qty]" value="1" />', $cart_item_key );
								} else {
									$product_quantity = woocommerce_quantity_input(
										array(
											'input_name'   => "cart[{$cart_item_key}][qty]",
											'input_value'  => $cart_item['quantity'],
											'max_value'    => $_product->get_max_purchase_quantity(),
											'min_value'    => '0',
											'product_name' => $_product->get_name(),
										),
										$_product,
										false
									);
								}

								echo apply_filters( 'woocommerce_cart_item_quantity', $product_quantity, $cart_item_key, $cart_item ); // PHPCS: XSS ok.
								?>
							</div>
						</div>
						<div class="rsm-flex-wrapper product-total">
							<div class="product-price" data-title="Price">
								<label>PRICE</label>
								<?php
									echo apply_filters( 'woocommerce_cart_item_price', WC()->cart->get_product_price( $_product ), $cart_item, $cart_item_key ); // PHPCS: XSS ok.
								?>
							</div>
							<div class="product-subtotal" data-title="Total">
								<label>TOTAL</label>
								<?php
									echo apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key ); // PHPCS: XSS ok.
								?>
							</div>
						</div>
					</div>
				</div>
				<?php
			}
		} ?>
	</div>

	<table class="shop_table shop_table_responsive cart woocommerce-cart-form__contents" cellspacing="0">
		<tbody>

			<?php do_action( 'woocommerce_before_cart_contents' ); ?>
			<?php do_action( 'woocommerce_after_cart_contents' ); ?>
		</tbody>
	</table>
	<?php do_action( 'woocommerce_after_cart_table' ); ?>
</form>

<?php do_action( 'woocommerce_before_cart_collaterals' ); ?>

<div class="cart-collaterals">
	<?php
		/**
		 * Cart collaterals hook.
		 *
		 * @hooked woocommerce_cross_sell_display
		 * @hooked woocommerce_cart_totals - 10
		 */
		do_action( 'woocommerce_cart_collaterals' );
	?>
</div>

<?php do_action( 'woocommerce_after_cart' ); ?>
