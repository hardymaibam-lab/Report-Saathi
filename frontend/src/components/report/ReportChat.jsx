import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  Sparkles, 
  User, 
  Bot, 
  ShieldCheck,
  AlertCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { askReportQuestion } from '../../lib/api';
import MarkdownRenderer from './MarkdownRenderer';

export default function ReportChat({ report }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your ReportSaathi educational assistant. You can ask me questions about your **${report?.summary?.report_type || 'laboratory report'}**.\n\nI answer strictly using the extracted values and safe educational guidance from this document. What would you like to know?`,
      supported_by_report: true,
      biomarker: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Dedicated container ref for internal chat scrolling ONLY (prevents window/page jumps)
  const chatContainerRef = useRef(null);
  const isNearBottomRef = useRef(true);
  const isInitialMountRef = useRef(true);

  // Measure if user is scrolled near bottom of the chat container (120px threshold)
  const checkIfNearBottom = () => {
    const el = chatContainerRef.current;
    if (!el) return true;
    const threshold = 120;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceFromBottom <= threshold;
  };

  const handleContainerScroll = () => {
    isNearBottomRef.current = checkIfNearBottom();
  };

  // Smoothly scrolls ONLY the chat container, never touches window.scrollY or page position
  const scrollChatContainerToBottom = (behavior = 'smooth') => {
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior
    });
  };

  // Mark initial mount done WITHOUT scrolling the window or chat container
  useEffect(() => {
    isInitialMountRef.current = false;
  }, []);

  // Conditional auto-scrolling on new messages: ONLY if user was already at bottom
  useEffect(() => {
    if (isInitialMountRef.current) return;

    if (isNearBottomRef.current) {
      // Use requestAnimationFrame to ensure DOM elements have rendered
      requestAnimationFrame(() => {
        scrollChatContainerToBottom('smooth');
      });
    }
  }, [messages]);

  // Contextual suggestion chips based on actual report biomarkers
  const suggestedQuestions = useMemo(() => {
    const list = [];
    const bList = report?.biomarkers || [];
    if (bList.length > 0) {
      const b0 = bList[0];
      const b0Name = b0.test_name || b0.name;
      list.push(`What is my ${b0Name}?`);
      
      const bPlatelet = bList.find(b => (b.test_name || b.name || '').toLowerCase().includes('platelet'));
      if (bPlatelet) {
        list.push("Tell me about my Platelet Count");
      } else if (bList.length > 1) {
        const b1 = bList[1];
        list.push(`Explain my ${b1.test_name || b1.name}`);
      }
    }
    list.push("What values are outside reference ranges?");
    list.push("What should I ask my doctor about these results?");
    return list.slice(0, 4);
  }, [report]);

  const handleSend = async (questionText = null) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    setInput('');
    const newMessages = [...messages, { role: 'user', content: q }];
    setMessages(newMessages);
    setLoading(true);

    // When the user intentionally submits a question, scroll only the internal container to show it
    isNearBottomRef.current = true;
    requestAnimationFrame(() => {
      scrollChatContainerToBottom('smooth');
    });

    try {
      // Pass full conversation history for context-aware follow-ups
      const res = await askReportQuestion(q, report, report?.id, newMessages);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: res.answer,
          supported_by_report: res.supported_by_report,
          biomarker: res.biomarker || null
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'I had trouble retrieving that answer right now. Please verify your connection or try asking again.',
          supported_by_report: false,
          biomarker: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'high') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          Above Range
        </span>
      );
    }
    if (s === 'low') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          Below Range
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
        Within Range
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e5ecea] shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#e5ecea] bg-[#fafaf7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#084d46] text-white flex items-center justify-center shadow-sm shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-[#0a3d36]">
              Ask About This Report
            </h3>
            <p className="text-[11px] text-[#52616b]">
              Answers are grounded strictly in your uploaded laboratory values. Non-diagnostic.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-[#084d46] bg-[#ebf3ea] px-3 py-1 rounded-full border border-[#dce8dc] flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-[#084d46]" />
          <span>Educational & Safe</span>
        </span>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="px-4 sm:px-5 py-2.5 bg-[#f4f8f4]/60 border-b border-[#e5ecea] flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold text-[#52616b] flex items-center gap-1 self-center">
          <Sparkles className="w-3.5 h-3.5 text-[#084d46]" /> Suggestions:
        </span>
        {suggestedQuestions.map((sq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sq)}
            disabled={loading}
            className="text-[11px] font-medium text-[#0a3d36] bg-white hover:bg-[#ebf3ea] hover:border-[#084d46] px-3 py-1 rounded-full border border-[#dce8dc] transition-all text-left shadow-xs disabled:opacity-50"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Messages Feed — Dedicated internal scroll container */}
      <div 
        ref={chatContainerRef}
        onScroll={handleContainerScroll}
        className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 max-h-[460px]"
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#ebf3ea] text-[#084d46] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-4 rounded-2xl max-w-xl leading-relaxed space-y-3 ${
                m.role === 'user'
                  ? 'bg-[#084d46] text-white font-medium rounded-tr-xs shadow-sm ml-8'
                  : m.supported_by_report === false
                  ? 'bg-[#fff7e6] text-[#78350F] border border-[#feebc8] rounded-tl-xs mr-8'
                  : 'bg-[#fafaf7] text-[#172B3A] border border-[#e5ecea] rounded-tl-xs mr-8 shadow-xs'
              }`}
            >
              {/* Optional Structured Biomarker Card if specifically retrieved */}
              {m.biomarker && (
                <div className="bg-white rounded-xl p-3.5 border border-[#dce8dc] shadow-xs space-y-2.5 mb-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-[#084d46]" />
                      <span className="font-heading font-bold text-xs sm:text-sm text-[#0a3d36]">
                        {m.biomarker.test_name}
                      </span>
                    </div>
                    {getStatusBadge(m.biomarker.status)}
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-[#f1f5f9]">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono font-bold text-base sm:text-lg text-[#084d46] tabular-nums">
                        {m.biomarker.extracted_value}
                      </span>
                      {m.biomarker.unit && (
                        <span className="text-xs text-[#52616b] font-medium">
                          {m.biomarker.unit}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#52616b] font-normal">
                      Ref: {m.biomarker.reference_range || 'Not printed'}
                    </span>
                  </div>
                </div>
              )}

              {/* Render Safe Markdown Content */}
              {m.role === 'user' ? (
                <p className="whitespace-pre-line text-white">{m.content}</p>
              ) : (
                <MarkdownRenderer content={m.content} />
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#e5ecea] text-[#0a3d36] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2.5 text-xs text-[#52616b] pl-10 py-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#084d46]" />
            <span className="font-medium animate-pulse">Retrieving facts from your report...</span>
          </div>
        )}
      </div>

      {/* Input Area — 16px text-base on mobile prevents iOS viewport auto-zoom shifts */}
      <div className="p-3 sm:p-4 border-t border-[#e5ecea] bg-white flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about this report (e.g. 'What is my platelet count?' or 'Is it normal?')..."
          disabled={loading}
          className="flex-1 text-base sm:text-sm p-3 rounded-xl border border-[#e5ecea] focus:outline-none focus:ring-2 focus:ring-[#084d46]/20 focus:border-[#084d46] text-[#172B3A] placeholder-[#94A3B8] transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-3 bg-[#084d46] hover:bg-[#063f39] disabled:bg-[#e5ecea] disabled:text-[#94A3B8] text-white rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Send question"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
