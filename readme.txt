=== Block Meta Toggle for WP ===
Contributors: dlinstedt
Donate link: https://aplusplugins.com
Tags: acf, meta box, block editor, custom fields, metabox
Requires at least: 5.8
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A lightweight inline height toggle for Block Editor meta boxes. Keeps custom fields accessible without canvas clutter.

== Description ==

Block Meta Toggle for WP is a lightweight utility that adds an **Inline Height Toggle** button to the main editor toolbar. It minimizes the footer meta box container (ACF, Rank Math, Yoast, and custom metaboxes) down to a clean 32px bar and lets you expand it into a full-height editing panel with a single click.

Unlike other solutions that physically detach or move DOM elements into modal portals—breaking event listeners and virtual DOM states—this plugin operates purely through native CSS and JavaScript height manipulation directly within the canvas flow.

= Key Features =

* **Zero DOM Relocation:** Keeps all meta fields in their native DOM location. Fully preserves ACF repeater fields, Select2 dropdowns, color pickers, and third-party JS listeners.
* **Core Save Compatible:** No hijacked submission handlers or broken auto-save states. Standard editor Update/Publish buttons handle all data seamlessly.
* **Inline Canvas Viewport:** Expands native meta boxes smoothly over the content area while maintaining full visibility of top toolbars, left admin menus, and right sidebars.
* **Auto-Expand Collapsed Panels:** Automatically uncollapses hidden or aria-collapsed field liners when maximized.
* **Lightweight & Clean:** Single-file architecture with zero database clutter or unnecessary settings pages.

== Installation ==

1. Upload the `block-meta-toggle-wp` folder to your `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in the admin dashboard.
3. Alternatively, place `block-meta-toggle-wp.php` in your `/wp-content/mu-plugins/` folder for automatic activation.

== Frequently Asked Questions ==

= Does this work with Advanced Custom Fields (ACF)? =
Yes. It was specifically built to handle ACF fields smoothly without breaking repeater fields, color pickers, or field dependencies.

= Does it alter how post data is saved? =
No. It only controls CSS layout and visibility. Data is saved natively when you click the standard editor Update or Publish button.

= Does it work with ALL meta boxes? =
Yes.  Any meta boxes that show up in the meta box area below the content, still work without changes as designed.

== Screenshots ==

1. The toggle button injected cleanly into the Block Editor top toolbar.
2. Expanded full-height viewport displaying all custom meta fields.

== Changelog ==

= 1.0.0 =
* Initial public release.

== Upgrade Notice ==

= 1.0.0 =
Initial release of Block Meta Toggle for WP.
