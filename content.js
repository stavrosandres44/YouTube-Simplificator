(function () {
    'use strict';

    const selectors = [
        'button.ytp-button[data-tooltip-target-id="ytp-autonav-toggle-button"]',
        '.ytp-miniplayer-button',
        '.ytp-next-button.ytp-button',
        '.ytp-prev-button.ytp-button',
        '.ytp-remote-button.ytp-button',
        '.ytp-subtitles-button.ytp-button',
        '.yt-spec-touch-feedback-shape',
        '.yt-spec-touch-feedback-shape--touch-response',
        '.style-scope.ytd-masthead #guide-button',
        '.style-scope.ytd-masthead #guide-button yt-icon',
        '.ytp-fullerscreen-edu-chevron',
        '.ytp-fullerscreen-edu-button',
        '.ytp-fullerscreen-edu-button-subtle',
        '.style-scope.ytd-structured-description-content-renderer',
        '.yt-spec-button-view-model.style-scope.ytd-menu-renderer',
        'ytd-expandable-metadata-renderer.style-scope.ytd-watch-flexy',
        'yt-button-shape > button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading.yt-spec-button-shape-next--enable-backdrop-filter-experiment',
        'yt-button-shape > button.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-only-default.yt-spec-button-shape-next--enable-backdrop-filter-experiment',
        'iron-selector#chips.style-scope.yt-chip-cloud-renderer',
        'div#dismissible.style-scope.ytd-rich-shelf-renderer',
        'ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer',
        'ytd-inline-survey-renderer',
        'div#dismissible.style-scope.ytd-inline-survey-renderer'
    ];

    const iconPaths = [
        'M21 4H3a2 2',
        'M12 1C5.925 1 1 5.925'
    ];

    function removeElements(root = document) {
        selectors.forEach(sel => root.querySelectorAll(sel).forEach(el => el.remove()));

        root.querySelectorAll('a.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer[href="/feed/downloads"]').forEach(el => {
            const parent = el.closest('ytd-mini-guide-entry-renderer, a');
            if (parent) parent.remove(); else el.remove();
        });

        root.querySelectorAll('tp-yt-paper-item.style-scope.ytd-compact-link-renderer').forEach(item => {
            const svgPath = item.querySelector('svg path');
            if (svgPath && iconPaths.some(start => svgPath.getAttribute('d')?.startsWith(start))) {
                item.remove();
            }
        });

        root.querySelectorAll('#description .style-scope.yt-img-shadow').forEach(el => el.remove());
        ['#description #title', '#description #subtitle'].forEach(sel => {
            const el = root.querySelector(sel);
            if (el) el.remove();
        });
        root.querySelectorAll('#description .yt-spec-button-shape-next.yt-spec-button-shape-next--outline.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading')
            .forEach(el => el.remove());
        root.querySelectorAll('.yt-core-attributed-string__link.yt-core-attributed-string__link--call-to-action-color.yt-core-attributed-string__link--link-inherit-color')
            .forEach(el => el.remove());
    }

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1) removeElements(node);
            }
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    setInterval(removeElements, 20);
    removeElements(document);

    const pageScript = document.createElement('script');
    pageScript.textContent = `
        window.showYouTubeSimplificatorDialog = function() {
            if (document.getElementById('yt-simplificator-dialog')) return;

            const backdrop = document.createElement('tp-yt-iron-overlay-backdrop');
            backdrop.style.cssText = \`
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.6);
                z-index: 999998;
                animation: fadeIn 0.2s ease-out;
            \`;

            const dialog = document.createElement('tp-yt-paper-dialog');
            dialog.id = 'yt-simplificator-dialog';
            dialog.className = 'style-scope tp-yt-paper-dialog';
            dialog.setAttribute('role', 'dialog');
            dialog.style.cssText = \`
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #202020;
                color: #fff;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.6);
                z-index: 999999;
                padding: 22px 30px;
                font-family: Roboto, Arial, sans-serif;
                text-align: center;
                max-width: 400px;
                animation: fadeIn 0.25s ease-out;
            \`;
            dialog.innerHTML = \`
                <h2 style="margin: 0 0 10px; font-size: 20px; color: #fff;">
                    Thanks for using <span style="color:#3ea6ff;">YouTube Simplificator!</span>
                </h2>
                <p style="margin: 8px 0 16px; color:#ccc; font-size:14px; line-height:1.4;">
                    Your YouTube interface has been simplified.<br>
                    Email <b>stavrosandres4@gmail.com</b> for feedback.
                </p>
                <button id="ys-close" style="
                    background:#3ea6ff;
                    border:none;
                    color:#fff;
                    padding:8px 16px;
                    border-radius:6px;
                    cursor:pointer;
                    font-size:14px;
                ">OK</button>
            \`;

            dialog.querySelector('#ys-close').onclick = () => {
                backdrop.remove();
                dialog.remove();
            };

            document.body.append(backdrop, dialog);
        };

        console.log('%cYouTube Simplificator loaded!', 'color:#3ea6ff; font-weight:bold');
        console.log('%cType %cshowYouTubeSimplificatorDialog()%c in the console to reopen the welcome dialog.',
            'color:#aaa', 'color:#3ea6ff', 'color:#aaa');

        if (!localStorage.getItem('ytSimplificatorWelcomed')) {
            localStorage.setItem('ytSimplificatorWelcomed', 'true');
            window.showYouTubeSimplificatorDialog();
        }
    `;
})();
