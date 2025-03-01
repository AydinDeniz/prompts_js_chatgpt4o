// HTML for the e-commerce product page (assumed to be in your HTML file)
/*
<div id="product-page">
  <div id="product-list"></div>
  <div id="product-details" style="display: none;">
    <h2 id="product-name"></h2>
    <img id="product-image" src="" alt="Product Image" />
    <p id="product-description"></p>
    <ul id="product-reviews"></ul>
    <button id="back-button">Back to Products</button>
  </div>
  <div>
    <label for="review-filter">Filter reviews by rating:</label>
    <select id="review-filter">
      <option value="all">All</option>
      <option value="5">5 Stars</option>
      <option value="4">4 Stars</option>
      <option value="3">3 Stars</option>
      <option value="2">2 Stars</option>
      <option value="1">1 Star</option>
    </select>
  </div>
</div>
*/

class EcommerceProductPage {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.products = [];
    this.reviews = [];
    this.cachedProducts = {};
    this.init();
  }

  async init() {
    try {
      this.products = await this.fetchProducts();
      this.displayProducts();
    } catch (error) {
      console.error('Error initializing product page:', error);
    }
    
    this.setupEventListeners();
  }

  async fetchProducts() {
    const response = await fetch(`${this.apiUrl}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    this.cachedProducts = JSON.parse(localStorage.getItem('cachedProducts')) || {};
    const products = await response.json();
    products.forEach(product => this.cachedProducts[product.id] = product);
    localStorage.setItem('cachedProducts', JSON.stringify(this.cachedProducts));
    return products;
  }

  setupEventListeners() {
    document.getElementById('review-filter').addEventListener('change', () => {
      this.displayReviews(this.reviews);
    });
    document.getElementById('back-button').addEventListener('click', () => {
      document.getElementById('product-details').style.display = 'none';
      document.getElementById('product-list').style.display = 'block';
    });
  }

  displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    this.products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.innerHTML = `
        <h3>${product.name}</h3>
        <img src="${product.image}" alt="${product.name}" />
        <p>${product.description.substring(0, 100)}...</p>
        <button data-id="${product.id}">View Details</button>
      `;
      productList.appendChild(productElement);

      productElement.querySelector('button').addEventListener('click', () => {
        this.loadProductDetails(product.id);
      });
    });
  }

  async loadProductDetails(productId) {
    const productDetails = this.cachedProducts[productId] || await this.fetchProductDetails(productId);
    document.getElementById('product-name').textContent = productDetails.name;
    document.getElementById('product-image').src = productDetails.image;
    document.getElementById('product-description').textContent = productDetails.description;
    
    document.getElementById('product-list').style.display = 'none';
    document.getElementById('product-details').style.display = 'block';

    try {
      this.reviews = await this.fetchProductReviews(productId);
      this.displayReviews(this.reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }

  async fetchProductDetails(productId) {
    const response = await fetch(`${this.apiUrl}/products/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch product details');
    const productDetails = await response.json();
    this.cachedProducts[productId] = productDetails;
    localStorage.setItem('cachedProducts', JSON.stringify(this.cachedProducts));
    return productDetails;
  }

  async fetchProductReviews(productId) {
    const response = await fetch(`${this.apiUrl}/products/${productId}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch product reviews');
    return response.json();
  }

  displayReviews(reviews) {
    const filterValue = document.getElementById('review-filter').value;
    const filteredReviews = filterValue === 'all' ? reviews : reviews.filter(review => review.rating.toString() === filterValue);
    
    const reviewsList = document.getElementById('product-reviews');
    reviewsList.innerHTML = '';
    filteredReviews.forEach(review => {
      const reviewElement = document.createElement('li');
      reviewElement.innerHTML = `
        <strong>${review.username}</strong> (${review.rating} stars)
        <p>${review.comment}</p>
      `;
      reviewsList.appendChild(reviewElement);
    });
  }
}

const ecommerceProductPage = new EcommerceProductPage('https://api.yourstore.com');