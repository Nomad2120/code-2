/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import path from 'path';
import tailwindcss from 'tailwindcss';
import circleDependency from 'vite-plugin-circular-dependency';

export default defineConfig(({ mode }) => {
  console.log('mode', mode);
  return {
    define: {
      'process.env': loadEnv(mode, process.cwd())
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@app': path.resolve(__dirname, 'src/app'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@widgets': path.resolve(__dirname, 'src/widgets'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@entities': path.resolve(__dirname, 'src/entities'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@mobx': path.resolve(__dirname, 'src/app/stores/mobx'),
        '@redux': path.resolve(__dirname, 'src/app/stores/redux'),
        '@stores': path.resolve(__dirname, 'src/app/stores')
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true
          }
        }
      }
    },
    plugins: [
      react({
        babel: {
          plugins: ['babel-plugin-transform-typescript-metadata', 'babel-plugin-parameter-decorator'],
          parserOpts: {
            plugins: ['decorators-legacy', 'classProperties']
          }
        }
      }),
      {
        name: 'typescript'
      },
      circleDependency({
        outputFilePath: './circleDep'
      })
    ],
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: '[local]_[hash:base64:5]',
        hashPrefix: 'prefix'
      },
      postcss: {
        plugins: [tailwindcss()]
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/tests/vitest/setup.ts'
    },
    server: {
      open: true,
      port: 3000
    },
    build: {
      outDir: 'build',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: mode === 'development',
      minify: 'esbuild',
      reportCompressedSize: false
    }
  };
});
