document.addEventListener('DOMContentLoaded', () => {
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clearWhiteboard');
    const startVideoBtn = document.getElementById('startVideo');
    const endVideoBtn = document.getElementById('endVideo');

    let drawing = false;
    let pc; // Peer Connection

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    clearBtn.addEventListener('click', clearWhiteboard);
    startVideoBtn.addEventListener('click', startVideo);
    endVideoBtn.addEventListener('click', endVideo);

    function startDrawing(e) {
        drawing = true;
        draw(e);
    }

    function draw(e) {
        if (!drawing) return;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
        
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    function stopDrawing() {
        drawing = false;
        ctx.beginPath();
    }

    function clearWhiteboard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    async function startVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideo.srcObject = stream;

            // Initialize Peer Connection
            pc = new RTCPeerConnection();
            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            pc.ontrack = (event) => {
                if (event.streams && event.streams[0]) {
                    remoteVideo.srcObject = event.streams[0];
                }
            };

            // Offer to Connect
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // Exchange ICE candidates
            pc.onicecandidate = function (event) {
                if (event.candidate) {
                    // sendCandidateToRemote(event.candidate); // Implement signaling here
                }
            };

            // Simulated signaling (would require actual signaling server setup in production)
            // pc.setRemoteDescription(new RTCSessionDescription(remoteOffer));
            // pc.addIceCandidate(new RTCIceCandidate(remoteCandidate));
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    }

    function endVideo() {
        if (pc) {
            pc.close();
            pc = null;
        }
        localVideo.srcObject.getTracks().forEach(track => track.stop());
        localVideo.srcObject = null;
        remoteVideo.srcObject = null;
    }

    // Placeholder functions for signaling server communication
    function sendOfferToRemote(offer) {
        // Submit the offer through a signaling server
    }

    function receiveAnswerFromRemote(answer) {
        // Receive the answer through a signaling server
    }

    function sendCandidateToRemote(candidate) {
        // Send ICE candidates through a signaling server
    }
});