import React from 'react';

const HomePage = () => (
  <div className="relative z-10">
    {/* Navbar */}
    <nav className="flex justify-between items-center py-6 bg-black/70 backdrop-blur-md rounded-xl shadow-lg sticky top-0 z-30" style={{marginLeft: 40, marginRight: 40, paddingLeft: 50, paddingRight: 50,paddingBottom: 30}}>
      <div className="flex items-center gap-6">
        <img src="vscode-logo.png" alt="Visual Studio Code Logo" className="w-10 h-10" />
        <span className="text-2xl font-bold text-white tracking-wide">Visual Studio Code</span>
        <div className="flex gap-4 ml-8">
          {['Docs', 'Updates', 'Blog', 'API', 'Extensions', 'FAQs', 'MCP'].map((item) => (
            <span
              key={item}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium px-2 py-1 rounded-md hover:bg-white/10"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search Docs"
          className="w-56 h-9 rounded-md px-3 bg-gray-900 text-white placeholder-gray-400 text-base focus:outline-none border border-gray-700"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow transition-colors">Download</button>
      </div>
    </nav>

    {/* Header */}
    <header className="text-center mt-20 select-none">
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white drop-shadow-lg leading-tight">The open source</h1>
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-blue-400 drop-shadow-lg leading-tight mt-2">AI Code Editor</h1>
    </header>

    {/* Main Content */}
    <main className="text-center mt-12">
      <section>
        <a
          href="https://code.visualstudio.com/docs/?dv=win64user"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg text-lg shadow-lg mb-4 inline-block"
        >
          Download for Windows
        </a>
        <p className="text-gray-200 mt-2">Web, Insiders edition, or other platforms</p>
        <p className="text-gray-400 text-sm mt-1">By using VS Code, you agree to its license and privacy statement.</p>
      </section>
      <section className="flex justify-center mt-10">
        <img src="home-screenshot.png" alt="Visual Studio Code Editor" className="w-4/5 max-w-4xl rounded-xl shadow-2xl border border-gray-800" />
      </section>
    </main>

    {/* Footer */}
    <footer className="text-center mt-12 mb-4">
      <p className="text-gray-500">&copy; 2023 My Web Page</p>
    </footer>
  </div>
);

export default HomePage; 