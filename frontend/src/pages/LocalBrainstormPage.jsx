import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import LocalLLMService from '../services/localLLMService';
import { 
  Cpu, 
  Terminal, 
  Send, 
  RefreshCw, 
  ShieldCheck, 
  Server,
  AlertTriangle,
  Download
} from 'lucide-react';

export default function LocalDisplayPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  
  // Download state
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [downloadPercent, setDownloadPercent] = useState(0);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkOllamaConnection();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePullModel = async (modelName) => {
    setIsDownloading(true);
    setDownloadStatus('Starting download...');
    setDownloadPercent(0);
    
    try {
        await LocalLLMService.pullModel(modelName, (progress) => {
            setDownloadStatus(progress.status);
            if (progress.percent) setDownloadPercent(progress.percent);
        });
        
        // Refresh models after download
        await checkOllamaConnection();
        setSelectedModel(modelName);
        setDownloadStatus('Download complete!');
        setTimeout(() => setIsDownloading(false), 2000);
        
    } catch (error) {
        setDownloadStatus('Error: ' + error.message);
        setTimeout(() => setIsDownloading(false), 3000);
    }
  };

  const checkOllamaConnection = async () => {
    setConnectionError(null);
    const status = await LocalLLMService.checkConnection();
    if (status.connected) {
      setIsConnected(true);
      setModels(status.models);
      if (status.models.length > 0) {
        setSelectedModel(status.models[0].name);
      }
    } else {
      setIsConnected(false);
      setConnectionError("Could not connect to Ollama (127.0.0.1:11434). Make sure it's running!");
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !isConnected || isGenerating) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsGenerating(true);

    const botMessage = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, botMessage]);

    try {
      let fullResponse = '';
      await LocalLLMService.chatCompletion(selectedModel, newMessages, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => {
           const updated = [...prev];
           updated[updated.length - 1] = { role: 'assistant', content: fullResponse };
           return updated;
        });
      });
    } catch (error) {
      setMessages(prev => [...prev, { role: 'system', content: `Error: ${error.message}` }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <Cpu size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>
              Local AI Lab
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Private, offline AI running directly on your machine via Ollama.
            </p>
          </div>
        </div>
      </div>

      {!isConnected ? (
        <div style={{
            background: 'var(--background-card)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <Server size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Ollama Not Detected</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                We couldn't connect to a local Ollama instance on port 11434. 
                This feature requires Ollama to be installed and running on your computer.
            </p>
            
            {connectionError && (
                 <div style={{ 
                    padding: '1rem', 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    color: '#ef4444',
                    marginBottom: '2rem',
                    fontSize: '0.9rem'
                }}>
                    <AlertTriangle size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                    {connectionError}
                 </div>
            )}

            <div style={{ textAlign: 'left', background: 'var(--background-dark)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>How to setup:</h3>
                <ol style={{ color: 'var(--text-secondary)', marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>Download Ollama from <a href="https://ollama.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>ollama.com</a></li>
                    <li>Install and run the application</li>
                    <li>Open your terminal and run: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>ollama run llama3</code></li>
                    <li>Click Refresh below</li>
                </ol>
            </div>

            <button 
                onClick={checkOllamaConnection}
                className="btn btn-primary"
                style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
                <RefreshCw size={18} /> Retry Connection
            </button>
        </div>
      ) : (
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '250px 1fr', 
            gap: '1.5rem',
            height: 'calc(100vh - 200px)',
            minHeight: '500px'
        }}>
            {/* Sidebar */}
            <div style={{ 
                background: 'var(--background-card)', 
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                    Ollama Connected
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Model</label>
                    <button 
                        onClick={checkOllamaConnection}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--primary-color)' }}
                        title="Refresh Models"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>
                <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                    style={{
                        padding: '0.75rem',
                        background: 'var(--background-dark)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        marginBottom: '1.5rem'
                    }}
                >
                    {models.map(m => (
                        <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                </select>

                <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Download New Model</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input 
                            type="text" 
                            placeholder="e.g. llama3" 
                            id="new-model-input"
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                background: 'var(--background-dark)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-primary)',
                                fontSize: '0.85rem'
                            }}
                        />
                        <button 
                            onClick={() => {
                                const name = document.getElementById('new-model-input').value;
                                if(name) handlePullModel(name);
                            }}
                            disabled={isDownloading}
                            style={{
                                background: 'var(--primary-color)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                color: 'white',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                opacity: isDownloading ? 0.7 : 1
                            }}
                        >
                            <Download size={16} />
                        </button>
                    </div>
                    {isDownloading && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <span>{downloadStatus || 'Downloading...'}</span>
                                <span>{downloadPercent}%</span>
                            </div>
                            <div style={{ height: '4px', background: 'var(--background-dark)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${downloadPercent}%`, background: 'var(--primary-color)', transition: 'width 0.2s' }}></div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <div style={{ padding: '1rem', background: 'var(--background-dark)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                            <ShieldCheck size={14} /> 
                            <strong>Privacy First</strong>
                        </div>
                        Your chats here act directly with the model on your computer. No data is sent to our servers or Google.
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div style={{ 
                background: 'var(--background-card)', 
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', opacity: 0.5 }}>
                            <Cpu size={48} style={{ marginBottom: '1rem' }} />
                            <p>Start chatting with {selectedModel}</p>
                        </div>
                    )}
                    
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            background: msg.role === 'user' ? 'var(--primary-color)' : 'var(--background-dark)',
                            color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                            padding: '1rem',
                            borderRadius: '12px',
                            borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                            borderBottomLeftRadius: msg.role === 'user' ? '12px' : '2px',
                            lineHeight: 1.5
                        }}>
                            {msg.content}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            disabled={isGenerating}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: 'var(--background-dark)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-xl)',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isGenerating || !input.trim()}
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'var(--primary-color)',
                                border: 'none',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: (isGenerating || !input.trim()) ? 0.5 : 1
                            }}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </DashboardLayout>
  );
}
