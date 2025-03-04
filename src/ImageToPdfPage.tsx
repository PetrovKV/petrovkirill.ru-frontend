import React, { useState, useCallback } from 'react';
import { FileText, Upload, FileImage, FilePlus, X, Send } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    setFiles(prev => [...prev, ...imageFiles]);

    // Create image previews
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]); // Clean up preview URL
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsSubmitting(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('/ListPDF/api/ListPDF/img_to_pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        if (response.status === 413) {
          alert('Files are too large. Maximum total size is 50 MB.');
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
        return;
      }

      // Create download URL
      const blob = await response.blob();
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFiles = () => {
    // Clean up preview URLs
    previews.forEach(preview => URL.revokeObjectURL(preview));
    setFiles([]);
    setPreviews([]);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
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
              Convert Images to PDF
            </h2>

            {/* Drop Zone */}
            <div
                {...getRootProps()}
                className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6
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
                    ? "Drop your images here..."
                    : "Drag and drop images here or click to upload"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports PNG, JPG, JPEG, GIF, and WebP
              </p>
            </div>

            {/* Image Previews */}
            {files.length > 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                        >
                          <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                            <img
                                src={previews[index]}
                                alt={`Preview ${index + 1}`}
                                className="object-contain w-full h-full"
                            />
                          </div>
                          <div className="p-3 flex items-center justify-between bg-white">
                      <span className="text-sm text-gray-600 truncate">
                        {file.name}
                      </span>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={handleConvert}
                        disabled={isSubmitting}
                        className={`
                    px-6 py-3 rounded-lg flex items-center space-x-2
                    ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'} 
                    text-white transition-colors
                  `}
                    >
                      <FileImage className="h-5 w-5" />
                      <span>{isSubmitting ? 'Converting...' : 'Convert to PDF'}</span>
                    </button>
                    <button
                        onClick={clearFiles}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Download Link */}
                  {downloadUrl && (
                      <div className="text-center mt-6">
                        <a
                            href={downloadUrl}
                            download="converted_images.pdf"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Download PDF
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

export default ImageToPdfPage;