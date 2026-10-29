# Block Meta Toggle for WordPress (`block-meta-toggle-wp`)

A lightweight, highly durable WordPress utility that adds an **Inline Height Toggle** to the Block Editor (Gutenberg) toolbar. It minimizes the footer meta box container (ACF, Rank Math, Yoast, custom metaboxes) to a clean 32px bar and lets you maximize it into a full-height editing viewport with a single click.

Unlike other solutions that physically detach or move DOM elements into React modal portals—breaking event listeners and virtual DOM states—**Gutenberg Meta Toggle** operates purely through native CSS/JS height manipulation directly within the WordPress canvas flow.

---

## Key Features

* **Zero DOM Relocation:** Keeps `#poststuff` and all meta fields in their native DOM location. Fully preserves ACF repeater fields, Select2 dropdowns, color pickers, and third-party JS listeners.
* **100% Core Save Compatible:** No hijacked submission handlers or broken auto-save states. Standard WordPress Update/Publish buttons handle all data seamlessly.
* **Inline Canvas Viewport:** Expands native meta boxes smoothly over the content editor while maintaining full visibility of top toolbars, left admin menus, and right sidebars.
* **Auto-Expand Collapsed Panels:** Automatically uncollapses hidden or aria-collapsed field liners when maximized.
* **Lightweight & Clean:** Single-file architecture with zero database settings or admin clutter.

---

## Installation

### As a Standard Plugin
1. Download or clone this repository.
2. Zip the folder or upload `gutenberg-meta-toggle.php` to your site's `/wp-content/plugins/` directory.
3. Activate **Gutenberg Meta Toggle** via **Plugins > Installed Plugins** in the WordPress admin.

### As an MU-Plugin (Recommended for Agencies)
Drop `gutenberg-meta-toggle.php` directly into `/wp-content/mu-plugins/`. It will activate automatically across all post types in the Block Editor without cluttering the main plugins list.

---

## How It Works

1. On Block Editor load, the plugin injects a **Gear Icon** (`#acf-meta-toggle-btn`) into the top Gutenberg header settings bar.
2. By default, the native `.edit-post-meta-boxes-main` container is locked to a clean 32px minimized bar at the bottom of the screen.
3. Clicking **Toggle Meta** expands the container to fill the visible editor height (`calc(100vh - 120px)`) and smoothly scrolls it into view.
4. Clicking **Toggle Meta** again minimizes the panel back to 32px and returns scroll focus smoothly to the main content canvas.

---

## Requirements

* **WordPress:** 5.8+ (Block Editor / Gutenberg)
* **PHP:** 7.4 or 8.x
* Compatible with Advanced Custom Fields (ACF), Rank Math, Yoast, and custom `add_meta_box()` calls.

---

## License

GPL-2.0-or-later — Free for personal and commercial use.
