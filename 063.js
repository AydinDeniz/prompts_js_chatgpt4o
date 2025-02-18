document.addEventListener('DOMContentLoaded', () => {
    const peer = new Peer();

    const editor = document.getElementById('editor');
    const connectButton = document.getElementById('connect');
    const peerIdInput = document.getElementById('peer-id');

    let conn;

    peer.on('open', (id) => {
        alert(`Your peer ID is ${id}`);
    });

    peer.on('connection', (connection) => {
        conn = connection;
        setupConnection(conn);
    });

    connectButton.addEventListener('click', () => {
        const peerId = peerIdInput.value;
        if (peerId) {
            conn = peer.connect(peerId);
            setupConnection(conn);
        }
    });

    function setupConnection(connection) {
        connection.on('open', () => {
            console.log('Connected to: ', connection.peer);

            editor.addEventListener('input', () => {
                connection.send(editor.value);
            });

            connection.on('data', (data) => {
                editor.value = data;
            });
        });

        connection.on('error', (err) => {
            console.error('Connection error: ', err);
        });
    }
});