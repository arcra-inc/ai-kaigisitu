import { useState, useRef, useEffect } from 'react'

function Transcript({ transcript, setTranscript, meetingId, isRecording, setIsRecording }) {
  const [isSupported, setIsSupported] = useState(false)
  const mediaRecorderRef = useRef(null)
  const wsRef = useRef(null)

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'MediaRecorder' in window)
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
      wsRef.current = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/${meetingId}`)

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data)
        if (data.text) {
          const newTranscript = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            text: data.text,
            speaker: 'Unknown'
          }
          setTranscript(prev => [...prev, newTranscript])

          await fetch('/api/transcript', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              meeting_id: meetingId,
              text: data.text,
              speaker: 'Unknown'
            })
          })
        }
      }

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(event.data)
        }
      }

      mediaRecorderRef.current.start(250)
      setIsRecording(true)
    } catch (error) {
      console.error('マイクアクセスエラー:', error)
      alert('マイクへのアクセスが拒否されました')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close()
    }
    setIsRecording(false)
  }

  const addManualText = () => {
    const text = prompt('手動で議事録を追加:')
    if (text) {
      const newTranscript = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        text: text,
        speaker: 'Manual'
      }
      setTranscript(prev => [...prev, newTranscript])
    }
  }

  return (
    <div className="transcript-section">
      <h3>📝 議事録</h3>

      <div style={{ marginBottom: '20px' }}>
        {isSupported ? (
          <>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`btn ${isRecording ? 'danger' : 'success'}`}
              disabled={isRecording}
            >
              {isRecording ? '🔴 録音中...' : '🎤 音声入力開始'}
            </button>
            <button onClick={addManualText} className="btn">
              ✏️ 手動追加
            </button>
          </>
        ) : (
          <div>
            <p>⚠️ ブラウザが音声認識に対応していません</p>
            <button onClick={addManualText} className="btn">
              ✏️ 手動で議事録を追加
            </button>
          </div>
        )}
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {transcript.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.7 }}>
            音声入力または手動追加で議事録を作成してください
          </p>
        ) : (
          transcript.map((item) => (
            <div key={item.id} className="transcript-item">
              <strong>[{item.timestamp}] {item.speaker}:</strong> {item.text}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Transcript

