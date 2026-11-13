import React from 'react';

/**
 * Safe, zero-dependency Markdown renderer for ReportSaathi.
 * Parses headings, bullet lists, numbered lists, bold text, and paragraphs
 * into native React elements without dangerouslySetInnerHTML.
 */
export default function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  // Helper to parse inline bold and italic tokens
  const renderInline = (text, keyPrefix) => {
    // Regex matches **bold** or *italic*
    const parts = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    let lastIndex = 0;
    let match;
    let tokenIdx = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const raw = match[0];
      if (raw.startsWith('**') && raw.endsWith('**')) {
        parts.push(
          <strong key={`${keyPrefix}-b-${tokenIdx++}`} className="font-semibold text-[#0a3d36]">
            {raw.slice(2, -2)}
          </strong>
        );
      } else if (raw.startsWith('*') && raw.endsWith('*')) {
        parts.push(
          <em key={`${keyPrefix}-i-${tokenIdx++}`} className="italic">
            {raw.slice(1, -1)}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Split into lines and group into structural blocks
  const lines = content.split('\n');
  const blocks = [];
  let currentList = null; // { type: 'ul' | 'ol', items: [] }

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Heading 3: ###
    if (trimmed.startsWith('### ')) {
      flushList();
      blocks.push({
        type: 'h3',
        text: trimmed.slice(4).trim()
      });
      continue;
    }

    // Heading 2: ##
    if (trimmed.startsWith('## ')) {
      flushList();
      blocks.push({
        type: 'h2',
        text: trimmed.slice(3).trim()
      });
      continue;
    }

    // Heading 1: #
    if (trimmed.startsWith('# ')) {
      flushList();
      blocks.push({
        type: 'h1',
        text: trimmed.slice(2).trim()
      });
      continue;
    }

    // Bullet list item: - or *
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.slice(2).trim();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(itemText);
      continue;
    }

    // Numbered list item: 1. 2. etc
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      const itemText = numMatch[2].trim();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(itemText);
      continue;
    }

    // Plain paragraph text
    flushList();
    blocks.push({
      type: 'p',
      text: trimmed
    });
  }

  flushList();

  return (
    <div className={`space-y-2.5 text-xs sm:text-sm leading-relaxed ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'h3') {
          return (
            <h4 key={bIdx} className="font-heading font-bold text-sm sm:text-base text-[#0a3d36] pt-1">
              {renderInline(block.text, `h3-${bIdx}`)}
            </h4>
          );
        }

        if (block.type === 'h2' || block.type === 'h1') {
          return (
            <h3 key={bIdx} className="font-heading font-bold text-base text-[#0a3d36] pt-1.5">
              {renderInline(block.text, `h2-${bIdx}`)}
            </h3>
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={bIdx} className="space-y-1.5 pl-3 border-l-2 border-[#dce8dc] my-1.5">
              {block.items.map((it, itIdx) => (
                <li key={itIdx} className="text-[#2d3748] flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#084d46] mt-1.5 shrink-0" />
                  <span>{renderInline(it, `ul-${bIdx}-${itIdx}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={bIdx} className="space-y-1.5 pl-4 list-decimal marker:text-[#084d46] marker:font-semibold my-1.5">
              {block.items.map((it, itIdx) => (
                <li key={itIdx} className="text-[#2d3748]">
                  {renderInline(it, `ol-${bIdx}-${itIdx}`)}
                </li>
              ))}
            </ol>
          );
        }

        // Paragraph
        return (
          <p key={bIdx} className="text-[#2d3748]">
            {renderInline(block.text, `p-${bIdx}`)}
          </p>
        );
      })}
    </div>
  );
}
