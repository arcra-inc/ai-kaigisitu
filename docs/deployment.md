# インターネットに公開する最も簡単な方法

このプロジェクトをローカル環境以外でもアクセス可能にするには、[Render](https://render.com/) を利用するのが簡単です。GitHub 連携と自動ビルドに対応しており、無料プランでも動作を確認できます。

## 前提条件
- このリポジトリを GitHub にプッシュしていること
- OpenAI API キーを取得済みであること

## デプロイ手順
1. Render にサインアップし、ダッシュボードに移動します。
2. **New +** をクリックし、以下の 2 つのサービスを作成します。
   - **Static Site**: `frontend` ディレクトリを指定し、Build Command に `npm install && npm run build`、Publish Directory に `dist` を設定します。
   - **Web Service**: `backend` ディレクトリを指定し、Start Command に `uvicorn main:app --host 0.0.0.0 --port 8000` を設定します。
3. Web Service の **Environment** タブで、`OPENAI_API_KEY` を環境変数として追加します。
4. デプロイが完了すると、Render が発行する URL からフロントエンドとバックエンドにアクセスできます。

## 備考
- 無料プランではスリープする場合があるため、長期運用には有料プランを検討してください。
- 他のホスティングサービス（Railway や Vercel など）でも同様の構成でデプロイ可能です。
