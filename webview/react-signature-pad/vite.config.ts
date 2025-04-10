import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"

const renameIndexPlugin = (newFilename: string) => {
  if (!newFilename) return

  return {
    name: 'renameIndex',
    enforce: "post" as const,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generateBundle(_options: any, bundle: any) {
      const indexHtml = bundle['index.html']
      indexHtml.fileName = newFilename
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile(), renameIndexPlugin('signature_pad.html')],
  build: {
    outDir: '../../assets',
  },
})
