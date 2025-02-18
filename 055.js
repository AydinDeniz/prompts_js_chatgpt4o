document.addEventListener('DOMContentLoaded', () => {
  const productRecommendationsContainer = document.getElementById('product-recommendations');

  document.getElementById('get-recommendations').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    if (username) {
      const recommendations = generateRecommendations(username);
      displayRecommendations(recommendations);
    }
  });

  function generateRecommendations(username) {
    // Simulate recommendations with mock data
    const productCatalog = [
      { id: 1, name: 'Wireless Headphones', category: 'Electronics' },
      { id: 2, name: 'Running Shoes', category: 'Sportswear' },
      { id: 3, name: 'Smartwatch', category: 'Gadgets' },
      { id: 4, name: 'Coffee Maker', category: 'Appliances' },
      { id: 5, name: 'Yoga Mat', category: 'Wellness' }
    ];

    return productCatalog.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  function displayRecommendations(recommendations) {
    productRecommendationsContainer.innerHTML = '<h3>Recommended Products:</h3>';
    recommendations.forEach(product => {
      const productItem = document.createElement('p');
      productItem.textContent = `${product.name} - Category: ${product.category}`;
      productRecommendationsContainer.appendChild(productItem);
    });
  }
});