import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

process.env.BROWSER = 'chrome';

function fillTemplate(template, data, source) {
    return template.replace(/\{\{(\w+)\}\}/g, (placeholder, key) => {
        if (data[key] === undefined) {
            throw new Error(`Field "${key}" missing in "${source}"`);
        }
        return data[key];
    });
}

function renderPhoto(image, template) {
    return fillTemplate(template, image, `image ${image.src}`);
}

function renderParagraph(lines) {
    return `<p>${lines.join('<br>')}</p>`; 
}

export default defineConfig({
    root: '.',
    
    server: {
        open: true,
        host: '127.0.0.1'
    },

    build: {
        outDir: 'dist',
        emptyOutDir: true,
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                privacy: path.resolve(__dirname, 'privacy.html'),
            }
        
        }
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@js': path.resolve(__dirname, 'src/scripts'),
            '@scss': path.resolve(__dirname, 'src/styles'),
            '@assets': path.resolve(__dirname, 'src/assets'),
        },
    },

    plugins: [{ 
        name: 'html-includes', 
        transformIndexHtml: {
            order: 'pre',
            handler(html) {
                
                const htmlReplace = html.replace(/<!-- include:(.+?) -->/g, (match, file) => {
                    const filePath = path.resolve(__dirname, file.trim());
                    
                    if (!fs.existsSync(filePath)) throw new Error(`HTML include not found: ${filePath}`);
                    return fs.readFileSync(filePath, 'utf8'); 
                });

                const mediaPath = path.resolve(__dirname, 'src/content/media.json');
                const media = JSON.parse(fs.readFileSync(mediaPath, 'utf8'));
                const photoTemplatePath = path.resolve(__dirname, 'src/templates/photo.html');
                const photoTemplate = fs.readFileSync(photoTemplatePath, 'utf8');
                const cardTemplatePath = path.resolve(__dirname, 'src/templates/card.html');
                const cardTemplate = fs.readFileSync(cardTemplatePath, 'utf8');

                return htmlReplace.replace(/<!-- card:(.+?) -->/g, (match, id) => {
                    
                    const card = media[id.trim()];

                    if (!card) throw new Error(`Media not found: "${id}"`);

                    let imagesHTML = card.images.map((image) => renderPhoto(image, photoTemplate)).join('');
                    if (card.images.length > 1) {
                        imagesHTML = `<div class="double-picture--container">${imagesHTML}</div>`;
                    }
                    
                    const captionHTML = renderParagraph(card.caption);
                    const textHTML = card.text.map((paragraph) => renderParagraph(paragraph)).join('');
                    
                    const cardParts = {
                        images: imagesHTML,
                        caption: captionHTML,
                        text: textHTML 
                    };
                    
                    return fillTemplate(cardTemplate, cardParts, `card ${id.trim()}`);
                    
                });
            }
        }
    }]
        

})