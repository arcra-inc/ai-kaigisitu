.PHONY: help install dev build test lint clean setup docker-up docker-down deploy

help: ## このヘルプを表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## 依存関係をインストール
	pnpm install

setup: ## 開発環境をセットアップ
	./scripts/setup.sh

dev: ## 開発サーバーを起動
	pnpm dev

build: ## プロダクションビルド
	pnpm build

test: ## テストを実行
	pnpm test

lint: ## コード品質チェック
	pnpm lint

clean: ## ビルド成果物を削除
	pnpm clean
	docker system prune -f

docker-up: ## Docker環境を起動
	docker-compose up -d

docker-down: ## Docker環境を停止
	docker-compose down

deploy: ## デプロイを実行
	./scripts/deploy.sh

backup: ## バックアップを実行
	./scripts/backup.sh
