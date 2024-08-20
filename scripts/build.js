import dts from 'bun-plugin-dts'
import Bun from 'bun';
await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  plugins: [
    dts()
  ],
})


// Generates `dist/index.d.ts` and `dist/other.d.ts`
