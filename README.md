# Project Nexus LP

Project Nexusの公式ランディングページです。日本語コピーと、4.3相当のインタラクティブな統合マインドマップを含む静的サイトとして実装しています。

## 開発

```bash
pnpm install
pnpm run build
PORT=3000 pnpm start
```

ビルド出力は `dist/` です。マインドマップのノード・カテゴリ・接続関係は `app.js` 冒頭の `mapData` に集約してあり、公式資料が揃った場合もそこだけ差し替えられます。ブランドマークは `public/nexus-mark.svg`、メタ情報は `index.html` を編集します。

## 公開

Vercelでは `pnpm run build` をBuild Command、`dist`をOutput Directoryとして指定します。リポジトリ直下の `vercel.json` にも同じ設定を保持しています。
