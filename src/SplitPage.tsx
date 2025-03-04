import React, { useState, useCallback } from 'react';
import { FileText, Upload, Scissors, FilePlus, Send } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile?.type === 'application/pdf') {
      setFile(pdfFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const handleSplit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('start_page', startPage.toString());
    formData.append('end_page', endPage.toString());

    try {
      const response = await fetch('/ListPDF/api//ListPDF/split/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 413) {
          alert('File is too large. Maximum size is 50 MB.');
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
        return;
      }

      // Create and trigger download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `split_${file.name}`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
      link.remove();
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setStartPage(1);
    setEndPage(1);
  };

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <a href="/" className="text-gray-900 font-medium hover:text-blue-600 transition-colors">
                Developer
              </a>
              <a
                  href="https://t.me/KirillPetrov27"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                Telegram
              </a>
            </div>
          </div>
        </header>

        {/* Logo Section */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-6">
            <a href="/ListPDF" className="flex items-center justify-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30"></div>
                <div className="relative bg-white p-3 rounded-full">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">ListPDF</h1>
            </a>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Extract specific pages or split PDF into separate files
            </h2>

            {/* Drop Zone */}
            {!file && (
                <div
                    {...getRootProps()}
                    className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors duration-200
                ${isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
              `}
                >
                  <input {...getInputProps()} />
                  <FilePlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    {isDragActive
                        ? "Drop your PDF file here..."
                        : "Drag and drop a PDF file here or click to upload"}
                  </p>
                </div>
            )}

            {/* Selected File and Controls */}
            {file && (
                <form onSubmit={handleSplit} className="space-y-6">
                  {/* File Display */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-700">{file.name}</span>
                      </div>
                      <button
                          type="button"
                          onClick={clearFile}
                          className="text-sm px-3 py-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Page Range Controls */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="startPage" className="block text-sm font-medium text-gray-700 mb-1">
                          Start Page
                        </label>
                        <input
                            type="number"
                            id="startPage"
                            min="1"
                            value={startPage}
                            onChange={(e) => {
                              const value = Math.max(1, parseInt(e.target.value) || 1);
                              setStartPage(value);
                              setEndPage(Math.max(value, endPage));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                      </div>
                      <div>
                        <label htmlFor="endPage" className="block text-sm font-medium text-gray-700 mb-1">
                          End Page
                        </label>
                        <input
                            type="number"
                            id="endPage"
                            min={startPage}
                            value={endPage}
                            onChange={(e) => setEndPage(Math.max(startPage, parseInt(e.target.value) || startPage))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                      </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                    w-full mt-4 px-6 py-3 rounded-lg flex items-center justify-center space-x-2
                    ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'} 
                    text-white transition-colors
                  `}
                    >
                      <Scissors className="h-5 w-5" />
                      <span>{isSubmitting ? 'Processing...' : 'Split PDF'}</span>
                    </button>
                  </div>
                </form>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
          <div className="container mx-auto px-4 py-8">
            <p className="text-gray-600 text-sm text-center">
              © 2025 ListPDF Project. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
  );
}

export default SplitPage;