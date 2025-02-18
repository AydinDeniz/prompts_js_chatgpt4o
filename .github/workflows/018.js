// HTML for the video upload platform (assumed to be in your HTML file)
/*
<div id="video-upload-platform">
  <form id="video-upload-form">
    <input type="text" id="video-title" placeholder="Video Title" required />
    <select id="video-category">
      <option value="">Select Category</option>
      <option value="music">Music</option>
      <option value="education">Education</option>
      <option value="entertainment">Entertainment</option>
    </select>
    <input type="file" id="video-file" accept="video/*" required />
    <button type="submit">Upload Video</button>
  </form>
  <progress id="upload-progress" value="0" max="100" style="width: 100%; display: none;"></progress>
  <div id="upload-message"></div>
  <div id="video-gallery"></div>
</div>
*/

class VideoUploadPlatform {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('video-upload-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.uploadVideo();
    });
  }

  async uploadVideo() {
    const title = document.getElementById('video-title').value;
    const category = document.getElementById('video-category').value;
    const videoFile = document.getElementById('video-file').files[0];

    if (!category || !videoFile) {
      alert('Please select a category and a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('video', videoFile);

    document.getElementById('upload-progress').style.display = 'block';

    try {
      const response = await fetch(`${this.apiUrl}/videos`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        },
      });

      if (!response.ok) throw new Error('Failed to upload video');
      
      document.getElementById('upload-message').textContent = 'Video uploaded successfully!';
      document.getElementById('upload-progress').value = 100;
      this.resetForm();
      this.loadVideoGallery();
    } catch (error) {
      console.error('Error uploading video:', error);
      document.getElementById('upload-message').textContent = 'Error uploading video.';
    } finally {
      document.getElementById('upload-progress').style.display = 'none';
    }
  }

  resetForm() {
    document.getElementById('video-upload-form').reset();
  }

  async loadVideoGallery() {
    try {
      const response = await fetch(`${this.apiUrl}/videos`);
      if (!response.ok) throw new Error('Failed to load video gallery');
      const videos = await response.json();
      this.displayVideoGallery(videos);
    } catch (error) {
      console.error('Error loading video gallery:', error);
    }
  }

  displayVideoGallery(videos) {
    const gallery = document.getElementById('video-gallery');
    gallery.innerHTML = '';
    
    videos.forEach(video => {
      const videoElement = document.createElement('div');
      videoElement.className = 'video';
      videoElement.innerHTML = `
        <h3>${video.title}</h3>
        <p>Category: ${video.category}</p>
        <video width="320" height="240" controls>
          <source src="${video.url}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
      gallery.appendChild(videoElement);
    });
  }
}

const videoUploadPlatform = new VideoUploadPlatform('https://api.videouploadplatform.com');
videoUploadPlatform.loadVideoGallery();