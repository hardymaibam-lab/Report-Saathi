import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  ShieldAlert, 
  Sparkles, 
  User, 
  Bot, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { askReportQuestion } from '../../lib/api';

export default function ReportChat({ report }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your ReportSaathi educational assistant. You can ask me questions about your **${report?.summary?.report_type || 'laboratory report'}**. I will answer strictly using the extracted values and safe educational guidance from this document.`,
      supported_by_report: true
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "What values are outside the normal reference ranges?",
    "Explain my highest or lowest biomarker in plain terms.",
    "What should I ask my doctor about these results?"
  ];

  const handleSend = async (questionText = null) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    setInput('');
    const newMessages = [...messages, { role: 'user', content: q }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await askReportQuestion(q, report, report.id);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: res.answer,
          supported_by_report: res.supported_by_report
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'I had trouble answering that right now. Please verify your connection or try again.',
          supported_by_report: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-card border border-[#E5ECEA] shadow-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#E5ECEA] bg-[#F7FAF9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0D9488] text-white flex items-center justify-center shadow-subtle shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-[#16324A]">
              Ask About This Report
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Answers are strictly grounded in your current lab results. No diagnoses.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#0F766E] bg-[#E7F5F2] px-2.5 py-1 rounded-md border border-[#CCFBEF] flex items-center gap-1 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>Educational & Safe</span>
        </span>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="px-4 sm:px-5 py-3 bg-[#F7FAF9]/80 border-b border-[#E5ECEA] flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold text-[#64748B] flex items-center gap-1 self-center">
          <Sparkles className="w-3 h-3 text-[#0D9488]" /> Suggestions:
        </span>
        {suggestedQuestions.map((sq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sq)}
            disabled={loading}
            className="text-[11px] font-medium text-[#16324A] bg-white hover:bg-[#E7F5F2] hover:text-[#0D9488] hover:border-[#0D9488] px-3 py-1 rounded-md border border-[#E5ECEA] transition-all text-left shadow-subtle disabled:opacity-50"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="p-4 sm:p-6 max-h-84 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#E7F5F2] text-[#0D9488] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3.5 rounded-2xl max-w-lg leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#0D9488] text-white font-medium rounded-tr-xs shadow-subtle'
                  : m.supported_by_report === false
                  ? 'bg-[#FFF7E6] text-[#78350F] border border-[#FEEBC8] rounded-tl-xs font-normal'
                  : 'bg-[#F7FAF9] text-[#172B3A] border border-[#E5ECEA] rounded-tl-xs font-normal'
              }`}
            >
              <p className="whitespace-pre-line">{m.content}</p>
            </div>

            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#E5ECEA] text-[#16324A] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#64748B] pl-10">
            <Loader2 className="w-4 h-4 animate-spin text-[#0D9488]" />
            <span>Consulting report facts...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-[#E5ECEA] bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about this report (e.g. 'What is my platelet count?')..."
          disabled={loading}
          className="flex-1 text-xs sm:text-sm p-3 rounded-xl border border-[#E5ECEA] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] text-[#172B3A] placeholder-[#94A3B8]"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-3 bg-[#0D9488] hover:bg-[#0F766E] disabled:bg-[#E5ECEA] disabled:text-[#94A3B8] text-white rounded-xl shadow-subtle transition-colors"
          aria-label="Send question"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
