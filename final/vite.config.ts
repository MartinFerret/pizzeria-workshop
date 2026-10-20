// Six pages, one per HTML file. Vite serves them all in dev; the build
// needs the list.
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

const pages = ['index', 'about', 'pricing', 'services', 'contact', 'order']

export default defineConfig({
  // Type errors in the page, like Angular: a badge in the corner with the
  // count, the details one click away. Closed at start, so the four empty
  // files of start/ don't cover the page.
  plugins: [checker({ typescript: true, overlay: { initialIsOpen: false } })],
  // A syntax error saved mid-sentence must not cover the page with Vite's
  // red overlay: the tsc terminal already says what is wrong.
  server: { hmr: { overlay: false } },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page, new URL(`./${page}.html`, import.meta.url).pathname]),
      ),
    },
  },
})
