
// Record and Replay User Interactions

document.addEventListener("DOMContentLoaded", function () {
    const recordButton = document.createElement("button");
    recordButton.innerText = "Start Recording";
    document.body.appendChild(recordButton);

    const replayButton = document.createElement("button");
    replayButton.innerText = "Replay Actions";
    replayButton.style.marginLeft = "10px";
    document.body.appendChild(replayButton);

    let actions = [];
    let recording = false;

    // Start recording user interactions
    recordButton.addEventListener("click", function () {
        recording = !recording;
        recordButton.innerText = recording ? "Stop Recording" : "Start Recording";
        if (!recording) return;

        actions = [];
        document.addEventListener("click", captureClick);
        document.addEventListener("keypress", captureKeypress);
    });

    // Capture click events
    function captureClick(event) {
        if (recording) {
            actions.push({ type: "click", x: event.clientX, y: event.clientY, time: Date.now() });
        }
    }

    // Capture keypress events
    function captureKeypress(event) {
        if (recording) {
            actions.push({ type: "keypress", key: event.key, time: Date.now() });
        }
    }

    // Replay user actions
    replayButton.addEventListener("click", function () {
        if (actions.length === 0) {
            alert("No recorded actions to replay.");
            return;
        }

        let startTime = actions[0].time;
        actions.forEach(action => {
            setTimeout(() => {
                if (action.type === "click") {
                    const marker = document.createElement("div");
                    marker.style.position = "absolute";
                    marker.style.left = action.x + "px";
                    marker.style.top = action.y + "px";
                    marker.style.width = "10px";
                    marker.style.height = "10px";
                    marker.style.backgroundColor = "red";
                    marker.style.borderRadius = "50%";
                    document.body.appendChild(marker);
                    setTimeout(() => marker.remove(), 1000);
                } else if (action.type === "keypress") {
                    console.log(`Replayed Key Press: ${action.key}`);
                }
            }, action.time - startTime);
        });
    });
});
