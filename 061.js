if (navigator.xr) {
    let xrButton = document.getElementById('ar-button');
    let xrSession = null;
    let gl = null;

    xrButton.addEventListener('click', async () => {
        if (!xrSession) {
            navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'] }).then(onSessionStarted);
        } else {
            xrSession.end();
        }
    });

    async function onSessionStarted(session) {
        xrSession = session;
        gl = document.createElement('canvas').getContext('webgl', { xrCompatible: true });

        xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(xrSession, gl) });
        let refSpace = await xrSession.requestReferenceSpace('local');
        let hitTestSource = await xrSession.requestHitTestSource({ space: refSpace });

        xrSession.requestAnimationFrame(onXRFrame);

        function onXRFrame(time, frame) {
            let session = frame.session;
            session.requestAnimationFrame(onXRFrame);

            let viewerPose = frame.getViewerPose(refSpace);
            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (viewerPose) {
                const glLayer = session.renderState.baseLayer;
                gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);

                gl.clearColor(0.1, 0.1, 0.1, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                if (hitTestResults.length > 0 && !window.objectPlaced) {
                    let hitPose = hitTestResults[0].getPose(refSpace);
                    alert('Tap on the screen to place an object.');
                    window.objectPlaced = true; // This is a placeholder for actual object placement logic
                }
            }
        }
    }
} else {
    document.getElementById('ar-button').style.display = 'none';
    document.body.innerText = "WebXR not supported.";
}