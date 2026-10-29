/**
 * Block Meta Toggle for WP - Production JavaScript Engine
 */
(function() {
    'use strict';

    function setupMetaHeightToggle() {
        var topToolbar = document.querySelector('.edit-post-header__settings') || 
                         document.querySelector('.interface-pinned-items');

        // Prevent duplicate insertion
        if (!topToolbar || document.getElementById('block-meta-toggle-btn')) {
            return;
        }

        // Mount container for React component
        var mountPoint = document.createElement('div');
        mountPoint.className = 'block-meta-toggle-wrapper';
        topToolbar.insertBefore(mountPoint, topToolbar.firstChild);

        var el = window.wp.element.createElement;
        var Tooltip = window.wp.components.Tooltip;

        // Retrieve localized text or fallback gracefully
        var buttonLabel = (window.blockMetaToggleL10n && window.blockMetaToggleL10n.toggleMeta) 
            ? window.blockMetaToggleL10n.toggleMeta 
            : 'Toggle Meta';

        // Render Native WordPress Tooltip & Button
        window.wp.element.render(
            el(
                Tooltip,
                { text: buttonLabel },
                el(
                    'button',
                    {
                        type: 'button',
                        id: 'block-meta-toggle-btn',
                        'aria-label': buttonLabel,
                        onClick: function(e) {
                            e.preventDefault();
                            var poststuff = document.getElementById('poststuff');
                            var mainWrapper = document.querySelector('.edit-post-meta-boxes-main');
                            var targetWrapper = mainWrapper || (poststuff ? poststuff.closest('.edit-post-meta-boxes-main') || poststuff : null);

                            if (!targetWrapper) {
                                return;
                            }

                            var isExpanded = targetWrapper.classList.toggle('block-meta-expanded-view');
                            document.body.classList.toggle('block-meta-panel-expanded', isExpanded);

                            if (isExpanded) {
                                // Auto-uncollapse hidden inner containers when expanding
                                var collapsedLiners = targetWrapper.querySelectorAll('.edit-post-layout__metaboxes[hidden], [aria-expanded="false"]');
                                collapsedLiners.forEach(function(item) {
                                    item.removeAttribute('hidden');
                                    if (item.getAttribute('aria-expanded') === 'false') {
                                        item.setAttribute('aria-expanded', 'true');
                                    }
                                });

                                targetWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            } else {
                                // Minimize behavior: Scroll back up to main editor canvas
                                var editorCanvas = document.querySelector('.edit-post-visual-editor') || document.querySelector('.block-editor-writing-flow');
                                if (editorCanvas) {
                                    editorCanvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }
                        }
                    },
                    // Double Vertical Arrows SVG
                    el('svg', {
                        width: 20,
                        height: 20,
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        strokeWidth: 2,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round'
                    },
                        el('polyline', { points: '7 13 12 18 17 13' }),
                        el('polyline', { points: '7 11 12 6 17 11' })
                    )
                )
            ),
            mountPoint
        );
    }

    // Polling initializer with timeout guard
    var attempts = 0;
    var maxAttempts = 20;
    var checkInterval = setInterval(function() {
        attempts++;
        var topToolbar = document.querySelector('.edit-post-header__settings') || 
                         document.querySelector('.interface-pinned-items');

        if (topToolbar) {
            setupMetaHeightToggle();
            clearInterval(checkInterval);
        } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
        }
    }, 500);
})();
