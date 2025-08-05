// API クライアント
const API_BASE = '/api'

export const api = {
  // 会議作成
  createMeeting: async (data) => {
    const response = await fetch(`${API_BASE}/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // 音声認識
  transcribeAudio: async (audioBlob) => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.wav')
    
    const response = await fetch(`${API_BASE}/transcribe`, {
      method: 'POST',
      body: formData
    })
    return response.json()
  },

  // 議事録追加
  addTranscript: async (data) => {
    const response = await fetch(`${API_BASE}/transcript`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // 要約生成
  generateSummary: async (data) => {
    const response = await fetch(`${API_BASE}/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  // エクスポート
  exportMeeting: async (meetingId) => {
    const response = await fetch(`${API_BASE}/export/${meetingId}`)
    return response.blob()
  }
}
