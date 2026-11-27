# 開発ガイド

このアドオンの Script API 部分は TypeScript で書かれており、[tsdown](https://tsdown.dev) で 1 つの JavaScript ファイルにバンドルしてからゲームに読み込ませます。

## 必要なもの

- [Node.js](https://nodejs.org) 24 以上
- [pnpm](https://pnpm.io)（バージョンは `package.json` の `packageManager` で固定しています）
  - `corepack enable` を実行しておくと、指定バージョンの pnpm が自動で使われます
  - npm / yarn では install できません（`devEngines` で弾かれます）

## セットアップ

```sh
pnpm install
```

## コマンド

| コマンド | 内容 |
| --- | --- |
| `pnpm build` | `src/` をビルドして `LDNS_cursed_addon_BP/scripts/main.js` を生成する |
| `pnpm watch` | ファイルの変更を監視して自動で再ビルドする |
| `pnpm typecheck` | `tsc` で型チェックする（tsdown 自体は型エラーがあってもビルドしてしまうので、こちらで確認する） |

## ディレクトリ構成

```
.
├── src/                     # Script API のソースコード (TypeScript)
│   ├── main.ts              # エントリーポイント。各モジュールをここで import する
│   ├── entity_event/        # モブ関連のイベント
│   ├── item_event/          # アイテム関連のイベント
│   ├── block_event/         # ブロック関連のイベント
│   ├── script_event/        # ランダムイベントや /scriptevent
│   ├── functions/           # 共通処理
│   ├── lib/                 # 定数など
│   ├── config.ts
│   └── util.ts
├── LDNS_cursed_addon_BP/    # ビヘイビアパック
│   └── scripts/             # ビルド成果物 (git 管理外)
├── LDNS_cursed_addon_RP/    # リソースパック
├── tsdown.config.ts
└── tsconfig.json
```

- `LDNS_cursed_addon_BP/scripts/` はビルドで生成されるので、直接編集しないでください。git にもコミットされません。
- 新しいスクリプトファイルを追加したら、`src/main.ts` で import しないとバンドルに含まれません。
- `@minecraft/server` と `@minecraft/server-ui` はゲーム側が提供するので、バンドルには含めません。`@minecraft/vanilla-data` などの普通の JS ライブラリはバンドルされます。

## ゲームで動作確認する

パックのフォルダを Minecraft の開発用パックフォルダにシンボリックリンクしておくと、`pnpm watch` でビルドした結果がそのまま反映されます。ゲーム内で `/reload` を実行するとスクリプトを再読み込みできます。

Windows では、管理者権限のコマンドプロンプトでリポジトリのルートから次を実行します。

```bat
set MC=%APPDATA%\Minecraft Bedrock\Users\Shared\games\com.mojang
mklink /D "%MC%\development_behavior_packs\LDNS_cursed_addon_BP" "%CD%\LDNS_cursed_addon_BP"
mklink /D "%MC%\development_resource_packs\LDNS_cursed_addon_RP" "%CD%\LDNS_cursed_addon_RP"
```

ワールドを作成するときは、実験的機能をすべて有効にしてください。

## Script API のバージョンを上げる

型定義（npm パッケージ）とゲームが読み込むモジュールのバージョンは揃えておく必要があります。上げるときは次の 2 か所を同時に更新してください。

1. `package.json` の `@minecraft/server` / `@minecraft/server-ui` / `@minecraft/vanilla-data`
2. `LDNS_cursed_addon_BP/manifest.json` の `dependencies` にあるモジュールのバージョン（必要なら `min_engine_version` も）

更新したら `pnpm install` → `pnpm typecheck` を実行し、型エラーが出た箇所を直します。

## プルリクエストを出す前に

- `pnpm typecheck` と `pnpm build` がエラーなく通ることを確認してください。
- ゲーム内で実際に動作を確認してください。

## リリース

`.github/workflows/auto-update.yml` が CI 上で `pnpm build` を実行し、ビルド済みのスクリプトを含めて `.mcaddon` / `.zip` を作成します。手元でパッケージを作る場合も、先に `pnpm build` を実行してください。
