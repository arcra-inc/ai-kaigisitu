import os
import io
from openai import AsyncOpenAI

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=OPENAI_API_KEY)

async def transcribe_audio(audio_data: bytes) -> str:
    """音声データをOpenAI Whisperでテキストに変換"""
    try:
        audio_file = io.BytesIO(audio_data)
        audio_file.name = "audio.wav"
        transcript = await client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language="ja",
        )
        return transcript.text
    except Exception as e:
        return f"[音声認識エラー: {str(e)}]"

