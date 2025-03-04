import React, { useState, useCallback } from 'react';
import { FileText, Upload, X, FilePlus, Send } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<{ index: number, position: 'left' | 'right' | 'middle' } | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const maxSize = 50 * 1024 * 1024; // 50 MB
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large (maximum 50 MB).`);
        return false;
      }
      return file.type === 'application/pdf';
    });

    if (validFiles.length === 0) return;

    const formData = new FormData();
    validFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/ListPDF/api/ListPDF/merge/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setFiles(prev => [...prev, ...validFiles]);

        // Get thumbnails for new files
        for (const file of validFiles) {
          const thumbnailResponse = await fetch(`/ListPDF/api/ListPDF/merge/thumbnail/${file.name}`);
		  console.log(`Fetching thumbnail for ${file.name}:`, thumbnailResponse.status);
          if (thumbnailResponse.ok) {
            const blob = await thumbnailResponse.blob();
            const thumbnailUrl = URL.createObjectURL(blob);
            setThumbnails(prev => ({ ...prev, [file.name]: thumbnailUrl }));
          }
        }
      } else if (response.status === 413) {
        alert('Files are too large. Maximum total size is 50 MB.');
      } else {
        console.error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert('An error occurred while uploading files. Please try again.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    noClick: false,
    noDragEventsBubbling: true
  });

  const removeFile = (index: number) => {
    const file = files[index];
    if (thumbnails[file.name]) {
      URL.revokeObjectURL(thumbnails[file.name]);
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
    setThumbnails(prev => {
      const newThumbnails = { ...prev };
      delete newThumbnails[file.name];
      return newThumbnails;
    });
  };

  const handleCombine = async () => {
    if (files.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/ListPDF/api/ListPDF/merge/combine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: files.map(file => file.name) })
      });

      if (response.ok) {
        const blob = await response.blob();
        if (downloadUrl) {
          URL.revokeObjectURL(downloadUrl);
        }
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      } else {
        console.error("Failed to combine PDFs.");
        alert("Failed to combine PDFs. Please try again.");
      }
    } catch (error) {
      console.error("Error combining PDFs:", error);
      alert("An error occurred while combining PDFs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFiles = () => {
    // Clean up thumbnail URLs
    Object.values(thumbnails).forEach(url => URL.revokeObjectURL(url));
    setFiles([]);
    setThumbnails({});
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      setDropTarget(null);
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relativeX = x / rect.width;

    let position: 'left' | 'right' | 'middle' = 'middle';
    if (relativeX < 0.3) position = 'left';
    else if (relativeX > 0.7) position = 'right';

    setDropTarget({ index, position });
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || !dropTarget) return;

    const newFiles = [...files];
    const [draggedFile] = newFiles.splice(draggedIndex, 1);

    let insertIndex = targetIndex;
    if (dropTarget.position === 'right') {
      insertIndex++;
    } else if (dropTarget.position === 'left') {
      // No adjustment needed for left position
    } else { // middle
      if (draggedIndex < targetIndex) {
        insertIndex--;
      }
    }

    // Ensure insertIndex is within bounds
    if (insertIndex < 0) insertIndex = 0;
    if (insertIndex > newFiles.length) insertIndex = newFiles.length;

    newFiles.splice(insertIndex, 0, draggedFile);
    setFiles(newFiles);
    setDraggedIndex(null);
    setDropTarget(null);
  };

  // Function to handle drag over the space between items
  const handleDragOverGap = (e: React.DragEvent, beforeIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === beforeIndex || draggedIndex === beforeIndex - 1) {
      setDropTarget(null);
      return;
    }

    setDropTarget({ index: beforeIndex, position: 'middle' });
  };

  const getDropIndicatorPosition = (index: number) => {
    if (!dropTarget || dropTarget.index !== index) return null;
    return dropTarget.position;
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
              Combine PDFs into one document
            </h2>

            {/* Drop Zone */}
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
                    ? "Drop your PDF files here..."
                    : "Drag and drop PDF files here or click to upload"}
              </p>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative">
                    {files.map((file, index) => (
                        <React.Fragment key={index}>
                          {/* Gap drop target before each item (except the first) */}
                          {index > 0 && (
                              <div
                                  className="absolute w-2 bg-transparent z-10 cursor-copy"
                                  style={{
                                    top: 0,
                                    bottom: 0,
                                    left: `calc(${(index % 3) * 33.33}% - 1px)`,
                                    display: dropTarget?.index === index && dropTarget?.position === 'middle' ? 'block' : 'none'
                                  }}
                                  onDragOver={(e) => handleDragOverGap(e, index)}
                                  onDrop={(e) => handleDrop(e, index)}
                              >
                                <div className="absolute top-0 bottom-0 w-0.5 bg-blue-500 left-1/2 transform -translate-x-1/2"></div>
                              </div>
                          )}

                          <div className="relative">
                            <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`
                          relative bg-white p-4 rounded-lg shadow-sm border border-gray-100
                          ${draggedIndex === index ? 'opacity-50' : ''}
                          ${draggedIndex !== null && draggedIndex !== index ? 'cursor-copy' : 'cursor-move'}
                          transition-all duration-200
                        `}
                            >
                              {thumbnails[file.name] && (
                                  <img
                                      src={thumbnails[file.name]}
                                      alt={`Preview of ${file.name}`}
                                      className="w-full h-32 object-contain mb-2"
                                  />
                              )}
                              <div className="flex items-center justify-between">
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

                            {/* Drop Indicators */}
                            {getDropIndicatorPosition(index) === 'left' && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg" />
                            )}
                            {getDropIndicatorPosition(index) === 'right' && (
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-lg" />
                            )}
                            {/*{getDropIndicatorPosition(index) === 'middle' && (
                                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
                            )}*/}
                          </div>

                          {/* Gap drop target after the last item */}
                          {index === files.length - 1 && (
                              <div
                                  className="absolute w-2 bg-transparent z-10 cursor-copy"
                                  style={{
                                    top: 0,
                                    bottom: 0,
                                    left: `calc(${((index + 1) % 3) * 33.33}% - 1px)`,
                                    display: dropTarget?.index === files.length && dropTarget?.position === 'middle' ? 'block' : 'none'
                                  }}
                                  onDragOver={(e) => handleDragOverGap(e, files.length)}
                                  onDrop={(e) => handleDrop(e, files.length)}
                              >
                                <div className="absolute top-0 bottom-0 w-0.5 bg-blue-500 left-1/2 transform -translate-x-1/2"></div>
                              </div>
                          )}
                        </React.Fragment>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={handleCombine}
                        disabled={isSubmitting}
                        className={`
                    px-6 py-2 rounded-full text-white transition-colors
                    ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'}
                  `}
                    >
                      {isSubmitting ? 'Combining...' : 'Combine Files'}
                    </button>
                    <button
                        onClick={clearFiles}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      Clear Files
                    </button>
                  </div>

                  {/* Download Link */}
                  {downloadUrl && (
                      <div className="text-center mt-6">
                        <a
                            href={downloadUrl}
                            download="combined_output.pdf"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Download Combined PDF
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

export default MergePage;