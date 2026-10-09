import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

process.env.BROWSER = 'chrome';

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

                return htmlReplace.replace(/<!-- photo:(.+?) -->/g, (match, id) => {
                    const mediaPath = path.resolve(__dirname, 'src/content/media.json');
                    const media = JSON.parse(fs.readFileSync(mediaPath, 'utf8'));
                    const record = media[id.trim()];

                    if (!record) throw new Error(`Media not found: "${id}"`);

                    const templatePath = path.resolve(__dirname, 'src/templates/photo.html');
                    const template = fs.readFileSync(templatePath, "utf8");

                    return template.replace(/\{\{(\w+)\}\}/g, (placeholder, key) => {
                        if (record[key] === undefined) {
                            throw new Error(`Field "${key}" missing in media "${id}"`);
                        } 
                        return record[key];
                    });
                });
            }
        }
    }]
        

})