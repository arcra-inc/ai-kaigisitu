import { useState, useRef, useEffect } from 'react'

function Transcript({ transcript, setTranscript, meetingId, isRecording, setIsRecording }) {
  const [isSupported, setIsSupported] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const isRecordingRef = useRef(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  }, [])

  const scheduleStop = () => {
    timeoutRef.current = setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }, 5000)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []
      isRecordingRef.current = true

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
        const formData = new FormData()
        formData.append('audio', audioBlob, 'recording.wav')

        try {
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
          })
          const result = await response.json()

          if (result.text) {
            const newTranscript = {
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString(),
              text: result.text
            }
            setTranscript(prev => [...prev, newTranscript])

            await fetch('/api/transcript', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                meeting_id: meetingId,
                text: result.text
              })
            })
          }
        } catch (error) {
          console.error('音声認識エラー:', error)
        }
        if (isRecordingRef.current) {
          chunksRef.current = []
          mediaRecorderRef.current.start()
          scheduleStop()
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      scheduleStop()

    } catch (error) {
      console.error('マイクアクセスエラー:', error)
      alert('マイクへのアクセスが拒否されました')
    }
  }

  const stopRecording = () => {
    isRecordingRef.current = false
    clearTimeout(timeoutRef.current)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
  }

  const addManualText = () => {
    const text = prompt('手動で議事録を追加:')
    if (text) {
      const newTranscript = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        text: text
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
              >
                {isRecording ? '⏹️ 録音停止' : '🎤 音声入力開始'}
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
              <strong>[{item.timestamp}]</strong> {item.text}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Transcript

