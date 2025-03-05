import React from 'react';
import { Github, Mail, Linkedin, Menu, X, Code2, Briefcase, User, ExternalLink, createIcons, icons, Send } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 font-bold text-2xl">
              KP<span className="text-blue-500">.</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
                <a href="#skills" className="hover:text-blue-400 transition-colors">Skills</a>
                <a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a>
                <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-700"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
              <a href="#about" className="block px-3 py-2 hover:bg-gray-700 rounded-md">About</a>
              <a href="#skills" className="block px-3 py-2 hover:bg-gray-700 rounded-md">Skills</a>
              <a href="#projects" className="block px-3 py-2 hover:bg-gray-700 rounded-md">Projects</a>
              <a href="#contact" className="block px-3 py-2 hover:bg-gray-700 rounded-md">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">
              Kirill Petrov
              <span className="block text-blue-400 mt-2">Full Stack Developer</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Crafting exceptional digital experiences through innovative web solutions and creative development.
            </p>
            <div className="flex space-x-4">
              <a href="#contact" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Get in Touch
              </a>
              <a href="#projects" className="border border-white/20 hover:border-blue-400 px-6 py-3 rounded-lg font-medium transition-colors">
                View Projects
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img 
                src="/my-photo.jpg"
                alt="Professional headshot"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-blue-600 rounded-2xl p-6 shadow-xl">
              <div className="text-3xl font-bold">5+</div>
              <div className="text-sm opacity-80">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">Technical Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Code2 size={32} className="text-blue-400" />,
              title: "Frontend Development",
              skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"]
            },
            {
              icon: <Briefcase size={32} className="text-blue-400" />,
              title: "Backend Development",
              skills: ["Node.js", "Python", "PostgreSQL", "REST APIs"]
            },
            {
              icon: <User size={32} className="text-blue-400" />,
              title: "Other Skills",
              skills: ["UI/UX Design", "DevOps", "Agile", "Git"]
            }
          ].map((category, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold mb-4">{category.title}</h3>
              <ul className="space-y-2">
                {category.skills.map((skill, skillIndex) => (
                  <li key={skillIndex} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "ListPDF",
              description: "Toolkit for working with pdf files",
              image: "https://images.unsplash.com/photo-1485988412941-77a35537dae4?q=80&w=2096&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              link: "/ListPDF"
            },
            {
              title: "TradeForm",
              description: "Web application for viewing the history of securities sales",
              image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2940&auto=format&fit=crop",
              link: "/TradeForm"
            },
            {
              title: "in progress...",
              description: "in progress...",
              image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2940&auto=format&fit=crop",
              link: "/404"
            }
          ].map((project, index) => (
            <div key={index} className="group relative rounded-xl overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                    <span>View Project</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-4xl font-bold mb-8 text-center">Get in Touch</h2>
          <div className="flex justify-center space-x-6">
            <a href="https://t.me/KirillPetrov27" className="p-4 bg-gray-700 rounded-full hover:bg-blue-600 transition-colors">
              <Send size={24} />
            </a>
            <a href="https://github.com/PetrovKV" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-700 rounded-full hover:bg-blue-600 transition-colors">
              <Github size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-4 bg-gray-700 rounded-full hover:bg-blue-600 transition-colors">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center text-gray-400">
          © {new Date().getFullYear()} Kirill Petrov. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;