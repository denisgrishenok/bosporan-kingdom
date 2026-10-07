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
                
                return html.replace(/<!-- include:(.+?) -->/g, (match, file) => {
                    const filePath = path.resolve(__dirname, file.trim());

                    if (!fs.existsSync(filePath)) throw new Error(`HTML include not found: ${filePath}`);
                    return fs.readFileSync(filePath, 'utf8'); 
            });
        }
    }}]
        

})