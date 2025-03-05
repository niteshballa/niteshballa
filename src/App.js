import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Terminal, Command, Folder, User, Github, Mail, Linkedin, X, Minus, Maximize2, Sun, Moon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Simulated file system
const fileSystem = {
  '~': {
    type: 'directory',
    content: {
      'welcome.txt': {
        type: 'file',
        content: 'Welcome to my portfolio terminal!\nType "help" to see available commands.'
      },
      'about.md': {
        type: 'file',
        content: '# About Me\nI\'m a systems programmer and DevOps engineer passionate about building efficient, scalable systems.'
      },
      'projects': {
        type: 'directory',
        content: {
          'README.md': {
            type: 'file',
            content: '# My Projects\nHere are some of my recent projects:'
          }
        }
      },
      'contact.sh': {
        type: 'file',
        content: '#!/bin/bash\necho "You can reach me at:"\necho "- Github: @username"\necho "- Email: email@example.com"'
      }
    }
  }
};

const availableCommands = {
  help: { desc: 'Show available commands and their usage' },
  ls: { desc: 'List directory contents', usage: 'ls [directory]' },
  cd: { desc: 'Change directory', usage: 'cd [directory]' },
  cat: { desc: 'Show file contents', usage: 'cat <file>' },
  clear: { desc: 'Clear terminal screen' },
  theme: { desc: 'Toggle light/dark theme' },
  about: { desc: 'Show about information' },
  projects: { desc: 'List projects' },
  contact: { desc: 'Show contact information' },
  pwd: { desc: 'Print working directory' },
  tab: { desc: 'Switch between tabs', usage: 'tab [tab name]' }
};

// Updated colorizeOutput function
const colorizeOutput = (output) => {
  // Early return if not a string
  if (typeof output !== 'string') return output;

  // Replace common terminal patterns with span-wrapped colored versions
  return output
    // Colorize directory listings permissions
    .replace(/^(d[rwx-]{9})/gm, '<span class="dir-permissions">$1</span>')
    .replace(/^(-[rwx-]{9})/gm, '<span class="dir-permissions">$1</span>')

    // Colorize directory names (must be done before file names)
    .replace(/(\s+)(\w+)(\/)?(\s|$)/g, function (match, space, name, slash, end) {
      if (slash) {
        return `${space}<span class="directory">${name}/</span>${end}`;
      }
      return match;
    })

    // Colorize files with extensions
    .replace(/(\s+)(\w+\.\w+)(\s|$)/g, '$1<span class="file">$2</span>$3')

    // Colorize paths
    .replace(/(~\/[\w\/.-]+)/g, '<span class="path">$1</span>')

    // Colorize success messages
    .replace(/(successfully|done|completed|switched)/gi, '<span class="success">$1</span>')

    // Preserve existing HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;span class="([^"]+)"&gt;/g, '<span class="$1">')
    .replace(/&lt;\/span&gt;/g, '</span>');
};

const App = () => {
  // Enhanced Loading state that properly handles the new terminal loader
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // This is for the main terminal content loading

  // Loader animation states
  const [textOutput, setTextOutput] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [commandIndex, setCommandIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadChar, setLoadChar] = useState(0);

  // State management
  const [commandHistory, setCommandHistory] = useState([]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(-1);
  const [currentInput, setCurrentInput] = useState('');
  const [activeTab, setActiveTab] = useState('main');
  const [currentDirectory, setCurrentDirectory] = useState('~');
  const [theme, setTheme] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const [isMinimized, setIsMinimized] = useState(false);
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: '95%', height: '80vh' });
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState(null);
  const [lastTabPressTime, setLastTabPressTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // ASCII art logo for loader
  const asciiLogo = [
    '   ███╗   ██╗██╗████████╗███████╗███████╗██╗  ██╗',
    '   ████╗  ██║██║╚══██╔══╝██╔════╝██╔════╝██║  ██║',
    '   ██╔██╗ ██║██║   ██║   █████╗  ███████╗███████║',
    '   ██║╚██╗██║██║   ██║   ██╔══╝  ╚════██║██╔══██║',
    '   ██║ ╚████║██║   ██║   ███████╗███████║██║  ██║',
    '   ╚═╝  ╚═══╝╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═╝',
  ];

  // Loading commands sequence
  const loadingCommands = [
    'ssh -i credentials nitesh@portfolio.dev'
  ];

  // Command responses
  const commandResponses = [
    [
      '> System initialization sequence started...',
      '> System core initialized successfully'
    ],
    [
      '> Mounting portfolio filesystem...',
      '> /dev/skills mounted at /mnt/portfolio',
      '> Checking filesystem integrity... OK'
    ],
    [
      '> Starting portfolio services...',
      '> Service: frontend-experience [STARTED]',
      '> Service: backend-systems [STARTED]',
      '> Service: devops-pipeline [STARTED]',
      '> All services running'
    ],
    [
      '> Establishing encrypted connection...',
      '> Verifying credentials... success',
      '> Welcome to Nitesh\'s portfolio environment!',
      '> Launching interface...'
    ]
  ];

  // Magic 8-bit style loading characters
  const loadingChars = ['▰', '▱'];

  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const terminalContentRef = useRef(null);

  // Terminal tabs configuration
  const tabs = [
    { id: 'main', title: 'main.zsh', icon: <Terminal size={14} /> },
    { id: 'projects', title: 'projects.md', icon: <Folder size={14} /> },
    { id: 'about', title: 'about.md', icon: <User size={14} /> },
    { id: 'contact', title: 'contact.sh', icon: <Mail size={14} /> }
  ];

  // Skills data
  const skills = [
    { name: 'Rust', level: 90, color: '#fab387' },
    { name: 'Haskell', level: 85, color: '#f5c2e7' },
    { name: 'Kubernetes', level: 88, color: '#89b4fa' },
    { name: 'Docker', level: 92, color: '#74c7ec' },
    { name: 'Terraform', level: 87, color: '#cba6f7' },
    { name: 'AWS/Azure', level: 85, color: '#f9e2af' }
  ];

  // Projects data
  const projects = [
    {
      id: 1,
      title: "Rust Backend Service",
      description: "High-performance API service with Kubernetes deployment",
      tags: ["Rust", "Kubernetes", "API"],
      link: "https://github.com/username/rust-service"
    },
    {
      id: 2,
      title: "Cloud Infrastructure",
      description: "Multi-cloud infrastructure setup with Terraform",
      tags: ["AWS", "Azure", "Terraform"],
      link: "https://github.com/username/cloud-infra"
    },
    {
      id: 3,
      title: "Haskell Data Processor",
      description: "Functional data processing pipeline for analytics",
      tags: ["Haskell", "Functional", "Data"],
      link: "https://github.com/username/haskell-processor"
    }
  ];

  // Social links data
  const socialLinks = [
    { name: 'Github', icon: <Github size={16} />, url: 'https://github.com/username' },
    { name: 'LinkedIn', icon: <Linkedin size={16} />, url: 'https://linkedin.com/in/username' },
    { name: 'Email', icon: <Mail size={16} />, url: 'mailto:email@example.com' }
  ];

  // Loader animation functions
  const typeCommand = (command, stepIndex) => {
    let i = 0;
    setTextOutput(prev => [...prev, { text: '', type: 'command' }]);

    const interval = setInterval(() => {
      i++;
      setTextOutput(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { text: command.substring(0, i), type: 'command' };
        return updated;
      });

      if (i >= command.length) {
        clearInterval(interval);
        setTimeout(() => {
          displayCommandResponse(stepIndex);
        }, 100);
      }
    }, 8);
  };

  const displayCommandResponse = (stepIndex) => {
    const responses = commandResponses[stepIndex];
    let lineIndex = 0;

    const showNextLine = () => {
      if (lineIndex < responses.length) {
        setTextOutput(prev => [...prev, { text: responses[lineIndex], type: 'response' }]);
        lineIndex++;
        setTimeout(showNextLine, 80);
      } else {
        setTimeout(() => {
          setCommandIndex(prev => prev + 1);
          setShowPrompt(true);
          setProgress(prev => prev + (100 / loadingCommands.length));
        }, 100);
      }
    };

    showNextLine();
  };

  // Terminal commands implementation
  const commands = {
    help: () => {
      const helpContent = Object.entries(availableCommands)
        .map(([cmd, info]) => `
          <div>
            <span class="help-command">${cmd}</span> - 
            <span class="help-description">${info.desc}</span>
            ${info.usage ? `<div class="help-usage">Usage: ${info.usage}</div>` : ''}
          </div>
        `).join('');

      return {
        output: `<div>Available commands:</div>${helpContent}<div>Keyboard shortcuts:</div>` +
          '<div>Ctrl + C    Interrupt current command</div>' +
          '<div>Ctrl + L    Clear screen</div>' +
          '<div>Tab         Command completion</div>' +
          '<div>↑/↓         Navigate command history</div>'
      };
    },

    // Updated LS command implementation
    ls: (args) => {
      const path = args[0] || currentDirectory;
      const dir = getDirectoryFromPath(path);
      if (!dir || dir.type !== 'directory') {
        return { error: `ls: ${path}: No such directory` };
      }

      // Plain text output that will be colorized after
      const listings = Object.entries(dir.content)
        .map(([name, item]) => {
          const isDir = item.type === 'directory';
          const permissions = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
          return `${permissions}  ${name}`;
        })
        .join('\n');

      return { output: listings };
    },

    cd: (args) => {
      const path = args[0] || '~';
      const dir = getDirectoryFromPath(path);
      if (!dir || dir.type !== 'directory') {
        return { error: `cd: ${path}: No such directory` };
      }
      setCurrentDirectory(path);
      return { output: `<span class="success">Changed directory to</span> <span class="path">${path}</span>` };
    },

    cat: (args) => {
      if (!args.length) return { error: 'cat: missing file operand' };
      const file = getFileFromPath(args[0]);
      if (!file || file.type !== 'file') {
        return { error: `cat: ${args[0]}: No such file` };
      }

      // Format Markdown-like content
      let content = file.content;

      // Apply basic markdown formatting
      content = content
        .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
        .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
        .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="md-code">$1</code>')
        .replace(/^- (.+)$/gm, '<div class="md-list-item">• $1</div>');

      return { output: content };
    },

    clear: () => {
      setCommandHistory([]);
      return { output: '' };
    },

    theme: () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      return { output: `<span class="success">Switched to ${newTheme} theme</span>` };
    },

    pwd: () => ({
      output: `<span class="path">${currentDirectory}</span>`
    }),

    tab: (args) => {
      if (!args.length) return { error: 'tab: missing tab name' };

      const tabName = args[0].toLowerCase();
      const validTabs = tabs.map(tab => tab.id);

      if (!validTabs.includes(tabName)) {
        return { error: `tab: ${tabName}: No such tab. Available tabs: ${validTabs.join(', ')}` };
      }

      setActiveTab(tabName);
      return { output: `<span class="success">Switched to ${tabName} tab</span>` };
    },

    about: () => {
      setActiveTab('about');
      return { output: '<span class="success">Switched to about tab</span>' };
    },

    projects: () => {
      setActiveTab('projects');
      return { output: '<span class="success">Switched to projects tab</span>' };
    },

    contact: () => {
      setActiveTab('contact');
      return { output: '<span class="success">Switched to contact tab</span>' };
    }
  };

  // File system utilities
  const getDirectoryFromPath = (path) => {
    if (path === '~') return fileSystem['~'];
    const parts = path.split('/').filter(Boolean);
    let current = fileSystem['~'];
    for (const part of parts) {
      if (!current.content[part] || current.content[part].type !== 'directory') {
        return null;
      }
      current = current.content[part];
    }
    return current;
  };

  const getFileFromPath = (path) => {
    const parts = path.split('/').filter(Boolean);
    const fileName = parts.pop();
    const dirPath = parts.length ? parts.join('/') : currentDirectory;
    const dir = getDirectoryFromPath(dirPath);
    if (!dir || !dir.content || !dir.content[fileName]) {
      return null;
    }
    return dir.content[fileName];
  };

  // Find longest common prefix helper function
  const findLongestCommonPrefix = (strings) => {
    if (!strings || strings.length === 0) return '';
    if (strings.length === 1) return strings[0];

    // Sort strings to optimize for finding the prefix between first and last
    const sortedStrings = [...strings].sort();
    const firstString = sortedStrings[0];
    const lastString = sortedStrings[sortedStrings.length - 1];

    let i = 0;
    while (i < firstString.length && firstString.charAt(i) === lastString.charAt(i)) {
      i++;
    }

    return firstString.substring(0, i);
  };

  // Command completion
  const getCommandSuggestions = (input) => {
    if (!input.trim()) return [];

    const [cmd, ...args] = input.trim().split(' ');
    if (args.length === 0) {
      return Object.keys(availableCommands).filter(command =>
        command.toLowerCase().startsWith(cmd.toLowerCase())
      );
    }

    // Path completion for commands that accept file/directory args
    if (['cat', 'cd', 'ls'].includes(cmd.toLowerCase())) {
      // Simple path completion - could be enhanced further
      const dir = getDirectoryFromPath(currentDirectory);
      if (dir && dir.content) {
        const partialPath = args[0] || '';
        return Object.keys(dir.content)
          .filter(name => name.startsWith(partialPath))
          .map(name => `${cmd} ${name}`);
      }
    }

    // Tab completion
    if (cmd.toLowerCase() === 'tab' && args.length <= 1) {
      const partialTab = args[0] || '';
      return tabs
        .map(tab => tab.id)
        .filter(tabId => tabId.startsWith(partialTab))
        .map(tabId => `tab ${tabId}`);
    }

    return [];
  };

  // Command execution
  const executeCommand = useCallback((input) => {
    const [cmd, ...args] = input.trim().split(' ');
    const command = commands[cmd];

    if (!command) {
      return { error: `zsh: command not found: ${cmd}` };
    }

    try {
      return command(args);
    } catch (error) {
      console.error("Command execution error:", error);
      return { error: `Error executing command: ${error.message}` };
    }
  }, [commands, currentDirectory]);

  // Handle command input
  const handleCommand = useCallback((e) => {
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      commands.clear();
      return;
    }

    if (e.key === 'Enter') {
      const trimmedInput = currentInput.trim();
      if (trimmedInput) {
        setIsExecuting(true);

        // Add only the input to command history
        setCommandHistory(prev => [...prev, { type: 'input', content: trimmedInput }]);

        // Execute the command
        const result = executeCommand(trimmedInput);

        // Add the result to history immediately (no typing animation)
        setTimeout(() => {
          setCommandHistory(prev => [
            ...prev,
            {
              type: result.error ? 'error' : 'output',
              content: result.error || colorizeOutput(result.output)
            }
          ]);
          setIsExecuting(false);
        }, 20); // Reduced delay for faster response

        setCurrentInput('');
        setCommandHistoryIndex(-1);
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      if (isExecuting) {
        setIsExecuting(false);
        setCommandHistory(prev => [...prev, { type: 'error', content: '^C' }]);
        setCurrentInput('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      commands.clear();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const suggestions = getCommandSuggestions(currentInput);

      // If there is exactly one suggestion, use it directly
      if (suggestions.length === 1) {
        setCurrentInput(suggestions[0]);
      }
      // If there are multiple suggestions, try to complete to the common prefix
      else if (suggestions.length > 1) {
        // Find the longest common prefix among all suggestions
        const commonPrefix = findLongestCommonPrefix(suggestions);

        // Only set if the common prefix is longer than the current input
        if (commonPrefix.length > currentInput.length) {
          setCurrentInput(commonPrefix);
        } else {
          // Otherwise, just set the first suggestion if Tab is pressed twice quickly
          if (lastKeyPressed === 'Tab' && Date.now() - lastTabPressTime < 500) {
            setCurrentInput(suggestions[0]);
          }

          // Update last Tab press time
          setLastTabPressTime(Date.now());
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const inputCommands = commandHistory.filter(cmd => cmd.type === 'input');
      if (inputCommands.length > 0 && commandHistoryIndex < inputCommands.length - 1) {
        const newIndex = commandHistoryIndex + 1;
        setCommandHistoryIndex(newIndex);
        setCurrentInput(inputCommands[inputCommands.length - 1 - newIndex].content);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistoryIndex > -1) {
        const newIndex = commandHistoryIndex - 1;
        setCommandHistoryIndex(newIndex);
        if (newIndex === -1) {
          setCurrentInput('');
        } else {
          const inputCommands = commandHistory.filter(cmd => cmd.type === 'input');
          setCurrentInput(inputCommands[inputCommands.length - 1 - newIndex].content);
        }
      }
    }

    setLastKeyPressed(e.key);
  }, [currentInput, commandHistory, commandHistoryIndex, isExecuting, executeCommand, commands, lastKeyPressed, lastTabPressTime, getCommandSuggestions]);

  // Close the browser window
  const handleCloseWindow = useCallback(() => {
    window.close();
    // Fallback if window.close() is blocked
    if (window.opener) {
      window.opener = null;
      window.open('', '_self');
      window.close();
    } else {
      // Display a message if we can't close the window
      setCommandHistory(prev => [...prev, {
        type: 'output',
        content: 'To close this window, please use your browser\'s close button or Ctrl+W (Cmd+W on Mac).'
      }]);
    }
  }, []);

  // Window management
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback((event, info) => {
    setIsDragging(false);

    // Only update position if actually dragged
    if (info.offset.x !== 0 || info.offset.y !== 0) {
      setWindowPosition(prevPos => ({
        x: prevPos.x + info.offset.x,
        y: prevPos.y + info.offset.y
      }));
    }
  }, []);

  // Reset position rather than maximize
  const handleResetPosition = useCallback(() => {
    setWindowPosition({ x: 0, y: 0 });
  }, []);

  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const hasInitialized = useRef(false);

  // Execute loading commands in sequence
  useEffect(() => {
    if (initialLoading && commandIndex < loadingCommands.length) {
      if (showPrompt) {
        setTimeout(() => {
          setShowPrompt(false);
          typeCommand(loadingCommands[commandIndex], commandIndex);
        }, 200);
      }
    }
  }, [commandIndex, showPrompt, initialLoading, loadingCommands]);

  // Setup loading animation sequence
  useEffect(() => {
    if (initialLoading) {
      // Start loading character animation
      const loadingInterval = setInterval(() => {
        setLoadChar(c => (c + 1) % loadingChars.length);
      }, 200);

      // Start command sequence
      setTimeout(() => {
        setShowPrompt(true);
      }, 400);

      // Auto-dismiss loader after commands complete
      const timer = setTimeout(() => {
        clearInterval(loadingInterval);
        setInitialLoading(false);

        // Start the actual terminal loading sequence after loader completes
        setTimeout(() => {
          runWelcomeSequence();
        }, 200);
      }, 3500);

      return () => {
        clearTimeout(timer);
        clearInterval(loadingInterval);
      };
    }
  }, [initialLoading, loadingChars]);

  // Initial welcome sequence
  const runWelcomeSequence = async () => {
    if (!hasInitialized.current) {
      // Clear any existing command history to ensure we don't get duplicates
      setCommandHistory([]);

      // Create welcome message with a single instance of each message
      const welcomeMessage = [
        { type: 'input', content: 'cat welcome.txt' },
        { type: 'output', content: colorizeOutput(fileSystem['~'].content['welcome.txt'].content) }
      ];

      // Add each message one at a time with minimal delays
      for (const msg of welcomeMessage) {
        await new Promise(resolve => {
          setTimeout(() => {
            setCommandHistory(prev => [...prev, msg]);
            resolve();
          }, 150); // Reduced delay for faster startup
        });
      }

      setTimeout(() => setIsLoading(false), 100); // Reduced delay

      hasInitialized.current = true; // Mark as initialized
    }
  };

  // Theme management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Focus management
  useEffect(() => {
    const handleClick = (e) => {
      if (terminalRef.current?.contains(e.target)) {
        inputRef.current?.focus();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Scroll management
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, [commandHistory, textOutput]);

  // Show terminal on click if minimized
  const handleContainerClick = useCallback(() => {
    if (isMinimized) {
      setIsMinimized(false);
    }
  }, [isMinimized]);

  // Faster tab transitions
  const tabTransitionDuration = 0.05; // Reduced from 0.3 to make it much faster

  // Terminal content renderer with faster transitions
  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: tabTransitionDuration }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    );
  };

  // Tab content renderer with faster animations
  const renderTabContent = () => {
    switch (activeTab) {
      case 'main':
        return (
          <div className="prompt-section">
            <div className="command-history">
              {commandHistory.map((cmd, index) => (
                <motion.div
                  key={`cmd-${index}`}
                  className={`command-line ${cmd.type}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }} // Faster animation
                >
                  {cmd.type === 'input' && <span className="prompt">❯</span>}
                  <span
                    className={`command-${cmd.type}`}
                    dangerouslySetInnerHTML={{ __html: cmd.content }}
                  />
                </motion.div>
              ))}
            </div>
            <div className="current-input">
              <span className="prompt">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleCommand}
                autoFocus
                spellCheck="false"
                autoComplete="off"
                aria-label="Terminal input"
              />
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="projects-section">
            {/* Projects filter tabs - quick tech filter */}
            <div className="project-categories">
              {['All', ...new Set(projects.flatMap(p => p.tags))].map((tag) => (
                <motion.button
                  key={tag}
                  className="category-filter"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => console.log(`Filter by ${tag}`)}
                >
                  {tag}
                </motion.button>
              ))}
            </div>

            {/* Projects grid with enhanced cards */}
            <div className="projects-grid">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="project-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1.0]
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  <div className="project-tags">
                    {project.tags.map(tag => (
                      <motion.span
                        key={tag}
                        className="tag"
                        whileHover={{ scale: 1.1 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  <div className="project-links">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      <Github size={14} /> Code
                    </a>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      View Project <ChevronRight size={14} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="about-content">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <h2>About Me</h2>
              <p>
                I'm a systems programmer and DevOps engineer passionate about building efficient,
                scalable systems. With expertise in low-level programming, system architecture,
                and cloud infrastructure, I create robust solutions for complex technical challenges.
              </p>

              {/* Experience timeline - new section */}
              <div className="experience-section">
                <h3>Experience</h3>
                <div className="timeline">
                  <motion.div
                    className="timeline-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Senior DevOps Engineer</h4>
                      <span className="timeline-date">2022 - Present</span>
                      <p>Leading cloud infrastructure and CI/CD pipelines for distributed systems.</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="timeline-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>Systems Programmer</h4>
                      <span className="timeline-date">2019 - 2022</span>
                      <p>Developed performance-critical software for embedded systems.</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Skills section - enhanced */}
              <h3>Skills</h3>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className="skill-item"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{
                      x: 4,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-level">
                      <motion.div
                        className="skill-progress"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        style={{ backgroundColor: skill.color }}
                      />
                    </div>
                    <div className="skill-label">
                      {skill.level >= 85 ? 'Expert' :
                        skill.level >= 70 ? 'Advanced' : 'Intermediate'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'contact':
        return (
          <div className="contact-section">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <h2>Get in Touch</h2>
              <p>Feel free to reach out for collaborations, projects, or just to say hello. I'm always open to discussing new ideas and opportunities.</p>

              <div className="social-links">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    className={`social-link ${link.name.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="social-icon">
                      {link.icon}
                    </div>
                    <div className="social-link-content">
                      <span className="social-link-title">{link.name}</span>
                      <span className="social-link-subtitle">
                        {link.name === 'Github' ? '@username' :
                          link.name === 'LinkedIn' ? 'Connect with me' :
                            link.name === 'Email' ? 'email@example.com' : ''}
                      </span>
                    </div>
                    <ChevronRight size={16} className="social-link-arrow" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container" onClick={handleContainerClick}>
      <motion.div
        className={`terminal-container ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: isMinimized ? 0.6 : 1,
          y: isMinimized ? window.innerHeight - 80 : 0,
          scale: isMinimized ? 0.8 : 1,
          x: windowPosition.x,
          y: windowPosition.y,
          width: windowSize.width,
          height: windowSize.height
        }}
        transition={{
          duration: 1,
          type: "spring",
          damping: 25,
          stiffness: 400
        }}
        drag={!isMinimized}
        dragMomentum={false}
        dragElastic={0.05}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        ref={terminalRef}
        dragConstraints={{ left: -1000, right: 1000, top: -500, bottom: 500 }}
      >
        {/* Terminal UI framework - always visible */}
        <div className="terminal-titlebar">
          <div className="window-controls">
            <motion.div
              className="window-control control-close"
              onClick={handleCloseWindow}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={8} />
            </motion.div>
            <motion.div
              className="window-control control-minimize"
              onClick={handleMinimize}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Minus size={8} />
            </motion.div>
            <motion.div
              className="window-control control-maximize"
              onClick={handleResetPosition}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Maximize2 size={8} />
            </motion.div>
          </div>
          <div className="terminal-title">
            nitesh@portfolio: {currentDirectory}
          </div>
          <div className="theme-toggle" onClick={() => commands.theme()}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </div>
        </div>

        <div className="terminal-tabs">
          {tabs.map(tab => (
            <motion.div
              key={tab.id}
              className={`terminal-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ backgroundColor: 'var(--ctp-surface0)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="terminal-tab-icon">{tab.icon}</span>
              {tab.title}
            </motion.div>
          ))}
        </div>

        {/* Terminal content area - shows either loading sequence or main content */}
        <div
          className="terminal-content"
          ref={terminalContentRef}
          onClick={() => inputRef.current?.focus()}
        >
          {initialLoading ? (
            /* Loading animation inside the exact same terminal UI */
            <div className="loading-animation">
              {/* ASCII Logo */}
              <motion.div
                className="ascii-logo-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {asciiLogo.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                  >
                    {line}
                  </motion.div>
                ))}
              </motion.div>

              {/* Loading Command Sequence - exactly like normal terminal */}
              <div className="loader-command-history">
                {/* System startup messages */}
                <motion.div
                  className="command-line system-startup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span>
                    Portfolio Terminal <span className="system-version">v1.0.4</span> (64-bit)<br />
                    Running on <span className="system-info">Terminal OS {new Date().getFullYear()}</span><br />
                    <br />
                    Initializing system...
                  </span>
                </motion.div>

                {/* Command outputs */}
                {textOutput.map((output, index) => (
                  <motion.div
                    key={index}
                    className="command-line"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    {output.type === 'command' && <span className="prompt">❯</span>}
                    <span
                      className={`command-${output.type}`}
                    >
                      {output.text}
                    </span>
                  </motion.div>
                ))}

                {/* Current command prompt */}
                {showPrompt && (
                  <div className="command-line">
                    <span className="prompt">❯</span>
                    <motion.span
                      className="terminal-cursor"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  </div>
                )}
              </div>

              {/* Progress bar at bottom of content */}
              <div className="loader-progress-container">
                <div className="loader-progress-info">
                  <div>
                    <span className="loader-char">{loadingChars[loadChar]}</span>
                    Loading portfolio assets
                  </div>
                  <div>{Math.round(progress)}%</div>
                </div>
                <div className="loader-progress-bar">
                  <motion.div
                    className="loader-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 2 }}
                  />
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="command-history">
              {commandHistory.map((cmd, index) => (
                <motion.div
                  key={index}
                  className={`command-line ${cmd.type}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {cmd.type === 'input' && <span className="prompt">❯</span>}
                  <span
                    className={`command-${cmd.type}`}
                    dangerouslySetInnerHTML={{ __html: cmd.content }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default App;
