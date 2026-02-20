export function initSmartHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = window.scrollY;
    let lastDirection = null;
    let accumulatedScroll = 0;
    let isAnchorScrolling = false;


    const TOP_OFFSET = 30;
    const TOP_HOVER_ZONE = 30;
    const HIDE_THRESHOLD = 1000;
    const SHOW_THRESHOLD = 1500; 
    
    function showHeader() {
        header.classList.remove('is-hidden');
    }

    function hideHeader() {
        header.classList.add('is-hidden');
    }

    function handleScroll() {
        if (isAnchorScrolling) return;

        const isHidden = header.classList.contains('is-hidden');
        const currentScroll = window.scrollY;

        if (document.body.classList.contains('menu-open')) {
                
            showHeader();
            lastScroll = currentScroll;
            return;
        }
        
        if (currentScroll <= TOP_OFFSET) {
            showHeader();
            lastScroll = currentScroll;
            return;
        }        

        const deltaY = currentScroll - lastScroll;       
        
        if (deltaY === 0) {
            lastScroll = currentScroll;
            return;
        }

        const direction = deltaY > 0 ? 'down' : 'up';

        if (direction !== lastDirection) {
            accumulatedScroll = 0;
            lastDirection = direction;
        }
        
        if (direction === 'down' && !isHidden) {
            accumulatedScroll += Math.abs(deltaY); 
        }

         if (direction === 'up' && isHidden) {
            accumulatedScroll += Math.abs(deltaY); 
        }

        if (direction === 'down' && accumulatedScroll >= HIDE_THRESHOLD) {
            if (!isHidden) {
            hideHeader();
            accumulatedScroll = 0;
            }
        }

        if (direction === 'up' && accumulatedScroll >= SHOW_THRESHOLD) {
            if (isHidden && currentScroll > TOP_OFFSET) {
                showHeader();
                accumulatedScroll = 0; 
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
