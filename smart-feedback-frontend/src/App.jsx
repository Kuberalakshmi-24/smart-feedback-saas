import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Chart Data Calculation
  const data = [
    { name: 'Positive', value: history.filter(h => h.sentiment === 'Positive').length, color: '#10B981' },
    { name: 'Negative', value: history.filter(h => h.sentiment === 'Negative').length, color: '#EF4444' },
    { name: 'Neutral', value: history.filter(h => h.sentiment === 'Neutral').length, color: '#F59E0B' },
  ].filter(item => item.value > 0);

  const handleAnalyze = async () => {
    if (!inputText) return;
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      setResult(data);
      setHistory(prev => [{ ...data, id: Date.now() }, ...prev]);
      setInputText(''); 
    } catch (error) {
      alert("Error: Is your Python backend running?");
    }
    setLoading(false);
  };

  // --- STYLES ---
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#F3F4F6', 
      fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
      padding: '40px 20px',
    },
    wrapper: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#111827',
      marginBottom: '10px',
      letterSpacing: '-0.025em',
    },
    subtitle: {
      color: '#6B7280',
      fontSize: '1.1rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr', 
      gap: '24px',
      alignItems: 'start',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    textArea: {
      width: '95%',
      padding: '16px',
      borderRadius: '8px',
      border: '2px solid #E5E7EB',
      fontSize: '16px',
      fontFamily: 'inherit',
      resize: 'vertical',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    button: {
      width: '100%',
      padding: '14px',
      marginTop: '16px',
      backgroundColor: '#2563EB', 
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1,
      transition: 'all 0.2s',
    },
    badge: (sentiment) => ({
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '999px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: sentiment === 'Positive' ? '#D1FAE5' : sentiment === 'Negative' ? '#FEE2E2' : '#FEF3C7',
      color: sentiment === 'Positive' ? '#065F46' : sentiment === 'Negative' ? '#991B1B' : '#92400E',
    }),
    historyItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      borderBottom: '1px solid #F3F4F6',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>SmartFeedback AI</h1>
          <p style={styles.subtitle}>Enterprise Customer Sentiment Analytics</p>
        </header>

        <div className="responsive-grid">
          
          {/* Left Column: Analysis */}
          <div style={styles.card}>
            <h3 style={{marginTop: 0, color: '#374151'}}>New Analysis</h3>
            <textarea 
              rows="5" 
              placeholder="Paste customer feedback here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={styles.textArea}
              onFocus={(e) => e.target.style.borderColor = '#2563EB'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
            <button 
              onClick={handleAnalyze} 
              disabled={loading}
              style={styles.button}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1D4ED8'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2563EB'}
            >
              {loading ? 'Processing...' : 'Analyze Sentiment'}
            </button>

            {/* Latest Result */}
            {result && (
              <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '12px', textAlign: 'center' }}>
                <span style={{ color: '#6B7280', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Detected Sentiment</span>
                <div style={{ marginTop: '10px' }}>
                  <span style={{ ...styles.badge(result.sentiment), fontSize: '18px', padding: '8px 20px' }}>
                    {result.sentiment}
                  </span>
                </div>
                <p style={{ marginTop: '10px', color: '#6B7280', fontSize: '14px' }}>
                  Confidence Score: <strong>{result.score}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Visualization */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Chart Card */}
            <div style={styles.card}>
              <h3 style={{marginTop: 0, color: '#374151', marginBottom: '20px'}}>Sentiment Distribution</h3>
              <div style={{ height: '250px', width: '100%' }}>
                {history.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={data} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={80} 
                        paddingAngle={5} 
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell key={'cell-' + index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontStyle: 'italic' }}>
                    Waiting for data...
                  </div>
                )}
              </div>
            </div>

            {/* History Card */}
            <div style={{ ...styles.card, flex: 1 }}>
              <h3 style={{marginTop: 0, color: '#374151'}}>Recent Scans</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {history.length === 0 && <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No history yet.</p>}
                {history.map((item) => (
                  <div key={item.id} style={styles.historyItem}>
                    <div style={{ flex: 1, marginRight: '15px' }}>
                      <p style={{ margin: 0, color: '#4B5563', fontSize: '14px', fontWeight: '500' }}>
                        "{item.original_text.length > 40 ? item.original_text.substring(0, 40) + '...' : item.original_text}"
                      </p>
                    </div>
                    <span style={styles.badge(item.sentiment)}>
                      {item.sentiment}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Mobile Responsiveness Helper */}
      <style>{`
        @media (max-width: 768px) {
          .responsive-grid {
            display: grid;
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default App
