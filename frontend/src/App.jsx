import { useState, useEffect } from 'react'
import AgendaForm from './components/AgendaForm'
import Timer from './components/Timer'
import Transcript from './components/Transcript'
import Summary from './components/Summary'
import './App.css'

function App() {
  const [meeting, setMeeting] = useState(null)
  const [currentAgenda, setCurrentAgenda] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [transcript, setTranscript] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [summary, setSummary] = useState(null)

  // タイマー処理
  useEffect(() => {
    if (timeLeft > 0 && meeting) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, meeting])

  const startMeeting = (meetingData) => {
    setMeeting(meetingData)
    if (meetingData.agendas[0]) {
      setTimeLeft(meetingData.agendas[0].planned_minutes * 60)
    }
  }

  const nextAgenda = () => {
    if (currentAgenda < meeting.agendas.length - 1) {
      const next = currentAgenda + 1
      setCurrentAgenda(next)
      setTimeLeft(meeting.agendas[next].planned_minutes * 60)
    }
  }

  const endMeeting = async () => {
    if (transcript.length > 0) {
      // 要約生成API呼び出し
      try {
        const response = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            meeting_id: meeting.id,
            transcript: transcript.map(t => t.text).join('\n')
          })
        })
        const summaryData = await response.json()
        setSummary(summaryData)
      } catch (error) {
        console.error('要約生成エラー:', error)
      }
    }
  }

  if (summary) {
    return <Summary summary={summary} meeting={meeting} />
  }

  if (!meeting) {
    return <AgendaForm onStart={startMeeting} />
  }

  const currentTopic = meeting.agendas[currentAgenda]

  return (
    <div className="meeting-room">
      <Timer 
        timeLeft={timeLeft} 
        topic={currentTopic?.topic}
        onNext={nextAgenda}
        canNext={currentAgenda < meeting.agendas.length - 1}
        onEnd={endMeeting}
      />
      <Transcript 
        transcript={transcript}
        setTranscript={setTranscript}
        meetingId={meeting.id}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      />
    </div>
  )
}

export default App
