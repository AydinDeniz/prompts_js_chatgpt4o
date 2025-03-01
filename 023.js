// HTML for the virtual reality tour creator (assumed to be in your HTML file)
/*
<div id="vr-tour-creator">
  <input type="file" id="image-upload" accept="image/*" />
  <button id="add-hotspot">Add Hotspot</button>
  <button id="save-tour">Save Tour</button>
  <div id="vr-scene"></div>
  <div id="hotspot-editor" style="display: none;">
    <input type="text" id="hotspot-description" placeholder="Hotspot Description" />
    <button id="save-hotspot">Save Hotspot</button>
  </div>
</div>
*/

let scene, camera, renderer, hotspots = [];

class VirtualRealityTourCreator {
  constructor() {
    this.initThreeJS();
    this.setupEventListeners();
    this.uploadedImage = null;
  }

  initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('vr-scene').appendChild(renderer.domElement);

    camera.position.z = 1;
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    renderer.render(scene, camera);
  }

  setupEventListeners() {
    document.getElementById('image-upload').addEventListener('change', (event) => this.loadImage(event));
    document.getElementById('add-hotspot').addEventListener('click', () => this.showHotspotEditor());
    document.getElementById('save-hotspot').addEventListener('click', () => this.saveHotspot());
    document.getElementById('save-tour').addEventListener('click', () => this.saveTour());
  }

  loadImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const texture = new THREE.TextureLoader().load(e.target.result);
      const geometry = new THREE.SphereGeometry(50, 60, 40);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const sphere = new THREE.Mesh(geometry, material);

      scene.add(sphere);
    };
    
    reader.readAsDataURL(file);
  }

  addHotspot(position) {
    const spriteMaterial = new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load('hotspot-icon.png') });
    const sprite = new THREE.Sprite(spriteMaterial);

    sprite.position.set(position.x, position.y, position.z);
    sprite.scale.set(2, 2, 1);
    scene.add(sprite);
    
    hotspots.push({ position, description: '' });
  }

  showHotspotEditor() {
    document.getElementById('hotspot-editor').style.display = 'block';
  }

  saveHotspot() {
    const desc = document.getElementById('hotspot-description').value;
    if (!desc) return alert('Please provide a description for the hotspot.');

    const position = camera.position.clone();
    this.addHotspot(position);

    hotspots[hotspots.length - 1].description = desc;
    document.getElementById('hotspot-editor').style.display = 'none';
  }

  async saveTour() {
    const tourData = { image: this.uploadedImage, hotspots };
    await fetch('/api/vr-tours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tourData)
    });

    alert('Tour saved successfully!');
  }
}

const vrTourCreator = new VirtualRealityTourCreator();