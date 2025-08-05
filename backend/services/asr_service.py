import openai
import os
from typing import IO
import tempfile

async def transcribe_audio(audio_data: bytes) -> str:
    """音声データをテキストに変換"""
    try:
        # 一時ファイルに保存
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
            temp_file.write(audio_data)
            temp_path = temp_file.name
        
        # Whisper API で文字起こし
        with open(temp_path, 'rb') as audio_file:
            transcript = openai.Audio.transcribe(
                model="whisper-1",
                file=audio_file,
                language="ja"
            )
        
        # 一時ファイル削除
        os.unlink(temp_path)
        
        return transcript.text
    
    except Exception as e:
        return f"[音声認識エラー: {str(e)}]"
