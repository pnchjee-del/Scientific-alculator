import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Zap,
  BookOpen,
  Cpu,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  model?: string;
}

interface GeminiChatbotProps {
  initialPrompt?: string;
  onSpeakText: (text: string) => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  initialPrompt,
  onSpeakText,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Try restoring conversation history from localStorage
    try {
      const saved = localStorage.getItem('aethercalc_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Welcome to the AetherCalc Computational AI Studio! I am your STEM problem-solving assistant.\n\nI can help you with:\n- Rigorous derivations for complex numbers ($z = a + bi$), Euler’s formula ($e^{i\\theta}$), and roots of unity\n- Step-by-step solutions for quadratic, polynomial, and differential equations\n- Dimensional analysis & SI unit conversion physics\n- Verifying calculations and analyzing function behavior\n\nHow can I assist your mathematical exploration today?',
        timestamp: Date.now(),
        model: 'gemini-3.5-flash',
      },
    ];
  });

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Model selection as requested:
  // - gemini-3.1-pro-preview: particularly complex tasks
  // - gemini-3.5-flash: general tasks
  // - gemini-3.1-flash-lite: tasks that should happen fast
  const [selectedModel, setSelectedModel] = useState<
    'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite'
  >('gemini-3.5-flash');

  // Specific system instruction role as requested
  const [selectedRole, setSelectedRole] = useState<'mathematician' | 'proof_master' | 'quick_verifier' | 'physics_engineer'>('mathematician');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aethercalc_chat_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle initialPrompt if passed from other views
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleClearHistory = () => {
    const welcome: ChatMessage = {
      id: 'welcome-' + Date.now(),
      role: 'assistant',
      content:
        'Conversation cleared. What mathematical or physical problem would you like to explore next?',
      timestamp: Date.now(),
      model: selectedModel,
    };
    setMessages([welcome]);
  };

  const handleSendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      // Send conversation history to /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content,
          })),
          model: selectedModel,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error communicating with Gemini API');
      }

      const assistantMsg: ChatMessage = {
        id: 'asst-' + Date.now(),
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
        model: data.model || selectedModel,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate response.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(input);
  };

  return (
    <div className="max-w-4xl mx-auto h-[740px] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Top Header & Model / Role Controls */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <span>Gemini STEM AI Problem Solver</span>
                <span className="text-[10px] text-indigo-400 font-mono bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-800/60">
                  Multi-Turn
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Maintains full conversation history with step-by-step mathematical reasoning
              </p>
            </div>
          </div>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset History</span>
          </button>
        </div>

        {/* Model & System Role Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80 text-xs">
          {/* Model Switcher with roles */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono">Model:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
                title="gemini-3.1-pro-preview: Deep mathematical proofs and complex STEM reasoning"
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedModel === 'gemini-3.1-pro-preview'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pro (Complex Tasks)
              </button>
              <button
                onClick={() => setSelectedModel('gemini-3.5-flash')}
                title="gemini-3.5-flash: Balanced general mathematical problem solving"
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedModel === 'gemini-3.5-flash'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Flash (General)
              </button>
              <button
                onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                title="gemini-3.1-flash-lite: Ultra-fast answers and calculation verification"
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedModel === 'gemini-3.1-flash-lite'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Flash Lite (Fast)
              </button>
            </div>
          </div>

          {/* System Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="mathematician">STEM Professor (Pedagogical)</option>
              <option value="proof_master">Proof Master (Formal & Strict)</option>
              <option value="quick_verifier">Rapid Verifier (Concise)</option>
              <option value="physics_engineer">Physics & Engineering Consultant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Scrollable Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 space-y-2 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800/80 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between gap-3 text-[11px] opacity-75 font-mono">
                <span>{msg.role === 'user' ? 'You' : 'AetherCalc AI'}</span>
                {msg.model && (
                  <span className="bg-slate-900/60 px-1.5 py-0.2 rounded text-[10px]">
                    {msg.model}
                  </span>
                )}
              </div>

              {/* Message Content with clean formatting */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans selection:bg-cyan-500/30">
                {msg.content}
              </div>

              {/* Action buttons for assistant messages */}
              {msg.role === 'assistant' && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60 text-xs">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSpeakText(msg.content)}
                    title="Read aloud using gemini-3.8-flash-tts"
                    className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors ml-2"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen (TTS)</span>
                  </button>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-200 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-300 shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-slate-400 text-sm">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>
                Thinking with {selectedModel} ({selectedRole})...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-mono">
        <span className="text-slate-500 shrink-0">Suggested:</span>
        <button
          onClick={() => handleSendPrompt('Explain Euler’s formula e^(i*pi) + 1 = 0 and its geometric meaning.')}
          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-lg border border-slate-800 shrink-0 transition-colors"
        >
          Euler's formula & geometry
        </button>
        <button
          onClick={() => handleSendPrompt('How do you derive the quadratic formula for complex conjugate roots?')}
          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg border border-slate-800 shrink-0 transition-colors"
        >
          Derive complex roots
        </button>
        <button
          onClick={() => handleSendPrompt('Explain the dimensional analysis of energy (Joules) in terms of SI base units.')}
          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-300 rounded-lg border border-slate-800 shrink-0 transition-colors"
        >
          Energy dimensional analysis
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything with ${selectedModel}...`}
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-60 font-sans"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 text-sm font-semibold shrink-0"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
