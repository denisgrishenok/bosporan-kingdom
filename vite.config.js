import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: '.',
    
    server: {
        open: true,
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