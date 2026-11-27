import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/main.ts',
  outDir: 'LDNS_cursed_addon_BP/scripts',
  target: 'ES2024',
  platform: 'neutral',
  deps: {
    // @minecraft/server などのネイティブモジュールはゲーム側が提供するので bundle しない
    // (vanilla-data / math は純粋な JS ライブラリなので bundle する)
    neverBundle: /^@minecraft\/(?!vanilla-data|math)/,
    alwaysBundle: ['**/*'],
    onlyBundle: false,
  },
  sourcemap: true,
});
