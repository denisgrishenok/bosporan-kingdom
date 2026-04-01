export function initImageModal() {
    const pictureModal = document.querySelectorAll('.picture--img, .small-picture--img, .wide-picture--img, .map--img');
    const modalImageContainer = document.querySelector('.modal');
    const buttonModal = document.querySelector('.modal__button');
    const overlayModal = document.querySelector('.modal__overlay');
    const modalViewer = document.querySelector('.modal__viewer');

    if (!modalImageContainer || !buttonModal || !overlayModal || !modalViewer) return;

    const openImageModal = () => {
        modalImageContainer.classList.add('is-open');
        document.body.classList.add('modal-open');
    };

    const closeImageModal = () => {
        modalImageContainer.classList.remove('is-open');
        document.body.classList.remove('modal-open');
        modalViewer.innerHTML = '';
    };

    pictureModal.forEach((el) => el.addEventListener('click', (e) => {
        const clickedImg = e.currentTarget instanceof HTMLImageElement ? e.currentTarget : null;
        if (!clickedImg) return;

        const img = document.createElement('img');
        img.className = 'modal__img';
        img.src = clickedImg.dataset.full || clickedImg.currentSrc || clickedImg.src;
        img.alt = clickedImg.alt;

        modalViewer.innerHTML = '';
        modalViewer.append(img);
        openImageModal();
    }));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalImageContainer.classList.contains('is-open')) {
            closeImageModal();
        }
    });

    buttonModal.addEventListener('click', () => closeImageModal());
    overlayModal.addEventListener('click', () => closeImageModal());
}
