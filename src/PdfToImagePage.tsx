import React, { useState, useCallback } from 'react';
import { FileText, Upload, Image as ImageIcon, FilePlus, Send } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile?.type === 'application/pdf') {
      setFile(pdfFile);
      // Reset preview when new file is uploaded
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
      }
    }
  }, [previewImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('page_number', pageNumber.toString());

    try {
      const response = await fetch('/ListPDF/api//ListPDF/pdf_to_img', {
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

      // Create preview image
      const blob = await response.blob();
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      const imageUrl = URL.createObjectURL(blob);
      setPreviewImage(imageUrl);
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPageNumber(1);
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }
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
              Convert PDF Pages to Images
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
                <div className="space-y-6">
                  {/* File Display */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-700">{file.name}</span>
                      </div>
                      <button
                          onClick={clearFile}
                          className="text-sm px-3 py-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Page Number Control */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <form onSubmit={handleConvert} className="space-y-4">
                      <div>
                        <label htmlFor="pageNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Page Number
                        </label>
                        <input
                            type="number"
                            id="pageNumber"
                            min="1"
                            value={pageNumber}
                            onChange={(e) => setPageNumber(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <button
                          type=" submit"
                          disabled={isSubmitting}
                          className={`
                      w-full px-6 py-3 rounded-lg flex items-center justify-center space-x-2
                      ${isSubmitting
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600'} 
                      text-white transition-colors
                    `}
                      >
                        <ImageIcon className="h-5 w-5" />
                        <span>{isSubmitting ? 'Converting...' : 'Convert to Image'}</span>
                      </button>
                    </form>
                  </div>

                  {/* Image Preview */}
                  {previewImage && (
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Image</h3>
                        <div className="relative border border-gray-200 rounded-lg overflow-hidden">
                          <img
                              src={previewImage}
                              alt="Converted PDF page"
                              className="w-full h-auto"
                          />
                        </div>
                        <a
                            href={previewImage}
                            download={`page-${pageNumber}.png`}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Download Image
                        </a>
                      </div>
                  )}
                </div>
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

export default PdfToImagePage;