export function initImageModal() {
    const modalPicture = document.querySelectorAll('.picture--img, .small-picture--img, .wide-picture--img');
    const modalMap = document.querySelectorAll('.map--img');
    const modalImageContainer = document.querySelector('.modal');
    const modalButton = document.querySelector('.modal__button');
    const modalOverlay = document.querySelector('.modal__overlay');
    const modalViewer = document.querySelector('.modal__viewer');

    let isMapActive = false;
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

    const closeImageModal = () => {
        modalImageContainer.classList.remove('is-open');
        document.body.classList.remove('modal-open');
        modalImg.classList.remove('is-map');
        modalViewer.classList.remove('has-map');
        modalImg.removeAttribute('src');
        modalImg.alt = '';
        isMapActive = false;
        scale = 1;
        translateX = 0;
        translateY = 0;
        fitScale = 1;
        modalImg.style.transform = '';
        modalImg.onload = null;

    }

    modalPicture.forEach((el) => el.addEventListener('click', (e) => {
        const clickedImg = e.currentTarget instanceof HTMLImageElement ? e.currentTarget : null;
        if (!clickedImg) return;
        
        modalImg.src = clickedImg.currentSrc || clickedImg.src;
        modalImg.alt = clickedImg.alt;
        modalImg.classList.remove('is-map');
        modalViewer.classList.remove('has-map');
        isMapActive = false;
        modalImg.style.transform = '';

        openImageModal();
    }))

    modalMap.forEach((el) => el.addEventListener('click', (e) => {
        const clickedMap = e.currentTarget instanceof HTMLImageElement ? e.currentTarget : null;
        if (!clickedMap) return;

        let srcToLoad = clickedMap.dataset.full || clickedMap.currentSrc || clickedMap.src;
        let imgSrc = srcToLoad;

        const modalTransformValue = () => {
            const rect = modalViewer.getBoundingClientRect();
            const viewerW = rect.width;
            const viewerH = rect.height;
            const naturalW = modalImg.naturalWidth;
            const naturalH = modalImg.naturalHeight;
            
            if (naturalW <= 0 || naturalH <= 0) return;

            fitScale = Math.min(viewerW / naturalW, viewerH / naturalH, 1);
            scale = fitScale;
            translateX = (viewerW - naturalW * fitScale) / 2;
            translateY = (viewerH - naturalH * fitScale) / 2;

            modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`; 
        }
        
        modalImg.onload = () => {
            if (imgSrc !== modalImg.src) return;
            modalTransformValue();            
        } 

        modalImg.src = imgSrc;
        if (modalImg.complete === true && modalImg.naturalWidth > 0) modalTransformValue();
        modalImg.alt = clickedMap.alt;
        modalImg.classList.add('is-map');
        modalViewer.classList.add('has-map');
        isMapActive = true;

        openImageModal();      
        
    }))

    const clampScale = (v, min, max) => Math.min(max, Math.max(min, v));

    modalViewer.addEventListener('wheel', (e) => {
        if (!isMapActive || modalImg.naturalWidth <= 0) return;
        e.preventDefault();

        const rect = modalViewer.getBoundingClientRect();
        const viewerW = rect.width;
        const viewerH = rect.height;
        const naturalW = modalImg.naturalWidth;
        const naturalH = modalImg.naturalHeight;
            
        if (naturalW <= 0 || naturalH <= 0) return;

        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;
        const imgX = (cursorX - translateX) / scale;
        const imgY = (cursorY - translateY) / scale;
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const minScale = fitScale;
        const maxScale = fitScale * 6;
        const newScale = clampScale(scale * zoomFactor, minScale, maxScale);
       
        if (newScale === scale) return;

        let newTranslateX = cursorX - imgX * newScale;
        let newTranslateY = cursorY - imgY * newScale;

        const scaledW = naturalW * newScale;
        const scaledH = naturalH * newScale;

        if (scaledW <= viewerW) {
            newTranslateX = (viewerW - scaledW) / 2;
        } else {
            newTranslateX = clampScale(newTranslateX, viewerW - scaledW, 0);
        }

        if (scaledH <= viewerH) {
            newTranslateY = (viewerH - scaledH) / 2;
        } else {
            newTranslateY = clampScale(newTranslateY, viewerH - scaledH, 0);
        }

        scale = newScale;
        translateX = newTranslateX;
        translateY = newTranslateY;

        modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

    }, { passive: false })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalImageContainer.classList.contains('is-open')) {
            closeImageModal();
        }
    })

    modalButton.addEventListener('click', () => closeImageModal());
    modalOverlay.addEventListener('click', () => closeImageModal());
}
