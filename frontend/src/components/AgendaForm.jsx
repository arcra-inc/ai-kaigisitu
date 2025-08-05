import { useState } from 'react'

function AgendaForm({ onStart }) {
  const [title, setTitle] = useState('')
  const [agendas, setAgendas] = useState([{ topic: '', planned_minutes: 10 }])

  const addAgenda = () => {
    setAgendas([...agendas, { topic: '', planned_minutes: 10 }])
  }

  const updateAgenda = (index, field, value) => {
    const updated = [...agendas]
    updated[index][field] = value
    setAgendas(updated)
  }

  const removeAgenda = (index) => {
    setAgendas(agendas.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const response = await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, agendas })
    })
    
    const result = await response.json()
    onStart({ id: result.id, title, agendas })
  }

  return (
    <div className="agenda-form">
      <h1>🎯 会議を開始します</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="会議のタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <h3>議題</h3>
        {agendas.map((agenda, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '10px 0' }}>
            <input
              type="text"
              placeholder="議題"
              value={agenda.topic}
              onChange={(e) => updateAgenda(index, 'topic', e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <input
              type="number"
              placeholder="分"
              value={agenda.planned_minutes}
              onChange={(e) => updateAgenda(index, 'planned_minutes', parseInt(e.target.value))}
              min="1"
              style={{ width: '80px' }}
            />
            <span>分</span>
            {agendas.length > 1 && (
              <button type="button" onClick={() => removeAgenda(index)} className="btn danger">
                削除
              </button>
            )}
          </div>
        ))}
        
        <button type="button" onClick={addAgenda} className="btn">
          + 議題を追加
        </button>
        
        <br /><br />
        <button type="submit" className="btn success" style={{ fontSize: '20px', padding: '15px 30px' }}>
          🚀 会議を開始
        </button>
      </form>
    </div>
  )
}

export default AgendaForm
