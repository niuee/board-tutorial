// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    resolve: {
        alias: {
            /** these are just examples, replace with actual paths */ 
            '@components': resolve(__dirname, './src/components'),
            '@utils': resolve(__dirname, './src/utils'),
            // Add more aliases as needed
        },
    },
    plugins: [
        dts({
            // Specify the output directory for declaration files
            // This should match your TypeScript configuration
            outputDir: 'build',
            // Include any additional configuration options here
        })
    ],
    build: {
        outDir: 'build',
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'InfiniteCanvas',
            // the proper extensions will be added
            fileName: 'infinite-canvas',
        },
    },
})
