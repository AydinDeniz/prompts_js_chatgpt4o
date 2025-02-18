// HTML for the collaborative code editor (assumed to be in your HTML file)
/*
<div id="code-editor">
  <textarea id="editor" placeholder="Write your code here..."></textarea>
  <button id="save-code">Save Code</button>
  <button id="run-code">Run Code</button>
  <div id="output"></div>
  <div id="collaborators"></div>
</div>
*/

const socket = io('wss://your-collaborative-editor-server.com');
let editor;
let collaborators = {};

class CollaborativeCodeEditor {
  constructor() {
    this.initEditor();
    this.setupSocketListeners();
    this.setupEventListeners();
  }

  initEditor() {
    editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
      lineNumbers: true,
      mode: "javascript",
      theme: "dracula",
      extraKeys: { "Ctrl-Space": "autocomplete" },
    });

    editor.on('change', () => {
      const code = editor.getValue();
      socket.emit('codeChange', code);
    });
  }

  setupSocketListeners() {
    socket.on('connect', () => {
      socket.emit('joinEditor', { userId: this.generateUserId() });
    });

    socket.on('initCode', (code) => {
      editor.setValue(code);
    });

    socket.on('codeChange', (code) => {
      const cursor = editor.getCursor();
      editor.setValue(code);
      editor.setCursor(cursor);
    });

    socket.on('collaborators', (onlineUsers) => {
      collaborators = onlineUsers;
      this.renderCollaborators();
    });
  }

  setupEventListeners() {
    document.getElementById('save-code').addEventListener('click', () => this.saveCode());
    document.getElementById('run-code').addEventListener('click', () => this.runCode());
  }

  runCode() {
    const code = editor.getValue();
    try {
      // Use eval to execute the code
      const result = eval(code);
      document.getElementById('output').textContent = result;
    } catch (error) {
      document.getElementById('output').textContent = `Error: ${error.message}`;
    }
  }

  saveCode() {
    const code = editor.getValue();
    localStorage.setItem('savedCode', code);
    alert('Code saved successfully');
  }

  renderCollaborators() {
    const collaboratorsDiv = document.getElementById('collaborators');
    collaboratorsDiv.innerHTML = '<h3>Active Collaborators:</h3>';

    for (const [id, user] of Object.entries(collaborators)) {
      const collaboratorElement = document.createElement('p');
      collaboratorElement.textContent = `User ${id}: ${user}`;
      collaboratorsDiv.appendChild(collaboratorElement);
    }
  }

  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }
}

const collaborativeCodeEditor = new CollaborativeCodeEditor();