export function initSmartHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = window.scrollY;
    let accumulatedDownScroll = 0;
    let accumulatedUpScroll = 0;
    let hideTimeout = null;
    let isAnchorScrolling = false;

    const HIDE_OFFSET = 600;
    const SHOW_OFFSET = 2000;
    const TOP_OFFSET = 100;
    const TOP_HOVER_ZONE = 40;
    const HIDE_DELAY = 1000;

    function showHeader() {
        header.classList.remove('is-hidden');
    }

    function hideHeader() {
        header.classList.add('is-hidden');
    }

    function clearHideTimer() {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
    }

    function handleScroll() {
        if (isAnchorScrolling) return;

        const currentScroll = window.scrollY;
        const deltaY = currentScroll - lastScroll;
        const direction = deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : null;

        if (!direction) return;

        if (currentScroll <= TOP_OFFSET) {
            showHeader();
            accumulatedDownScroll = 0;
            accumulatedUpScroll = 0;
            clearHideTimer();
            lastScroll = currentScroll;
            return;
        }

        if (direction === 'down') {
            accumulatedDownScroll += deltaY;
            accumulatedUpScroll = 0;

            if (accumulatedDownScroll > HIDE_OFFSET) {
                if (!hideTimeout) {
                    hideTimeout = setTimeout(() => {
                        hideHeader();
                        hideTimeout = null;
                    }, HIDE_DELAY);
                }
            }
        }

        if (direction === 'up') {
            accumulatedUpScroll += Math.abs(deltaY);
            accumulatedDownScroll = 0;

            clearHideTimer();

            if (
                header.classList.contains('is-hidden') &&
                accumulatedUpScroll > SHOW_OFFSET
            ) {
                showHeader();
                accumulatedUpScroll = 0;
            }
        }

        lastScroll = currentScroll;
    }

    function handleMouseMove(e) {
        if (e.clientY <= TOP_HOVER_ZONE) {
            showHeader();
        }
    }

    function handleAnchorClick(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        showHeader();
        isAnchorScrolling = true;

        setTimeout(() => {
            isAnchorScrolling = false;
        }, 2000);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleAnchorClick);
}
