// HTML for the real-time collaborative text editor (assumed to be in your HTML file)
/*
<div id="text-editor-container">
  <textarea id="text-editor" rows="20" cols="80" placeholder="Start typing..."></textarea>
  <button id="save-button">Save</button>
  <div id="status-message"></div>
  <div id="user-list">Users Editing:</div>
</div>
*/

const userName = `User${Math.floor(Math.random() * 1000)}`; // Random username for simplicity
const socket = new WebSocket('wss://your-websocket-server.com');
let currentDocument = 'default-doc';
let isTyping = false;
let typingTimeout;

function setupWebSocket() {
  socket.addEventListener('open', () => {
    console.log('Connected to WebSocket server');
    sendJoinNotification();
  });

  socket.addEventListener('message', (message) => {
    const data = JSON.parse(message.data);
    handleWebSocketMessage(data);
  });

  socket.addEventListener('close', () => {
    console.log('Disconnected from WebSocket server');
  });

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

function sendJoinNotification() {
  const message = {
    type: 'join',
    document: currentDocument,
    user: userName,
  };
  socket.send(JSON.stringify(message));
}

function handleWebSocketMessage(data) {
  switch (data.type) {
    case 'documentContent':
      initDocumentContent(data.content);
      break;
    case 'userJoin':
      updateUserList(data.users);
      break;
    case 'edit':
      updateDocumentContent(data);
      break;
    case 'typing':
      showTypingNotification(data.user);
      break;
    case 'userLeave':
      updateUserList(data.users);
      break;
  }
}

function initDocumentContent(content) {
  document.getElementById('text-editor').value = content;
}

function updateUserList(users) {
  const userListContainer = document.getElementById('user-list');
  userListContainer.innerHTML = 'Users Editing: ' + users.join(', ');
}

function updateDocumentContent(data) {
  const textarea = document.getElementById('text-editor');
  const cursorPosition = textarea.selectionStart;
  const currentValue = textarea.value;
  textarea.value = currentValue.slice(0, data.position) + data.content + currentValue.slice(data.position);

  if (cursorPosition > data.position) {
    textarea.setSelectionRange(cursorPosition + data.content.length, cursorPosition + data.content.length);
  }
}

function showTypingNotification(user) {
  document.getElementById('status-message').textContent = `${user} is typing...`;
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    document.getElementById('status-message').textContent = '';
  }, 2000);
}

document.getElementById('text-editor').addEventListener('input', (event) => {
  const content = event.target.value;
  const position = event.target.selectionStart;

  if (!isTyping) {
    socket.send(JSON.stringify({ type: 'typing', user: userName }));
    isTyping = true;
    setTimeout(() => isTyping = false, 2000);
  }

  socket.send(JSON.stringify({
    type: 'edit',
    document: currentDocument,
    user: userName,
    content: content.slice(position - 1, position),
    position: position - 1
  }));
});

document.getElementById('save-button').addEventListener('click', () => {
  const content = document.getElementById('text-editor').value;
  socket.send(JSON.stringify({
    type: 'save',
    document: currentDocument,
    content,
    user: userName
  }));
  document.getElementById('status-message').textContent = 'Document saved.';
  setTimeout(() => {
    document.getElementById('status-message').textContent = '';
  }, 2000);
});

setupWebSocket();