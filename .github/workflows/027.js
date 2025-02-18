// HTML for the advanced e-commerce platform (assumed to be in your HTML file)
/*
<div id="product-list"></div>
<div id="recommendation-section">
  <h3>Recommended for You</h3>
  <ul id="recommendations"></ul>
</div>
*/

class EcommercePlatform {
  constructor(apiUrl, stripeKey) {
    this.apiUrl = apiUrl;
    this.stripe = Stripe(stripeKey);
    this.init();
  }

  async init() {
    await this.loadProducts();
    await this.loadRecommendations();
    this.setupEventListeners();
  }

  async loadProducts() {
    const response = await fetch(`${this.apiUrl}/products`);
    const products = await response.json();
    this.displayProducts(products);
  }

  async loadRecommendations() {
    const response = await fetch(`${this.apiUrl}/recommendations`);
    const recommendations = await response.json();
    this.displayRecommendations(recommendations);
  }

  displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.innerHTML = `
        <h4>${product.name}</h4>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <button data-id="${product.id}" class="buy-button">Buy Now</button>
      `;
      productList.appendChild(productElement);
    });
  }

  displayRecommendations(recommendations) {
    const recommendationList = document.getElementById('recommendations');
    recommendationList.innerHTML = '';

    recommendations.forEach(item => {
      const itemElement = document.createElement('li');
      itemElement.textContent = `${item.name} - $${item.price}`;
      recommendationList.appendChild(itemElement);
    });
  }

  setupEventListeners() {
    document.addEventListener('click', async (event) => {
      if (event.target.classList.contains('buy-button')) {
        const productId = event.target.getAttribute('data-id');
        await this.handlePurchase(productId);
      }
    });
  }

  async handlePurchase(productId) {
    const response = await fetch(`${this.apiUrl}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });

    const session = await response.json();
    const result = await this.stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      alert(result.error.message);
    }
  }
}

const ecommercePlatform = new EcommercePlatform('https://api.yourecommerceplatform.com', 'YOUR_STRIPE_PUBLIC_API_KEY');