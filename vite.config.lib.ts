import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        vue(),
        libInjectCss(),
        dts({
            entryRoot: './src/packages',
            root: './',
            outDir: './dist/types',
            declarationOnly: false,
            cleanVueFileName: true,
            compilerOptions: {
                incremental: true
            },
            include: [
                `src/packages/**/*.ts`,
                `src/packages/**/*d.ts`,
                `src/packages/**/*.vue`,
            ],
        }),
    ],
    resolve: {
        alias: [
            {
                find: '~',
                replacement: resolve(process.cwd(), '.'),
            },
        ],
    },
    build: {
        outDir: './dist',
        cssCodeSplit: false,
        lib: {
            entry: './src/packages/index.ts',
            formats: ['es', 'cjs'],
            fileName(fromat, entryName) {
                return `${fromat}/${entryName.replace('.vue', '')}.js`;
            },
        },
        rollupOptions: {
            output: {
                inlineDynamicImports: false,
                preserveModules: true,
                preserveModulesRoot: 'src/packages',
                assetFileNames: '[ext]/[name].[ext]',
                globals: {
                    vue: 'Vue',
                    'cesium': 'Cesium',
                    'lodash-es': 'LodashEs'
                },
            },
            external: [
                'vue',
                'cesium',
                'cesium/Build/Cesium/Widgets/widgets.css',
                'lodash-es',
            ]
        }
    }
});