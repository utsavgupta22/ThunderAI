import React, { useState } from 'react'

function UploadedFilesList({ files, onRemoveFile, onClearAll }) {
  const [showModal, setShowModal] = useState(false)

  if (files.length === 0) return null

  return (
    <>
      <div className="bg-white dark:bg-slate-700 neon-theme:bg-[#1a2f1d] rounded-xl shadow-sm border border-gray-200 dark:border-slate-600 neon-theme:border-[#39ff14] p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-white neon-theme:text-[#39ff14] flex items-center gap-2">
            <span className="text-gray-700 dark:text-white neon-theme:text-[#39ff14]">📄</span>
            Uploaded Files
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-100 dark:bg-blue-900 neon-theme:bg-[#142a18] text-blue-700 dark:text-blue-200 neon-theme:text-[#39ff14] px-2 py-1 rounded-full font-medium">
              {files.length}
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="text-xs bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 neon-theme:bg-[#1a2f1d] neon-theme:hover:bg-[#142a18] text-blue-700 dark:text-blue-200 neon-theme:text-[#39ff14] px-2 py-1 rounded transition flex items-center gap-1"
              title="Show all files"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* Modal for showing all files */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div 
            className="bg-white dark:bg-slate-800 neon-theme:bg-[#1a2f1d] rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 neon-theme:border-[#39ff14] max-w-2xl w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 neon-theme:border-[#39ff14]">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📄</span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white neon-theme:text-[#39ff14]">
                  Uploaded Files ({files.length})
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 neon-theme:hover:bg-[#142a18] rounded-lg transition"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 neon-theme:text-[#baffc9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* File list with scroll */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 neon-theme:bg-[#142a18] p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 neon-theme:hover:bg-[#1a2f1d] transition group"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 neon-theme:text-[#8ffa70] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-700 dark:text-gray-200 neon-theme:text-[#baffc9] truncate">{file}</span>
                    </div>
                    <button
                      onClick={() => onRemoveFile(file)}
                      className="ml-2 p-1.5 text-gray-400 dark:text-gray-500 neon-theme:text-[#8ffa70] hover:bg-red-100 dark:hover:bg-red-900/20 neon-theme:hover:bg-[#2a1a1a] hover:text-red-600 dark:hover:text-red-400 neon-theme:hover:text-[#ff4444] rounded transition opacity-0 group-hover:opacity-100 flex-shrink-0"
                      title="Remove file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-slate-700 neon-theme:border-[#39ff14]">
              <button
                onClick={() => {
                  onClearAll()
                  setShowModal(false)
                }}
                className="px-4 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 neon-theme:bg-[#2a1a1a] neon-theme:hover:bg-[#1a1010] text-red-700 dark:text-red-200 neon-theme:text-[#ff6b6b] rounded-lg transition flex items-center gap-2 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All Files
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 neon-theme:bg-[#142a18] neon-theme:hover:bg-[#1a2f1d] text-gray-700 dark:text-gray-200 neon-theme:text-[#baffc9] rounded-lg transition text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UploadedFilesList
