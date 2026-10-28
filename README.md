# Project Nexus — Intelligence Vault

Project Nexusの公式ランディングページと、資料上の主張・出典・検証状態を分けて確認する公開安全版Intelligence Vaultです。

## 方針

このサイトは、未検証のウォレット、トークン、スマートコントラクト、AI自動化稼働実績を確定事実として表示しません。秘密鍵、シード、リカバリーフレーズ、APIキー、パスワード、個人情報、未公開原本、完全なウォレット識別子は公開データに収録しません。送金、SNS自動投稿、スマートコントラクト書き込みも行いません。

## 開発

```bash
pnpm install --frozen-lockfile
pnpm run build
pnpm run check
PORT=3000 pnpm start
```

`/` が公式LP、`/vault.html` がIntelligence Vaultです。ビルド出力は `dist/` に生成されます。公開ルートは `public/manus-routes.json` で管理します。

## データ構造

`data/evidence-summary.json` に、資料の集計値、主張、出典、検証状態、次の確認事項、優先アクションを格納しています。公開版データは、原本のコピーではなく、安全側に要約した公開用データです。

## 実装記録

- `docs/IMPLEMENTATION-PLAN.md`: 初回の実装方針と次の実装単位
- `docs/SECURITY-AUDIT.md`: 初回セキュリティ監査メモ
- `docs/DEPLOYMENT-RECORD.md`: 公開デプロイ記録
