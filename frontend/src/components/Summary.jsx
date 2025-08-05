

import { useState } from 'react'

/**
 * 会議終了後に議事録サマリを表示し、Markdown でダウンロードできるコンポーネント。
 *
 * Props:
 * - summary: { content: string }  // GPT から返ってきたサマリ本文
 * - meeting: { id: string|number, title: string } // 会議メタデータ
 */
function Summary({ summary, meeting }) {
  const [isExporting, setIsExporting] = useState(false)

  // Markdown をエクスポートしてブラウザにダウンロードさせる
  const exportMarkdown = async () => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/export/${meeting.id}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const blob = await response.blob()

      // ブラウザでダウンロード
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `meeting_${meeting.id}.md`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('エクスポートエラー:', error)
      alert('エクスポートに失敗しました')
    } finally {
      setIsExporting(false)
    }
  }

  // 画面をリロードして新しい会議を開始
  const restartMeeting = () => {
    window.location.reload()
  }

  return (
    <div className="agenda-form">
      <h1>✅ 会議が終了しました</h1>
      <h2>📋 {meeting.title}</h2>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'left',
        }}
      >
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
          {summary.content}
        </pre>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={exportMarkdown}
          className="btn success"
          disabled={isExporting}
        >
          {isExporting ? '📤 エクスポート中...' : '📥 Markdownをダウンロード'}
        </button>

        <button onClick={restartMeeting} className="btn">
          🔄 新しい会議を開始
        </button>
      </div>
    </div>
  )
}

export default Summary