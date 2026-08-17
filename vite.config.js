import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()]
    })
  ],

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        siteStyles: resolve(__dirname, 'src/content/siteStyles.js'),
      },

      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'siteStyles') {
            return 'siteStyles.js'
          }

          return 'assets/[name].js'
        },
      },
    },
  },
})