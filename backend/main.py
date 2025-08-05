from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from datetime import datetime
import sqlite3
from dotenv import load_dotenv
import openai
from openai import OpenAI
from services.asr_service import transcribe_audio as asr_transcribe_audio

load_dotenv()

app = FastAPI(title="AI Meeting System MVP")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI設定
openai.api_key = os.getenv("OPENAI_API_KEY")

# Instantiate new-style OpenAI client (required for >=1.x of openai-python)
client = OpenAI(api_key=openai.api_key)

# データベース初期化
def init_db():
    conn = sqlite3.connect('data/database.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS meetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'active'
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS agendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meeting_id INTEGER,
            topic TEXT NOT NULL,
            planned_minutes INTEGER,
            order_index INTEGER,
            FOREIGN KEY (meeting_id) REFERENCES meetings (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transcripts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meeting_id INTEGER,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            text TEXT NOT NULL,
            FOREIGN KEY (meeting_id) REFERENCES meetings (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS summaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meeting_id INTEGER,
            content TEXT,
            action_items TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (meeting_id) REFERENCES meetings (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# 起動時にDB初期化
@app.on_event("startup")
async def startup_event():
    os.makedirs("data", exist_ok=True)
    init_db()

# API エンドポイント
@app.post("/api/meetings")
async def create_meeting(data: dict):
    conn = sqlite3.connect('data/database.db')
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO meetings (title) VALUES (?)",
        (data['title'],)
    )
    meeting_id = cursor.lastrowid
    
    for i, agenda in enumerate(data['agendas']):
        cursor.execute(
            "INSERT INTO agendas (meeting_id, topic, planned_minutes, order_index) VALUES (?, ?, ?, ?)",
            (meeting_id, agenda['topic'], agenda['planned_minutes'], i)
        )
    
    conn.commit()
    conn.close()
    
    return {"id": meeting_id, "status": "created"}

@app.post("/api/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    try:
        audio_content = await audio.read()
        transcript_text = await asr_transcribe_audio(audio_content)
        return {"text": transcript_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")

@app.post("/api/transcript")
async def add_transcript(data: dict):
    conn = sqlite3.connect('data/database.db')
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO transcripts (meeting_id, text) VALUES (?, ?)",
        (data['meeting_id'], data['text'])
    )
    
    conn.commit()
    conn.close()
    
    return {"status": "added"}

@app.post("/api/summary")
async def generate_summary(data: dict):
    try:
        prompt = f"""
以下の会議議事録を分析し、要約とアクションアイテムを抽出してください：

{data['transcript']}

出力形式：
## 要約（400字以内）
[会議の要点を簡潔にまとめる]

## アクションアイテム
- [ ] 項目1 (担当者: XX, 期限: YYYY/MM/DD)
- [ ] 項目2 (担当者: YY, 期限: YYYY/MM/DD)
"""
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0.3
        )
        
        content = response.choices[0].message.content
        
        # DB保存
        conn = sqlite3.connect('data/database.db')
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO summaries (meeting_id, content) VALUES (?, ?)",
            (data['meeting_id'], content)
        )
        conn.commit()
        conn.close()
        
        return {"content": content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary generation error: {str(e)}")

@app.get("/api/export/{meeting_id}")
async def export_meeting(meeting_id: int):
    conn = sqlite3.connect('data/database.db')
    cursor = conn.cursor()
    
    # 会議情報取得
    cursor.execute("SELECT title, created_at FROM meetings WHERE id = ?", (meeting_id,))
    meeting = cursor.fetchone()
    
    # 議事録取得
    cursor.execute("SELECT timestamp, text FROM transcripts WHERE meeting_id = ? ORDER BY timestamp", (meeting_id,))
    transcripts = cursor.fetchall()
    
    # 要約取得
    cursor.execute("SELECT content FROM summaries WHERE meeting_id = ? ORDER BY created_at DESC LIMIT 1", (meeting_id,))
    summary = cursor.fetchone()
    
    conn.close()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Markdown生成
    markdown = f"""# {meeting[0]}
日時: {meeting[1]}

## 議事録
"""
    
    for timestamp, text in transcripts:
        markdown += f"**[{timestamp}]** {text}\n\n"
    
    if summary:
        markdown += f"\n## 要約・アクションアイテム\n{summary[0]}\n"
    
    return Response(
        content=markdown,
        media_type="text/markdown",
        headers={"Content-Disposition": f"attachment; filename=meeting_{meeting_id}.md"}
    )

# WebSocket (リアルタイム通信)
@app.websocket("/ws/{meeting_id}")
async def websocket_endpoint(websocket: WebSocket, meeting_id: int):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # ここでリアルタイム処理（今回は簡略化）
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        pass

# 静的ファイル配信（本番用）
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
