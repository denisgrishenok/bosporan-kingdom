export function initImageModal() {
    const modalPicture = document.querySelectorAll('.picture--img, .small-picture--img, .wide-picture--img');
    const modalPictureOpen = document.querySelectorAll('.picture--open'); 
    const modalMap = document.querySelectorAll('.map--img');
    const modalImageContainer = document.querySelector('.modal');
    const modalButton = document.querySelector('.modal__button:not(.zoom)');
    const modalButtonMinus = document.querySelector('.modal__button.zoom[aria-label="Уменьшить масштаб"]'); 
    const modalButtonPlus = document.querySelector('.modal__button.zoom[aria-label="Увеличить масштаб"]');
    const modalOverlay = document.querySelector('.modal__overlay');
    const modalViewer = document.querySelector('.modal__viewer');
    const modalWindow = document.querySelector('.modal__window');

    let currentActiveElement = null;
    let isMapActive = false;
    let isMapReady = false;
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let fitScale = 1;
    let isGrabbing = false;
    let lastClientX = 0;
    let lastClientY = 0;
    let activePointers = new Map();
    let lastPinchDistance = 0;
    
    if (!modalImageContainer || !modalButton || !modalButtonMinus || !modalButtonPlus || !modalOverlay || !modalViewer || !modalWindow) return;

    const modalImg = modalImageContainer.querySelector('.modal__img');

    if (!modalImg) return;

    const openImageModal = () => {
        currentActiveElement = document.activeElement;

        modalImageContainer.classList.add('is-open');
        document.body.classList.add('modal-open');
        modalWindow.focus({ preventScroll: true });
    }

    const resetModalState = () => {
        modalImg.classList.remove('is-map');
        modalViewer.classList.remove('has-map');
        isMapActive = false;
        isMapReady = false;
        isGrabbing = false;
        activePointers.clear();
        lastPinchDistance = 0;
        scale = 1;
        translateX = 0;
        translateY = 0;
        fitScale = 1;
        modalImg.style.transform = '';
        modalImg.onload = null;
        modalImg.onerror = null;
        modalImg.removeAttribute('src');
        modalImg.alt = '';
        modalImg.style.width = '';
        modalImg.style.height = '';
    }

    const closeImageModal = () => {
        
        resetModalState();
       
        modalImageContainer.classList.remove('is-open');
        document.body.classList.remove('modal-open');  
        
        if(currentActiveElement) currentActiveElement.focus({ preventScroll: true });
        currentActiveElement = null;
    }

    const openImage = (innerImg) => {
        innerImg = innerImg instanceof HTMLImageElement ? innerImg : null;
        if(!innerImg) return;

        resetModalState();

        modalImg.src = innerImg.currentSrc || innerImg.src;
        modalImg.alt = innerImg.alt;

        openImageModal();
    }

    modalPicture.forEach((el) => el.addEventListener('click', (e) => {
        const clickedImg = e.currentTarget;

        if (clickedImg.closest('.picture--open')) return;
        
        openImage(clickedImg);
        
    }))

    modalPictureOpen.forEach((el) => el.addEventListener('click', (e) => {
        const clickedImg = e.currentTarget.querySelector('img');
        
        openImage(clickedImg);
    }))

    const getMetrics = () => {
        const rect = modalViewer.getBoundingClientRect();
        const viewerW = rect.width;
        const viewerH = rect.height;
        const naturalW = modalImg.naturalWidth;
        const naturalH = modalImg.naturalHeight;
        
        return {rect, viewerW, viewerH, naturalW, naturalH};
    }

    const modalImgStyle = () => {
        const m = getMetrics();
        modalImg.style.width = m.naturalW + 'px';
        modalImg.style.height = m.naturalH + 'px';
    }

    const applyTransform = () => {
            modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    const fitMapToViewer = () => {
        const m = getMetrics();

        if (m.naturalW <= 0 || m.naturalH <= 0) return;
        
        fitScale = Math.min(m.viewerW / m.naturalW, m.viewerH / m.naturalH, 1);
        scale = fitScale;
        translateX = (m.viewerW - m.naturalW * fitScale) / 2;
        translateY = (m.viewerH - m.naturalH * fitScale) / 2;

    }

    const clampScale = (v, min, max) => Math.min(max, Math.max(min, v));

    const clampTranslate = () => {
        const m = getMetrics();
        const scaledW = m.naturalW * scale;
        const scaledH = m.naturalH * scale;

        if (scaledW <= m.viewerW) {
            translateX = (m.viewerW - scaledW) / 2;
        } else {
            translateX = clampScale(translateX, m.viewerW - scaledW, 0);
        }

        if (scaledH <= m.viewerH) {
            translateY = (m.viewerH - scaledH) / 2;
        } else {
            translateY = clampScale(translateY, m.viewerH - scaledH, 0);
        }
    }

    const zoomAt = (viewerX, viewerY, newScale) => {       
        if (!isMapActive || !isMapReady) return;
        if (modalImg.naturalWidth <= 0 || modalImg.naturalHeight <= 0) return;
        if (!Number.isFinite(scale) || scale <= 0) return;
        if (!Number.isFinite(newScale) || newScale <= 0) return;

        const imgX = (viewerX - translateX) / scale;
        const imgY = (viewerY - translateY) / scale;

        scale = newScale;
        translateX = viewerX - imgX * scale;
        translateY = viewerY - imgY * scale;

        clampTranslate();
        applyTransform();
    }

    const zoomAtButtons = (zoomFactor) => {
        if (!isMapActive || !isMapReady) return;

        const m = getMetrics();
        const newScale = clampScale(scale * zoomFactor, fitScale, fitScale * 6);
        
        if (newScale === scale) return;

        zoomAt(m.viewerW / 2, m.viewerH / 2, newScale);

    }

    modalMap.forEach((el) => el.addEventListener('click', (e) => {
        const clickedMap = e.currentTarget instanceof HTMLImageElement ? e.currentTarget : null;
        if (!clickedMap) return;

        modalImg.style.transform = '';

        let imgSrc = clickedMap.dataset.full || clickedMap.currentSrc || clickedMap.src;
        let expectedHref = new URL(imgSrc, document.baseURI).href;
        isMapReady = false;

        const modalTransformValue = () => {           

            fitMapToViewer();
            applyTransform();
        }
        
        modalImg.onload = () => {
            if (expectedHref !== modalImg.src) return;
            
            isMapReady = true;
            modalImgStyle();  
            modalTransformValue();          
        }
        
        modalImg.onerror = () => {
            if (expectedHref !== modalImg.src) return;
            
            closeImageModal();
        }

        modalImg.src = imgSrc;
        if (modalImg.complete === true && modalImg.naturalWidth > 0) {
            
            isMapReady = true;
            modalImgStyle();
            modalTransformValue();
            
        } 
        modalImg.alt = clickedMap.alt;
        modalImg.classList.add('is-map');
        modalViewer.classList.add('has-map');
        isMapActive = true;   

        openImageModal();      
        
    }))

    modalViewer.addEventListener('wheel', (e) => {
        if (!isMapActive || !isMapReady) return;
        e.preventDefault();
        const m = getMetrics();
        

        const cursorX = e.clientX - m.rect.left;
        const cursorY = e.clientY - m.rect.top;
        
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const minScale = fitScale;
        const maxScale = fitScale * 6;
        const newScale = clampScale(scale * zoomFactor, minScale, maxScale);
       
        if (newScale === scale) return;

        zoomAt(cursorX, cursorY, newScale);

    }, { passive: false });

    modalViewer.addEventListener('pointerdown', (e) => {
        if (!isMapActive || !isMapReady) return;
        if (e.button !== 0) return;
        e.preventDefault();

        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (activePointers.size === 2) {
            isGrabbing = false;
            const points = [...activePointers.values()];
            lastPinchDistance = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
        } else {        
        
            lastClientX = e.clientX;
            lastClientY = e.clientY;
            isGrabbing = true;
        }
        
        modalViewer.setPointerCapture(e.pointerId);

    }, { passive: false });

    modalViewer.addEventListener('pointermove', (e) => {
        if (!isMapActive || !isMapReady) return;
        e.preventDefault();

        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (activePointers.size === 2) {
            const points = [...activePointers.values()];
            const distance = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
            if (lastPinchDistance === 0 || !Number.isFinite(distance)) {
                lastPinchDistance = distance;
                return;
            }

            const m = getMetrics();
            const cursorX = (points[0].x + points[1].x) /2 - m.rect.left;
            const cursorY = (points[0].y + points[1].y) /2 - m.rect.top;
            const newScale = clampScale(scale * (distance / lastPinchDistance), fitScale, fitScale * 6);

            zoomAt(cursorX, cursorY, newScale);

            lastPinchDistance = distance;

        } else if (isGrabbing) {
            const moveX = e.clientX - lastClientX;
            const moveY = e.clientY - lastClientY;
            translateX = translateX + moveX;
            translateY = translateY + moveY;

            clampTranslate();
            applyTransform();

            lastClientX = e.clientX;
            lastClientY = e.clientY;
        }   

    }, { passive: false });

    const endGrabbing = (e) => {
        if (!isMapActive || !isMapReady) return;
        e.preventDefault();

        activePointers.delete(e.pointerId);
        modalViewer.releasePointerCapture(e.pointerId);
        
        if (activePointers.size === 0) {
            isGrabbing = false;
        } else if (activePointers.size === 1) {
            const points = [...activePointers.values()];
            lastClientX = points[0].x;
            lastClientY = points[0].y;
            isGrabbing = true;
        }
        
    }

    modalViewer.addEventListener('pointerup', endGrabbing, { passive: false });

    modalViewer.addEventListener('pointercancel', endGrabbing, { passive: false });
    
    const refitMapView = () => {
        if (!isMapActive || !isMapReady) return;
        if (modalImg.naturalWidth <= 0 || modalImg.naturalHeight <= 0) return;

        fitMapToViewer();
        applyTransform();
    }

    let resizeDebounceId = null;

    const refitMapViewDebounced = () => {
        if (resizeDebounceId !== null) clearTimeout(resizeDebounceId);

        resizeDebounceId = setTimeout(() => {
            resizeDebounceId = null;
            refitMapView();
        }, 100)
    }

    window.addEventListener('resize', refitMapViewDebounced);
    window.addEventListener('orientationchange', () => {
        requestAnimationFrame(refitMapViewDebounced);
    })

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', refitMapViewDebounced);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalImageContainer.classList.contains('is-open')) {
            closeImageModal();
        }

        if (e.key === 'Tab' && modalImageContainer.classList.contains('is-open')) {
            let buttons = new Array(modalButtonMinus, modalButtonPlus, modalButton);
            buttons = buttons.filter((i) => getComputedStyle(i).display !== 'none');

            if(buttons.length === 0) {
                e.preventDefault();
                return;
            } 
            
            let first = buttons[0];
            let last = buttons[buttons.length -1];
            let current = document.activeElement;

            if (!e.shiftKey && current === last) {
                e.preventDefault();
                first.focus({ preventScroll: true });
            }
            
            if (e.shiftKey && (current === first || current === modalWindow)) {
                e.preventDefault();
                last.focus({ preventScroll: true });
            }
        }
    })

    modalButton.addEventListener('click', () => closeImageModal());
    modalButtonMinus.addEventListener('click', () => zoomAtButtons(0.9));
    modalButtonPlus.addEventListener('click', () => zoomAtButtons(1.1));
    modalOverlay.addEventListener('click', () => closeImageModal());
}
