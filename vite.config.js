import { defineConfig } from 'vite';
import path from 'path';

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

})