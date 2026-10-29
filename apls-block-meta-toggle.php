<?php
/**
 * Plugin Name:       APLS Block Meta Toggle
 * Plugin URI:        https://github.com/dlinstedt/apls-block-meta-toggle
 * Description:       A lightweight, durable inline height toggle for Block Editor meta boxes. Keeps custom fields accessible without cluttering the canvas.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Dan Linstedt
 * Author URI:        https://aplusplugins.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       apls-block-meta-toggle
 */

namespace APLS\BlockMetaToggle;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Main Plugin Bootstrap Class
 */
final class Plugin {

    /**
     * Singleton instance container.
     *
     * @var Plugin|null
     */
    private static ?Plugin $instance = null;

    /**
     * Internal initialization flag to prevent duplicate execution loops.
     *
     * @var bool
     */
    private bool $initialized = false;

    /**
     * Main Entry Point / Singleton Loader.
     * Guarantees single execution per request.
     *
     * @return Plugin
     */
    public static function init(): Plugin {
        if ( null === self::$instance ) {
            self::$instance = new self();
            self::$instance->boot();
        }
        return self::$instance;
    }

    /**
     * Private constructor to enforce Singleton pattern.
     */
    private function __construct() {}

    /**
     * Register hooks if not already initialized.
     * Strict is_admin() guard ensures execution ONLY inside WordPress wp-admin.
     *
     * @return void
     */
    private function boot(): void {
        if ( $this->initialized ) {
            return;
        }

        // Strict Admin Area Check: Prevent initialization on front-end requests entirely
        if ( ! is_admin() ) {
            return;
        }

        $this->initialized = true;

        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
    }

    /**
     * Robust Block Editor Environment Check.
     * Combines $pagenow URL state with get_current_screen() fallback.
     *
     * @return bool
     */
    private function is_block_editor_screen(): bool {
        global $pagenow;

        // Verify we are strictly in wp-admin and editing a post or post-new page
        if ( ! is_admin() || ! in_array( $pagenow, [ 'post.php', 'post-new.php' ], true ) ) {
            return false;
        }

        // Secondary Guard: Fallback check against WP_Screen object
        if ( function_exists( 'get_current_screen' ) ) {
            $screen = get_current_screen();
            if ( $screen instanceof \WP_Screen ) {
                return (bool) $screen->is_block_editor();
            }
        }

        return true;
    }

    /**
     * Enqueue CSS and JS assets using standard WordPress registration APIs.
     *
     * @return void
     */
    public function enqueue_admin_assets(): void {
        if ( ! $this->is_block_editor_screen() ) {
            return;
        }

        $plugin_dir_path = plugin_dir_path( __FILE__ );
        $plugin_dir_url  = plugin_dir_url( __FILE__ );

        $css_file = 'assets/css/apls-block-meta-toggle.css';
        $js_file  = 'assets/js/apls-block-meta-toggle.js';

        // Cache Buster via File Modification Time
        $css_version = file_exists( $plugin_dir_path . $css_file ) 
            ? (string) filemtime( $plugin_dir_path . $css_file ) 
            : '1.0.0';

        $js_version = file_exists( $plugin_dir_path . $js_file ) 
            ? (string) filemtime( $plugin_dir_path . $js_file ) 
            : '1.0.0';

        // Register and Enqueue Stylesheet
        wp_enqueue_style(
            'apls-block-meta-toggle-css',
            $plugin_dir_url . $css_file,
            [],
            $css_version
        );

        // Register and Enqueue JavaScript
        wp_enqueue_script(
            'apls-block-meta-toggle-js',
            $plugin_dir_url . $js_file,
            [ 'wp-element', 'wp-components', 'wp-dom-ready' ],
            $js_version,
            true // Load in footer
        );

        // Pass translatable strings to JS
        wp_localize_script(
            'apls-block-meta-toggle-js',
            'aplsBlockMetaToggleL10n',
            [
                'toggleMeta' => __( 'Toggle Meta', 'apls-block-meta-toggle' ),
            ]
        );
    }
}

// Bootstrap Plugin
Plugin::init();
