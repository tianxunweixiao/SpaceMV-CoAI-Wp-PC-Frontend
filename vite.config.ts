import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// @ts-ignore
import postcssAspectRatioMini from 'postcss-aspect-ratio-mini'
// @ts-ignore
import postcssPxToViewport from 'postcss-px-to-viewport'
// @ts-ignore
import postcssWriteSvg from 'postcss-write-svg'
import postcssPresetEnv from 'postcss-preset-env'
// @ts-ignore
import postcssViewportUnits from 'postcss-viewport-units'
import cssnano from 'cssnano'
import tailwindcss from 'tailwindcss'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        postcssAspectRatioMini(),
        postcssPxToViewport({
          viewportWidth: 1920,
          viewportHeight: 1080,
          unitPrecision: 3,
          viewportUnit: 'vw',
          selectorBlackList: ['.ignore', '.hairlines'],
          minPixelValue: 1,
          mediaQuery: false
        }),
        postcssWriteSvg(),
        postcssPresetEnv({
          stage: 3
        }),
        postcssViewportUnits(),
        cssnano({
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true
              }
            }
          ]
        })
      ]
    }
  },
  server: {
    port: 5174,
    open: '/',
    proxy: {
      '/upload/': {
        target: 'http://example.com/',
        changeOrigin: true
      },
      '/dev-api/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-api/, '')
      },
      '/prod-api/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prod-api/, '')
      }
    }
  }
})

