# 🎯 AI会議室システム - 1日MVP

会議前・会議中・会議後の全ワークフローを AI で支援するシステムの最小動作版です。

## ✨ 機能

- 📝 **アジェンダ管理**: 手動で議題・時間を設定
- ⏰ **タイムマネジメント**: 議題毎のカウントダウンタイマー
- 🎤 **音声認識**: OpenAI Whisper による文字起こし
- 📋 **要約生成**: GPT-4 による会議要約・アクションアイテム抽出
- 📥 **エクスポート**: Markdown 形式でダウンロード

## 🚀 クイックスタート

### 1. 環境設定
```bash
# API キーを設定
cp .env.example .env
# .env ファイルを編集して OPENAI_API_KEY を設定
```

### 2. 起動
```bash
# Docker Compose で一発起動
docker-compose up --build

# または個別起動
cd frontend && npm install && npm run dev &
cd backend && pip install -r requirements.txt && uvicorn main:app --reload
```

### 3. アクセス
- フロントエンド: http://localhost:3000
- バックエンド API: http://localhost:8000

## 📱 使い方

1. **会議作成**: タイトルと議題を入力して「会議を開始」
2. **議事録作成**: 
   - 🎤「音声入力開始」でマイク録音（リアルタイム認識）
   - ✏️「手動追加」でテキスト入力
3. **時間管理**: 各議題の残り時間を表示、超過時は赤色警告
4. **会議終了**: 「会議を終了」で AI が要約・アクション抽出
5. **エクスポート**: 📥「Markdownをダウンロード」で保存

## 🛠️ 技術スタック

- **Frontend**: React + Vite
- **Backend**: FastAPI + SQLite
- **AI**: OpenAI Whisper + GPT-4
- **Deployment**: Docker Compose

## 📁 プロジェクト構造

```
ai-meeting-mvp/
├── frontend/          # React SPA
├── backend/           # FastAPI サーバー
├── data/             # SQLite データベース
└── docker-compose.yml # 開発環境設定
```

## ⚠️ 制限事項（MVP版）

- 認証機能なし（開発用）
- 話者識別なし
- データは再起動で消失可能性
- エラーハンドリング最小限

## 🔄 今後の拡張予定

- 話者識別・脱線検知
- カレンダー・タスクツール連携
- 検索・履歴機能
- SSO認証・権限管理

## 🐛 トラブルシューティング

**マイクが動作しない**
- ブラウザでマイクアクセスを許可
- HTTPS または localhost でアクセス

**音声認識が失敗する**
- OpenAI API キーが正しく設定されているか確認
- インターネット接続を確認

**Docker起動エラー**
- Docker Desktop が起動しているか確認
- ポート 3000, 8000 が使用されていないか確認

## 🌐 デプロイ

インターネット上でサービスを公開する手順は [docs/deployment.md](docs/deployment.md) を参照してください。

## 📞 サポート

質問・バグ報告は Issues までお願いします。
