import '@scss/main.scss';

import { initHeaderMenu } from '@js/menu/header-menu.js';
import { initSmartHeader } from '@js/header/header-controller.js';
import { initSearch } from '@js/search/search.js';
import { initImageModal } from '@js/modal/image-modal.js';

document.addEventListener('DOMContentLoaded', () => {
    initHeaderMenu();
    initSmartHeader();
    initSearch();
    initImageModal();
});
