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

        // Render Native WordPress Tooltip & Button
        window.wp.element.render(
            el(
                Tooltip,
                { text: 'Toggle Meta' },
                el(
                    'button',
                    {
                        type: 'button',
                        id: 'block-meta-toggle-btn',
                        'aria-label': 'Toggle Meta',
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
                        el('circle', { cx: 12, cy: 12, r: 3 }),
                        el('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' })
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
