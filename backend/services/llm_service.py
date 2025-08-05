import openai
from typing import Dict

async def generate_summary(transcript: str) -> Dict[str, str]:
    """議事録から要約とアクションアイテムを生成"""
    try:
        prompt = f"""
以下の会議議事録を分析し、要約とアクションアイテムを抽出してください：

{transcript}

出力形式：
## 📝 会議要約（400字以内）
[会議の要点を簡潔にまとめてください]

## 📋 アクションアイテム
- [ ] 項目1 (担当者: XX, 期限: YYYY/MM/DD)
- [ ] 項目2 (担当者: YY, 期限: YYYY/MM/DD)

## 🔑 キーポイント
- 重要な決定事項1
- 重要な決定事項2

議事録が短い場合や内容が不十分な場合は、その旨を明記してください。
"""
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000,
            temperature=0.3
        )
        
        content = response.choices[0].message.content
        return {"content": content}
    
    except Exception as e:
        return {"content": f"要約生成エラー: {str(e)}"}

async def extract_action_items(transcript: str) -> list:
    """アクションアイテムのみを構造化データとして抽出"""
    try:
        prompt = f"""
以下の議事録からアクションアイテムを抽出し、JSON形式で出力してください：

{transcript}

出力形式：
[
  {{
    "task": "タスクの説明",
    "assignee": "担当者名",
    "due_date": "期限（YYYY-MM-DD形式）",
    "priority": "high/medium/low"
  }}
]

アクションアイテムが見つからない場合は空の配列を返してください。
"""
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.1
        )
        
        import json
        action_items = json.loads(response.choices[0].message.content)
        return action_items
    
    except Exception as e:
        return []
