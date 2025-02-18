// HTML for the microservices architecture for e-commerce (assumed to be in your HTML file)
/*
<div id="ecommerce-dashboard">
  <div id="product-section"></div>
  <div id="cart-section">
    <h3>Shopping Cart</h3>
    <ul id="cart-items"></ul>
    <button id="checkout-button">Checkout</button>
  </div>
</div>
*/

class MicroservicesEcommerce {
  constructor() {
    this.cart = [];
    this.apiGatewayUrl = 'https://your-api-gateway.com';
    this.setupEventListeners();
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const response = await fetch(`${this.apiGatewayUrl}/products`);
      const products = await response.json();
      this.displayProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  displayProducts(products) {
    const productSection = document.getElementById('product-section');
    productSection.innerHTML = '<h3>Products</h3>';

    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.innerHTML = `
        <h4>${product.name}</h4>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <button data-id="${product.id}" class="add-to-cart-button">Add to Cart</button>
      `;
      productSection.appendChild(productElement);
    });
  }

  setupEventListeners() {
    document.getElementById('product-section').addEventListener('click', (event) => {
      if (event.target.classList.contains('add-to-cart-button')) {
        const productId = event.target.getAttribute('data-id');
        this.addToCart(productId);
      }
    });

    document.getElementById('checkout-button').addEventListener('click', () => this.checkout());
  }

  async addToCart(productId) {
    try {
      const response = await fetch(`${this.apiGatewayUrl}/products/${productId}`);
      const product = await response.json();
      this.cart.push(product);
      this.updateCartDisplay();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    this.cart.forEach(item => {
      const cartItem = document.createElement('li');
      cartItem.textContent = `${item.name} - $${item.price}`;
      cartItems.appendChild(cartItem);
    });
  }

  async checkout() {
    if (!this.cart.length) {
      alert('Your cart is empty!');
      return;
    }

    try {
      const response = await fetch(`${this.apiGatewayUrl}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: this.cart })
      });

      if (response.ok) {
        alert('Checkout successful!');
        this.cart = [];
        this.updateCartDisplay();
      } else {
        alert('Checkout failed.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  }
}

const ecommercePlatform = new MicroservicesEcommerce();