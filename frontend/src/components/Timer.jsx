import { useEffect } from 'react'

function Timer({ timeLeft, topic, onNext, canNext, onEnd }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(Math.abs(seconds) / 60)
    const secs = Math.abs(seconds) % 60
    const sign = seconds < 0 ? '-' : ''
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isOvertime = timeLeft < 0

  // 時間切れ時の音声通知
  useEffect(() => {
    if (timeLeft === 0) {
      // ブラウザのビープ音
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjiO2O7MdiMGL4vO7+ONSA0PVLDh7a1ZEQtGpOPyvmEcBi+L0OzOfSkELIHO8diJOQgSbLzq5p1NFAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjiO2O7MdiMGL4vO7+ONSA0PVLDh7a1ZEQtGpOPwvmEcBi+L0OzOfSkELIHO8diJOQgSbLzq5p1NFAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjiO2O7MdiMGL4vO7+ONSA0PVLDh7a1ZEQtGpOPwvmEcBi+L0OzOfSkELIHO8diJOQgSbLzq5p1NFAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjiO2O7MdiMGL4vO7+ONSA0PVLDh7a1ZEQtGpOPwvmEcBi+L0OzOfSkELIHO8diJOQgSbLzq5p1NFAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjiO2O7MdiMGL4vO7+ONSA0PVLDh7a1ZEQtGpOPwvmEcBi+L0OzOfSkELIHO8diJOQgSbLzq5p1NFAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjiO2O7MdiMGL4vO7+ONSA0PVLDh7a1ZEQtGpOPwvmEcBi+L0OzOfSkELIHO8diJOQgSbLzq5p1NFAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjiO2O7MdiMGL4vO7+ONSA0PVLDh7a1ZEQtGpOPwvmEcBi+L0OzOfSkELIHO8diJOQgSbLzq5p1NFAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjiO2O7MdiMGL4vO7+ONSA0PVLDh7a1ZEQtGpOPwvmEcBi+L0OzOfSkELIHO8diJOQgSbLzq5p1NFAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjiO2O7MdiMGL4vO7+ONSA0PVLDh7a1ZEQtGpOPwvmEcBi+L0OzOfSkELIHO8diJOQgSbLzq5p1NFAxQp+PwtmMcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBjiO2O7MdiMGL4vO7+=')
      audio.play().catch(() => {}) // エラー無視
    }
  }, [timeLeft])

  return (
    <div className="timer-section">
      <h2>📋 {topic}</h2>
      <div className={`timer ${isOvertime ? 'overtime' : ''}`}>
        {formatTime(timeLeft)}
      </div>
      {isOvertime && (
        <div style={{ color: '#ff6b6b', fontSize: '18px', fontWeight: 'bold' }}>
          ⚠️ 時間超過！次の議題に進んでください
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        {canNext && (
          <button onClick={onNext} className="btn success">
            次の議題へ
          </button>
        )}
        <button onClick={onEnd} className="btn danger">
          会議を終了
        </button>
      </div>
    </div>
  )
}

export default Timer
