# Project Nexus — 公開デプロイ記録

## 対象

Project Nexusの公式LPと、公開安全版Intelligence Vault。

## 実装内容

既存LPを維持し、`/vault.html` を追加しました。Vaultでは、資料上の主張、出典、検証状態、次の確認事項、優先アクションを表示します。公開データから秘密情報・個人情報・未公開原本・完全なウォレット識別子を除外しています。

## 検証

- `pnpm install --frozen-lockfile`: 成功
- `pnpm run build`: 成功
- `pnpm run check`: 成功
- `node --check app.js`: 成功
- `node --check vault.js`: 成功
- `/`: HTTP 200
- `/vault.html`: HTTP 200
- `/manus-routes.json`: HTTP 200
- `/data/evidence-summary.json`: HTTP 200
- デスクトップ表示: 確認済み
- モバイル表示: 確認済み
- 公開ソースの完全ウォレットアドレス・秘密鍵パターン: 検出なし

## 公開情報

公開URL、チェックポイントSHA、公開日時は公開成功後に追記します。

## 非実行範囲

秘密情報の取得・移動・公開、送金、SNS自動投稿、スマートコントラクト書き込みは実行していません。
