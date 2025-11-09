import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MessageRenderer = ({ content }) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect theme from DOM
  useEffect(() => {
    const detectTheme = () => {
      const html = document.documentElement;
      const isDark = html.classList.contains('dark-theme') || html.classList.contains('neon-theme');
      setIsDarkMode(isDark);
    };

    // Initial detection
    detectTheme();

    // Watch for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="message-content">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const codeIndex = `${codeString.substring(0, 20)}-${Math.random()}`;

            if (!inline && match) {
              return (
                <div className="code-block-wrapper relative my-4">
                  <div className="code-block-header flex justify-between items-center px-4 py-2 bg-gray-800 dark:bg-gray-900 rounded-t-lg">
                    <span className="text-sm text-gray-300 font-mono">
                      {match[1]}
                    </span>
                    <button
                      onClick={() => handleCopyCode(codeString, codeIndex)}
                      className="copy-button flex items-center gap-2 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                    >
                      {copiedCode === codeIndex ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={isDarkMode ? vscDarkPlus : vs}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-b-lg"
                    customStyle={{
                      margin: 0,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // Inline code
            return (
              <code
                className="inline-code px-1.5 py-0.5 mx-0.5 bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-400 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Style other markdown elements
          p({ children }) {
            return <p className="mb-3 leading-relaxed text-gray-800 dark:text-gray-200 neon-theme:text-[#baffc9]">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside mb-3 ml-4 text-gray-700 dark:text-gray-300 neon-theme:text-[#8ffa70]">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside mb-3 ml-4 text-gray-700 dark:text-gray-300 neon-theme:text-[#8ffa70]">{children}</ol>;
          },
          li({ children }) {
            return <li className="mb-1">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold mb-3 mt-4 text-blue-700 dark:text-blue-400 neon-theme:text-[#39ff14]">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold mb-3 mt-3 text-indigo-700 dark:text-indigo-400 neon-theme:text-[#39ff14]">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-bold mb-2 mt-3 text-purple-700 dark:text-purple-400 neon-theme:text-[#39ff14]">{children}</h3>;
          },
          strong({ children }) {
            return <strong className="font-bold text-pink-700 dark:text-pink-400 neon-theme:text-[#39ff14]">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic text-cyan-700 dark:text-cyan-400 neon-theme:text-[#baffc9]">{children}</em>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-gray-400 dark:border-gray-600 pl-4 italic my-3 text-gray-700 dark:text-gray-300">
                {children}
              </blockquote>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
            );
          },
          th({ children }) {
            return (
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MessageRenderer;
