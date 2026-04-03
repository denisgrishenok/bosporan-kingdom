export function initImageModal() {
    const modalPicture = document.querySelectorAll('.picture--img, .small-picture--img, .wide-picture--img');
    const modalMap = document.querySelectorAll('.map--img');
    const modalImageContainer = document.querySelector('.modal');
    const modalButton = document.querySelector('.modal__button');
    const modalOverlay = document.querySelector('.modal__overlay');
    const modalViewer = document.querySelector('.modal__viewer');
    
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
    }

    modalPicture.forEach((el) => el.addEventListener('click', (e) => {
        const clickedImg = e.currentTarget instanceof HTMLImageElement ? e.currentTarget : null;
        if (!clickedImg) return;
        
        modalImg.src = clickedImg.currentSrc || clickedImg.src;
        modalImg.alt = clickedImg.alt;
        modalImg.classList.remove('is-map');
        modalViewer.classList.remove('has-map');

        openImageModal();
    }))

    modalMap.forEach((el) => el.addEventListener('click', (e) => {
        const clickedMap = e.currentTarget instanceof HTMLImageElement ? e.currentTarget : null;
        if (!clickedMap) return;

        modalImg.src = clickedMap.dataset.full || clickedMap.currentSrc || clickedMap.src;
        modalImg.alt = clickedMap.alt;
        modalImg.classList.add('is-map');
        modalViewer.classList.add('has-map');

        openImageModal();        
    }))

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalImageContainer.classList.contains('is-open')) {
            closeImageModal();
        }
    })

    modalButton.addEventListener('click', () => closeImageModal());
    modalOverlay.addEventListener('click', () => closeImageModal());
}
