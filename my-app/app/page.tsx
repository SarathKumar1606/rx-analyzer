'use client';

import { useState, useRef, useEffect } from 'react';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    await sendQuestion(trimmed);
  };

  const sendQuestion = async (question: string) => {
    if (!file) {
      alert('Please upload a prescription first');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', question);
    formData.append('history', JSON.stringify(messages));

    try {
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: data.analysis || 'No analysis returned' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze prescription. See console for details.');
    }

    setLoading(false);
    setInput('');
  };

  const analyzeFile = async () => {
    if (!file) {
      alert('Please upload a prescription first');
      return;
    }

    await sendQuestion('Analyze prescription');
  };

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <section className="hero">
        <div className="hero-left">
          <div className="hero-title">Prescription Analyzer</div>
          <div className="hero-sub">AI-Powered Prescription Insights</div>
          <div className="kpi-box">Understand your prescription better with AI</div>
          <div className="model-box" style={{ marginTop: '1rem' }}>
            Model trained and finetuned by R.Sarathkumar and S.Kowshik, B.Tech IT. CEG
          </div>
        </div>
        <div className="hero-right">
          {/* Illustration placeholder */}
          <img src="/prescription-illustration.svg" alt="prescription" style={{width:220}} />
        </div>
      </section>

      <main className="main-grid">
        <div className="card">
          <h3 style={{fontWeight:800}}>Upload Prescription</h3>
          <div className="upload-drop" style={{marginTop:12}}>
            <div style={{fontSize:14,fontWeight:700,color:'var(--primary)'}}>Click to upload or drag and drop</div>
            <div className="muted">PNG, JPG, JPEG (Max. 10MB)</div>
            <div style={{position:'relative', marginTop:12}}>
              <input
                ref={fileInputRef}
                className="file-input"
                type="file"
                accept="image/*"
                onChange={(e) => { if (e.target.files) setFile(e.target.files[0]); }}
                style={{position:'absolute', top:0, left:0, width:1, height:1, opacity:0, pointerEvents:'none'}}
              />
            </div>
            <button type="button" className="upload-cta" onClick={() => fileInputRef.current?.click()}>Choose File</button>
            <button type="button" className="send-btn" style={{marginLeft:12}} onClick={analyzeFile} disabled={loading || !file}>{loading ? 'Analyzing…' : 'Analyze Prescription'}</button>
            {file && <div className="muted" style={{marginTop:8}}>✓ {file.name}</div>}
            {previewUrl && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <img
                  src={previewUrl}
                  alt="Prescription preview"
                  style={{ width: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: 14, border: '1px solid rgba(15,23,42,0.08)' }}
                />
              </div>
            )}
          </div>

          <div className="tips">
            <strong>Tips for best results:</strong>
            <ul style={{marginTop:8}}>
              <li>Ensure the prescription is clear and readable</li>
              <li>Good lighting and no shadows</li>
              <li>Supported formats: JPG, PNG, JPEG</li>
              <li>Maximum file size: 10MB</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="chat-panel">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <div style={{width:40,height:40,borderRadius:8,background:'linear-gradient(90deg,var(--accent-2),var(--accent))',display:'flex',alignItems:'center',justifyContent:'center',color:'#022c51',fontWeight:800}}>AI</div>
                <div>
                  <div style={{fontWeight:800}}>AI Assistant</div>
                  <div className="muted" style={{fontSize:12}}>Hello! I'm your AI health assistant. Upload your prescription and ask me anything about it.</div>
                </div>
              </div>
              <div className="ai-badge">AI Assistant</div>
            </div>

            <div style={{marginTop:12}}>
              <MessageList messages={messages} />
            </div>

            <ChatInput input={input} setInput={setInput} isLoading={loading} onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
    </div>
  );
}
