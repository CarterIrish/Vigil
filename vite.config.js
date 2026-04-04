import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'hosted',
        rollupOptions: {
            input: {
                app: resolve(__dirname, 'client/app.tsx'),
                login: resolve(__dirname, 'client/login.tsx'),
            },
            output: {
                entryFileNames: '[name]Bundle.js',
            },
        },
    },
});
