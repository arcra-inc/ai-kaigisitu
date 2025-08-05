# AI会議室システム

AI技術を活用した次世代会議室システム

## 🎯 概要

本システムは「会議前・会議中・会議後」の各フェーズにおける時間短縮・議論集中・決定事項実行をAI技術で支援し、企業全体の会議生産性を向上させることを目的としています。

## 🏗️ アーキテクチャ

- **モノレポ構成**: 統一的なバージョン管理・リリース管理
- **マイクロサービス**: スケーラブルで保守性の高いサービス分離
- **クラウドネイティブ**: Kubernetes・Docker・Terraform による IaC

## 🚀 クイックスタート

### 前提条件

- Node.js 18+
- Python 3.9+
- Docker & Docker Compose
- pnpm

### セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発環境の起動
pnpm dev

# Docker環境の起動
docker-compose up -d
```

## 📁 プロジェクト構成

```
ai-meeting-system/
├── apps/                     # フロントエンドアプリケーション
├── services/                 # バックエンドサービス
├── packages/                 # 共通ライブラリ
├── infrastructure/           # インフラ・デプロイ設定
├── docs/                     # ドキュメント
└── scripts/                  # 開発・運用スクリプト
```

## 🔧 開発

### 利用可能なコマンド

```bash
pnpm dev          # 開発サーバー起動
pnpm build        # プロダクションビルド
pnpm test         # テスト実行
pnpm lint         # コード品質チェック
pnpm type-check   # 型チェック
```

## 📖 ドキュメント

- [要件定義書](./docs/requirements/)
- [システム設計](./docs/design/)
- [API仕様](./docs/api/)
- [デプロイガイド](./docs/deployment/)

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。
