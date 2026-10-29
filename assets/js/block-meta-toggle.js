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

        // Create Toolbar Button
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'block-meta-toggle-btn';
        btn.setAttribute('aria-label', 'Toggle Meta');
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';
        
        topToolbar.insertBefore(btn, topToolbar.firstChild);

        btn.addEventListener('click', function(e) {
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
                collapsedLiners.forEach(function(el) {
                    el.removeAttribute('hidden');
                    if (el.getAttribute('aria-expanded') === 'false') {
                        el.setAttribute('aria-expanded', 'true');
                    }
                });

                targetWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Minimize behavior: Scroll back up to the main editor canvas
                var editorCanvas = document.querySelector('.edit-post-visual-editor') || document.querySelector('.block-editor-writing-flow');
                if (editorCanvas) {
                    editorCanvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }

    // Polling initializer with timeout guard
    var attempts = 0;
    var maxAttempts = 20; // 10-second max wait window
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
