const recordButton = document.getElementById('record-button');
const audioCheckbox = document.getElementById('audio-checkbox');
const themeSwitcher = document.getElementById('theme-switcher');
const previewVideo = document.getElementById('preview-video');
const downloadLink = document.getElementById('download-link');
const statusDiv = document.getElementById('status');
const screenshotButton = document.getElementById('screenshot-button');

let isRecording = false;
let mediaRecorder;
let recordedChunks = [];
let currentUrl = null;
let hiddenVideo;

if (!navigator.mediaDevices.getDisplayMedia) {
    recordButton.disabled = true;
    recordButton.innerHTML = '<i class="fas fa-circle"></i> Recording Not Supported';
    const message = document.createElement('p');
    message.textContent = 'Screen recording is not supported on this device/browser.';
    document.querySelector('.recorder-container').appendChild(message);
} else {
    recordButton.addEventListener('click', async () => {
        if (!isRecording) {
            try {
                const includeAudio = audioCheckbox.checked;
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: includeAudio });

                // Create hidden video for screenshots
                hiddenVideo = document.createElement('video');
                hiddenVideo.srcObject = stream;
                hiddenVideo.play();
                hiddenVideo.style.position = 'absolute';
                hiddenVideo.style.visibility = 'hidden';
                document.body.appendChild(hiddenVideo);

                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };
                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    if (currentUrl) URL.revokeObjectURL(currentUrl);
                    currentUrl = URL.createObjectURL(blob);
                    previewVideo.src = currentUrl;
                    downloadLink.href = currentUrl;
                    previewVideo.parentElement.classList.remove('hidden');
                    recordedChunks = [];
                    stream.getTracks().forEach(track => track.stop());
                    if (hiddenVideo) {
                        hiddenVideo.remove();
                        hiddenVideo = null;
                    }
                    screenshotButton.classList.add('hidden');
                };

                mediaRecorder.start();
                isRecording = true;
                recordButton.innerHTML = '<i class="fas fa-square"></i> Stop Recording';
                statusDiv.classList.remove('hidden');
                audioCheckbox.disabled = true;
                screenshotButton.classList.remove('hidden');
            } catch (error) {
                console.error('Error starting recording:', error);
                alert('Failed to start recording. Ensure permissions are granted.');
            }
        } else {
            mediaRecorder.stop();
            isRecording = false;
            recordButton.innerHTML = '<i class="fas fa-circle"></i> Start Recording';
            statusDiv.classList.add('hidden');
            audioCheckbox.disabled = false;
        }
    });
}

// Screenshot functionality
screenshotButton.addEventListener('click', () => {
    if (hiddenVideo && hiddenVideo.readyState >= 2) {
        const canvas = document.createElement('canvas');
        canvas.width = hiddenVideo.videoWidth;
        canvas.height = hiddenVideo.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(hiddenVideo, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'screenshot.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    } else {
        alert('Unable to take screenshot. Video is not ready.');
    }
});

// Theme switching
themeSwitcher.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeSwitcher.textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Apply saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeSwitcher.textContent = 'Switch to Light Mode';
}