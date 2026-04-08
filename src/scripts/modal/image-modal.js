export function initImageModal() {
    const modalPicture = document.querySelectorAll('.picture--img, .small-picture--img, .wide-picture--img');
    const modalMap = document.querySelectorAll('.map--img');
    const modalImageContainer = document.querySelector('.modal');
    const modalButton = document.querySelector('.modal__button');
    const modalOverlay = document.querySelector('.modal__overlay');
    const modalViewer = document.querySelector('.modal__viewer');

    let isMapActive = false;
    let isMapReady = false;
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let fitScale = 1;
    
    if (!modalImageContainer || !modalButton || !modalOverlay || !modalViewer) return;

    const modalImg = modalImageContainer.querySelector('.modal__img');

    if (!modalImg) return;

    const openImageModal = () => {
        modalImageContainer.classList.add('is-open');
        document.body.classList.add('modal-open');
    }

    const resetModalState = () => {
        modalImg.classList.remove('is-map');
        modalViewer.classList.remove('has-map');
        isMapActive = false;
        isMapReady = false;
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
    }

    modalPicture.forEach((el) => el.addEventListener('click', (e) => {
        const clickedImg = e.currentTarget instanceof HTMLImageElement ? e.currentTarget : null;
        if (!clickedImg) return;

        resetModalState();
        
        modalImg.src = clickedImg.currentSrc || clickedImg.src;
        modalImg.alt = clickedImg.alt;

        openImageModal();
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

    }, { passive: false })
        
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
    })

    modalButton.addEventListener('click', () => closeImageModal());
    modalOverlay.addEventListener('click', () => closeImageModal());
}
