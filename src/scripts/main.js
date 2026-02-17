import '@scss/main.scss';

import { initHeaderMenu } from '@js/menu/header-menu.js';
import { initSmartHeader } from '@js/header/header-controller.js';

document.addEventListener('DOMContentLoaded', () => {
    initHeaderMenu();
    initSmartHeader();
});
