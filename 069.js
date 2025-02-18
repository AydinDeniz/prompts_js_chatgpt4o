document.addEventListener('DOMContentLoaded', () => {
    const storeLayout = {
        'Produce': 1,
        'Dairy': 2,
        'Bakery': 3,
        'Meat': 4,
        'Frozen': 5,
        'Canned Goods': 6
    };

    const items = {
        'Apple': 'Produce',
        'Banana': 'Produce',
        'Milk': 'Dairy',
        'Bread': 'Bakery',
        'Chicken': 'Meat',
        'Ice Cream': 'Frozen',
        'Beans': 'Canned Goods'
    };

    const groceryListElement = document.getElementById('grocery-list');
    const addItemButton = document.getElementById('add-item');

    addItemButton.addEventListener('click', () => {
        const itemName = document.getElementById('item-name').value;
        if (itemName && items[itemName]) {
            addItemToList(itemName);
            document.getElementById('item-name').value = '';
        } else {
            alert('Item not found. Please try again.');
        }
    });

    function addItemToList(itemName) {
        const aisle = storeLayout[items[itemName]];
        
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${itemName} - ${items[itemName]}</span>
            <span class="item-route">Aisle ${aisle}</span>
        `;
        groceryListElement.appendChild(listItem);

        sortList();
    }

    function sortList() {
        const listItems = Array.from(groceryListElement.getElementsByTagName('li'));
        listItems.sort((a, b) => {
            const aisleA = parseInt(a.querySelector('.item-route').textContent.split(' ')[1]);
            const aisleB = parseInt(b.querySelector('.item-route').textContent.split(' ')[1]);
            return aisleA - aisleB;
        });
        listItems.forEach(item => groceryListElement.appendChild(item));
    }
});