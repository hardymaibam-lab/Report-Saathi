import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, ArrowRight, Clipboard, Sparkles } from 'lucide-react';

export default function FileDropzone({ onFileSelected, onTextSubmit, onSampleSelect, samples = [], isLoading = false }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPasteText, setShowPasteText] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelected(file);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-teal-500 bg-teal-50/60 scale-[1.01]'
            : 'border-slate-300 hover:border-teal-400 bg-white hover:bg-slate-50/50 shadow-sm'
        } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={handleFileInput}
          disabled={isLoading}
        />

        <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 shadow-inner">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-1">
          Upload your Medical Lab Report
        </h3>
        <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
          Drag and drop your PDF lab report or image scan (PNG, JPG, WEBP), or click to browse from your device.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
            <FileText className="w-3.5 h-3.5 text-teal-600" /> Digital & Scanned PDF
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
            <ImageIcon className="w-3.5 h-3.5 text-teal-600" /> Lab Photos & Images
          </span>
          <span className="px-3 py-1 bg-slate-100 rounded-full">
            Up to 15 MB
          </span>
        </div>
      </div>

      {/* Alternative Options: Paste text or Instant sample */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Instant Samples */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-1">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Instant Sample Reports</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Don't have a report handy? Try one click with standard sample cases:
            </p>
            <div className="space-y-2">
              {samples.slice(0, 2).map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSampleSelect(s)}
                  disabled={isLoading}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-xs font-semibold text-slate-700 flex items-center justify-between group"
                >
                  <span className="truncate">{s.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Paste Text directly */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-1">
              <Clipboard className="w-4 h-4 text-teal-600" />
              <span>Paste Report Text</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Have report text already copied from an email or online portal?
            </p>
          </div>

          {!showPasteText ? (
            <button
              onClick={() => setShowPasteText(true)}
              className="w-full py-2 px-3 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors border border-teal-200 text-center"
            >
              Open Text Input Box
            </button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste lab text here (e.g. Hemoglobin: 11.2 g/dL, Total Cholesterol: 228 mg/dL...)"
                rows={3}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (pastedText.trim().length >= 10) {
                      onTextSubmit(pastedText);
                    }
                  }}
                  disabled={pastedText.trim().length < 10 || isLoading}
                  className="flex-1 py-1.5 px-3 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 rounded-xl transition-colors"
                >
                  Analyze Text
                </button>
                <button
                  onClick={() => setShowPasteText(false)}
                  className="py-1.5 px-3 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
