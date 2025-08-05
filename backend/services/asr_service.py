import os
import httpx

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

async def transcribe_audio(audio_data: bytes) -> str:
    """音声データをDeepgramでテキストに変換"""
    try:
        headers = {
            "Authorization": f"Token {DEEPGRAM_API_KEY}",
            "Content-Type": "audio/wav",
        }
        params = {"model": "nova-3", "language": "ja"}
        async with httpx.AsyncClient(timeout=None) as client:
            resp = await client.post(
                "https://api.deepgram.com/v1/listen",
                headers=headers,
                params=params,
                content=audio_data,
            )
            resp.raise_for_status()
            data = resp.json()
            return data["results"]["channels"][0]["alternatives"][0]["transcript"]
    except Exception as e:
        return f"[音声認識エラー: {str(e)}]"

