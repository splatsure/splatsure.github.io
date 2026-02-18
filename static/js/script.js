class BeforeAfter {
    constructor(entryObject) {
        const component = document.querySelector(entryObject.id);
        const beforeWrapper = component.querySelector('.bal-before');
        const beforeInset = component.querySelector('.bal-before-inset');
        const handle = component.querySelector('.bal-handle');

        // Use ResizeObserver to automatically sync the inset width
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                if (beforeInset) {
                    beforeInset.style.width = width + 'px';
                }
            }
        });
        resizeObserver.observe(component);

        // State
        this.currentPos = 0.5; // 0.0 to 1.0

        // Initial setup
        beforeWrapper.style.width = "50%";
        handle.style.left = "50%";

        const updateSlider = (x) => {
            const rect = component.getBoundingClientRect();
            const width = rect.width;
            // Calculate percentage (0 to 100)
            let percentage = ((x - rect.left) / width) * 100;

            // Clamp value
            percentage = Math.max(0, Math.min(100, percentage));

            // Update State
            this.currentPos = percentage / 100;

            // Update DOM
            beforeWrapper.style.width = percentage + "%";
            handle.style.left = percentage + "%";
        };

        let isDragging = false;

        // Touch events
        component.addEventListener('touchstart', (e) => {
            const rect = component.getBoundingClientRect();
            const touchX = e.touches[0].clientX;
            const currentPixelPos = rect.left + (rect.width * this.currentPos);

            // Interaction zone: +/- 40px from the handle line
            if (Math.abs(touchX - currentPixelPos) < 40) {
                isDragging = true;
                // We don't preventDefault here so 'click' can still fire if needed
            } else {
                isDragging = false;
            }
        }, { passive: true });

        component.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            // Prevent default to stop scrolling/carousel swipe while dragging slider
            if (e.cancelable) e.preventDefault();

            let touch = e.touches[0] || e.changedTouches[0];
            updateSlider(touch.clientX);
        }, { passive: false });

        component.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Mouse events (Desktop)
        component.addEventListener('mousemove', (e) => {
            updateSlider(e.clientX);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const copyBtn = document.getElementById('copy-btn');
    const bibtexContent = document.getElementById('bibtex-content');

    if (copyBtn && bibtexContent) {
        copyBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const text = bibtexContent.textContent;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () {
                    showNotification();
                }).catch(function (err) {
                    fallbackCopy(text);
                });
            } else {
                fallbackCopy(text);
            }
        });
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            showNotification();
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        document.body.removeChild(textarea);
    }

    let copyTimeout;

    function showNotification() {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';

        if (copyTimeout) clearTimeout(copyTimeout);

        copyTimeout = setTimeout(function () {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="fa fa-copy"></i>';
        }, 2000);
    }
});