import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Check, 
  X,
  FileCheck,
  FolderOpen
} from 'lucide-react';

export default function UploadArea({ onValidFileReady, onSelectDemoReport, isLoading = false }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];
  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

  const validateAndHandleFile = (file) => {
    setValidationError(null);

    if (!file) return;

    // 1. Extension Validation
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setValidationError(
        `Invalid file type (.${extension || 'unknown'}). Please upload a PDF, JPG, or PNG document.`
      );
      setSelectedFile(null);
      return;
    }

    // 2. Size Validation
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setValidationError(
        `File is too large (${sizeMB} MB). The maximum allowed upload size is 10 MB.`
      );
      setSelectedFile(null);
      return;
    }

    // File passed validation
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      onValidFileReady(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Validation Error Banner */}
      {validationError && (
        <div 
          role="alert"
          className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs sm:text-sm flex items-start gap-3 shadow-subtle animate-fadeIn"
        >
          <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold">Validation Notice: </strong>
            <span>{validationError}</span>
          </div>
          <button 
            onClick={() => setValidationError(null)}
            className="text-[#991B1B] hover:text-[#7F1D1D] p-1 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Drag-and-Drop Card */}
      {!selectedFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-card p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragOver 
              ? 'border-[#0D9488] bg-[#E7F5F2] scale-[1.005]' 
              : 'border-[#E5ECEA] hover:border-[#0D9488] bg-white shadow-card'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInputChange}
            disabled={isLoading}
          />

          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#E7F5F2] text-[#0D9488] flex items-center justify-center mb-4 shadow-subtle">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="font-heading font-extrabold text-xl text-[#16324A] mb-1.5">
            Let's make your report easier to understand.
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B] mb-5 max-w-sm mx-auto">
            Upload a clear image or PDF of your laboratory report.
          </p>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#EFF6F5] hover:bg-[#E7F5F2] text-[#0D9488] text-xs font-semibold rounded-btn border border-[#CCFBEF] mb-6 transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Browse Files</span>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#64748B] pt-4 border-t border-[#F1F5F9]">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F7FAF9] rounded-md border border-[#E5ECEA] font-medium text-[11px]">
              <FileText className="w-3.5 h-3.5 text-[#0D9488]" /> PDF Document
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F7FAF9] rounded-md border border-[#E5ECEA] font-medium text-[11px]">
              <ImageIcon className="w-3.5 h-3.5 text-[#0D9488]" /> JPG & PNG Image
            </span>
            <span className="px-2.5 py-1 bg-[#F7FAF9] rounded-md border border-[#E5ECEA] font-medium text-[11px]">
              Up to 10 MB
            </span>
          </div>
        </div>
      ) : (
        /* Validated File Ready State */
        <div className="bg-white rounded-card p-6 border border-[#E5ECEA] shadow-card space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#E7F5F2]/60 rounded-xl border border-[#CCFBEF]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0D9488] text-white flex items-center justify-center shadow-subtle shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading font-bold text-sm text-[#16324A] truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-[#64748B]">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedFile(null)}
              className="p-1.5 text-[#64748B] hover:text-[#16324A] rounded-lg hover:bg-white/80 transition-colors"
              title="Replace or remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleConfirmUpload}
            disabled={isLoading}
            className="w-full py-3.5 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold rounded-btn shadow-teal-glow transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
          >
            <span>Proceed to Explain Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Preset Realistic Demo Reports */}
      <div className="bg-white rounded-card p-5 border border-[#E5ECEA] shadow-subtle space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D9488]">
          <Sparkles className="w-4 h-4" />
          <span>Quick Demo: Test with Realistic Sample Lab Data</span>
        </div>
        <p className="text-xs text-[#64748B]">
          Select a realistic sample case to view the complete plain-language analysis without needing to upload your own file:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => onSelectDemoReport("rep-cbc-001")}
            className="text-left p-3.5 rounded-xl border border-[#E5ECEA] hover:border-[#0D9488] hover:bg-[#E7F5F2]/40 transition-all text-xs font-semibold text-[#16324A] flex items-center justify-between group"
          >
            <div>
              <span className="block font-heading font-bold text-sm text-[#16324A] group-hover:text-[#0D9488] transition-colors">
                Complete Blood Count (CBC)
              </span>
              <span className="text-[11px] text-[#64748B] font-normal">
                Mild anemia & low hemoglobin indicators
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          <button
            onClick={() => onSelectDemoReport("rep-lipid-002")}
            className="text-left p-3.5 rounded-xl border border-[#E5ECEA] hover:border-[#0D9488] hover:bg-[#E7F5F2]/40 transition-all text-xs font-semibold text-[#16324A] flex items-center justify-between group"
          >
            <div>
              <span className="block font-heading font-bold text-sm text-[#16324A] group-hover:text-[#0D9488] transition-colors">
                Lipid Profile (Cholesterol)
              </span>
              <span className="text-[11px] text-[#64748B] font-normal">
                Elevated LDL with protective HDL levels
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0D9488] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
