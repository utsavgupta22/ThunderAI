import React from 'react'
import MessageRenderer from './MessageRenderer'
import ProcessingIndicator from './ProcessingIndicator'

function ChatWindow({ messages, messagesEndRef, loading, processingStage, processingDetails }) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 neon-theme:from-[#0a150c] neon-theme:to-[#142018]">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
          <div className="mb-6">
            <span className="text-6xl">🤖</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
            <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#142018] border border-gray-200 dark:border-slate-600 neon-theme:border-[#39ff14] rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer hover:scale-105 transform">
              <div className="text-2xl mb-2">🐛</div>
              <p className="text-gray-700 dark:text-gray-300 neon-theme:text-[#8ffa70] font-medium text-sm">Find bugs in your code</p>
            </div>
            <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#142018] border border-gray-200 dark:border-slate-600 neon-theme:border-[#39ff14] rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer hover:scale-105 transform">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-gray-700 dark:text-gray-300 neon-theme:text-[#8ffa70] font-medium text-sm">Optimize performance</p>
            </div>
            <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#142018] border border-gray-200 dark:border-slate-600 neon-theme:border-[#39ff14] rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer hover:scale-105 transform">
              <div className="text-2xl mb-2">💡</div>
              <p className="text-gray-700 dark:text-gray-300 neon-theme:text-[#8ffa70] font-medium text-sm">Get code explanations</p>
            </div>
            <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#142018] border border-gray-200 dark:border-slate-600 neon-theme:border-[#39ff14] rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer hover:scale-105 transform">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-gray-700 dark:text-gray-300 neon-theme:text-[#8ffa70] font-medium text-sm">Best practices tips</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 neon-theme:from-[#39ff14] neon-theme:to-[#baffc9] rounded-full flex items-center justify-center flex-shrink-0 border border-gray-300 dark:border-slate-600 neon-theme:border-[#39ff14] shadow-sm">
                  <span className="text-sm">🤖</span>
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 shadow-sm border break-words ${
                  message.sender === 'user'
                    ? 'bg-blue-600 dark:bg-blue-700 neon-theme:bg-[#39ff14] text-white dark:text-white neon-theme:text-[#101d12] border-blue-600 dark:border-blue-700 neon-theme:border-[#39ff14]'
                    : 'bg-white dark:bg-slate-700 neon-theme:bg-[#142018] text-gray-800 dark:text-gray-200 neon-theme:text-[#8ffa70] border-gray-200 dark:border-slate-600 neon-theme:border-[#39ff14]'
                }`}
              >
                {message.sender === 'user' ? (
                  <p className="whitespace-pre-wrap leading-relaxed break-words">{message.text}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <MessageRenderer content={message.text} />
                  </div>
                )}
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 neon-theme:from-[#39ff14] neon-theme:to-[#baffc9] rounded-full flex items-center justify-center flex-shrink-0 border border-gray-300 dark:border-slate-600 neon-theme:border-[#39ff14] shadow-sm">
                  <span className="text-sm">👤</span>
                </div>
              )}
            </div>
          ))}
          {loading && processingStage && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 neon-theme:from-[#39ff14] neon-theme:to-[#baffc9] rounded-full flex items-center justify-center flex-shrink-0 border border-gray-300 dark:border-slate-600 neon-theme:border-[#39ff14] shadow-sm">
                <span className="text-sm">🤖</span>
              </div>
              <div className="max-w-[85%] flex-1">
                <ProcessingIndicator stage={processingStage} details={processingDetails} />
              </div>
            </div>
          )}
          {loading && !processingStage && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 neon-theme:from-[#39ff14] neon-theme:to-[#baffc9] rounded-full flex items-center justify-center flex-shrink-0 border border-gray-300 dark:border-slate-600 neon-theme:border-[#39ff14] shadow-sm">
                <span className="text-sm">🤖</span>
              </div>
              <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#142018] rounded-lg px-4 py-3 shadow-sm border border-gray-200 dark:border-slate-600 neon-theme:border-[#39ff14] max-w-[85%]">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 neon-theme:bg-[#39ff14] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 neon-theme:bg-[#39ff14] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 neon-theme:bg-[#39ff14] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 neon-theme:text-[#8ffa70]">AI is analyzing your code...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}

export default ChatWindow
