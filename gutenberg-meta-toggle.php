<?php
/**
 * Plugin Name:       Gutenberg Meta Toggle
 * Plugin URI:        https://github.com/your-username/wp-gutenberg-meta-toggle
 * Description:       A lightweight, durable inline height toggle for WordPress Block Editor meta boxes. Keeps custom fields accessible without cluttering the canvas.
 * Version:           1.0.0
 * Author:            Dan Linstedt
 * Author URI:        https://aplusplugins.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gutenberg-meta-toggle
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

add_action( 'admin_head', function() {
    $screen = get_current_screen();
    if ( ! $screen || ! $screen->is_block_editor() ) {
        return;
    }
    ?>
    <style id="acf-height-toggle-css">
        /* Top Toolbar Gear Toggle Button */
        #acf-meta-toggle-btn {
            background: transparent;
            color: #1e1e1e;
            border: none;
            padding: 6px;
            border-radius: 2px;
            cursor: pointer;
            margin-right: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            position: relative;
            box-sizing: border-box;
            transition: background 0.15s ease, color 0.15s ease;
        }
        #acf-meta-toggle-btn:hover,
        body.acf-panel-expanded #acf-meta-toggle-btn {
            background: #f0f0f0;
            color: #2271b1;
        }

        /* Active indicator badge on gear icon when expanded */
        body.acf-panel-expanded #acf-meta-toggle-btn::before {
            content: "";
            position: absolute;
            top: 6px;
            right: 6px;
            width: 7px;
            height: 7px;
            background-color: #2271b1;
            border-radius: 50%;
        }

        /* Tooltip (High z-index to prevent sidebar clipping) */
        #acf-meta-toggle-btn::after {
            content: "Toggle Meta";
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 6px;
            background: #1e1e1e;
            color: #ffffff;
            padding: 4px 8px;
            font-size: 11px;
            border-radius: 2px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease;
            z-index: 9999999 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        }
        #acf-meta-toggle-btn:hover::after {
            opacity: 1;
        }

        /* MINIMIZED STATE: Drag bar retained at standard 32px height, fields clipped */
        .edit-post-meta-boxes-main:not(.acf-expanded-view) {
            height: 32px !important;
            min-height: 32px !important;
            max-height: 32px !important;
            overflow: hidden !important;
            border-top: 1px solid #dcdcde !important;
            transition: height 0.25s ease-in-out;
        }

        /* Ensure inner field container is hidden when minimized */
        .edit-post-meta-boxes-main:not(.acf-expanded-view) .edit-post-layout__metaboxes {
            display: none !important;
        }

        /* EXPANDED STATE: Full visible height in canvas flow */
        .edit-post-meta-boxes-main.acf-expanded-view {
            height: calc(100vh - 120px) !important;
            max-height: none !important;
            overflow-y: auto !important;
            border-top: 2px solid #2271b1 !important;
            background: #ffffff !important;
            transition: height 0.25s ease-in-out;
        }

        .edit-post-meta-boxes-main.acf-expanded-view .edit-post-layout__metaboxes,
        .edit-post-meta-boxes-main.acf-expanded-view .edit-post-meta-boxes-area {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            display: block !important;
        }
    </style>
    <?php
} );

add_action( 'admin_footer', function() {
    $screen = get_current_screen();
    if ( ! $screen || ! $screen->is_block_editor() ) {
        return;
    }
    ?>
    <script id="acf-height-toggle-js">
    (function() {
        function setupMetaHeightToggle() {
            var poststuff = document.getElementById('poststuff');
            var mainWrapper = document.querySelector('.edit-post-meta-boxes-main');
            var topToolbar = document.querySelector('.edit-post-header__settings') || 
                             document.querySelector('.interface-pinned-items');

            if (!poststuff || !topToolbar || document.getElementById('acf-meta-toggle-btn')) {
                return;
            }

            var hasBoxes = poststuff.querySelectorAll('.postbox').length > 0;
            if (!hasBoxes) {
                return;
            }

            // Create Toolbar Button
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'acf-meta-toggle-btn';
            btn.setAttribute('aria-label', 'Toggle Meta');
            btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
            
            topToolbar.insertBefore(btn, topToolbar.firstChild);

            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var targetWrapper = mainWrapper || poststuff.closest('.edit-post-meta-boxes-main') || poststuff;
                var isExpanded = targetWrapper.classList.toggle('acf-expanded-view');
                document.body.classList.toggle('acf-panel-expanded', isExpanded);

                if (isExpanded) {
                    // Auto-uncollapse hidden inner containers when expanding
                    var collapsedLiners = targetWrapper.querySelectorAll('.edit-post-layout__metaboxes[hidden], [aria-expanded="false"]');
                    collapsedLiners.forEach(function(el) {
                        el.removeAttribute('hidden');
                        if (el.getAttribute('aria-expanded') === 'false') {
                            el.setAttribute('aria-expanded', 'true');
                        }
                    });

                    targetWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Minimize behavior: Scroll back up to the main block editor canvas
                    var editorCanvas = document.querySelector('.edit-post-visual-editor') || document.querySelector('.block-editor-writing-flow');
                    if (editorCanvas) {
                        editorCanvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        }

        var checkInterval = setInterval(function() {
            if (document.getElementById('poststuff') && 
               (document.querySelector('.edit-post-header__settings') || document.querySelector('.interface-pinned-items'))) {
                setupMetaHeightToggle();
                clearInterval(checkInterval);
            }
        }, 500);
    })();
    </script>
    <?php
} );
