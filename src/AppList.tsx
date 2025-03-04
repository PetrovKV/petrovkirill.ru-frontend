import { FileText, Combine, Scissors, Image, FileImage, Github, ExternalLink, Send } from 'lucide-react';

function App() {
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

        {/* Hero Section */}
        <section className="pt-16 pb-24 text-center">
          <div className="container mx-auto px-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30"></div>
                <div className="relative bg-white p-4 rounded-full">
                  <FileText className="h-12 w-12 text-blue-600" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">ListPDF</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Powerful PDF tools at your fingertips. Edit, transform, and manage your PDF files with ease.
            </p>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <a href="/ListPDF/merge" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-100">
                  <div className="bg-blue-50 rounded-xl p-4 w-fit mb-4 group-hover:bg-blue-100 transition-colors">
                    <Combine className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Merge PDF Files</h3>
                  <p className="text-gray-600">Combine multiple PDF documents into a single file seamlessly.</p>
                </div>
              </a>

              <a href="/ListPDF/split" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-100">
                  <div className="bg-purple-50 rounded-xl p-4 w-fit mb-4 group-hover:bg-purple-100 transition-colors">
                    <Scissors className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Split PDF Pages</h3>
                  <p className="text-gray-600">Extract specific pages or split your PDF into multiple documents.</p>
                </div>
              </a>

              <a href="/ListPDF/pdf_to_img" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-100">
                  <div className="bg-green-50 rounded-xl p-4 w-fit mb-4 group-hover:bg-green-100 transition-colors">
                    <Image className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF to Image</h3>
                  <p className="text-gray-600">Convert PDF pages into high-quality image formats.</p>
                </div>
              </a>

              <a href="/ListPDF/img_to_pdf" className="group">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-100">
                  <div className="bg-orange-50 rounded-xl p-4 w-fit mb-4 group-hover:bg-orange-100 transition-colors">
                    <FileImage className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Image to PDF</h3>
                  <p className="text-gray-600">Transform your images into professional PDF documents.</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Problem Solved</h3>
                <p className="text-gray-600">ListPDF simplifies PDF management by providing accessible tools for editing and transforming files, making document handling effortless.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technology Stack</h3>
                <p className="text-gray-600">Built with modern web technologies including React, TypeScript, and Tailwind CSS for the frontend, with Python powering the backend processing.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Development Approach</h3>
                <p className="text-gray-600">Focused on creating an intuitive user experience with real-time processing and optimized performance for handling large files.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-600 text-sm">© 2025 ListPDF Project. All rights reserved.</p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                    href="https://t.me/KirillPetrov27"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}

export default App;