import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import cesium from 'vite-plugin-cesium'

export default defineConfig({
    plugins: [
        vue(),
        cesium(),
    ],
    resolve: {
        alias: [
            {
                find: '~',
                replacement: resolve(process.cwd(), '.'),
            },
        ],
    },
});