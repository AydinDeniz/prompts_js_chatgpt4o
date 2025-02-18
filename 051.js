document.addEventListener('DOMContentLoaded', () => {
  let totalAmount = 0;
  const expensesList = document.getElementById('expenses-list');
  const totalAmountContainer = document.getElementById('total-amount');

  document.getElementById('add-expense').addEventListener('click', () => {
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);

    if (expenseName && !isNaN(expenseAmount) && expenseAmount > 0) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `${expenseName} - $${expenseAmount.toFixed(2)} <button onclick="removeExpense(this, ${expenseAmount})">Remove</button>`;
      expensesList.appendChild(listItem);
      
      totalAmount += expenseAmount;
      updateTotalAmount();
      
      document.getElementById('expense-name').value = '';
      document.getElementById('expense-amount').value = '';
    }
  });

  function updateTotalAmount() {
    totalAmountContainer.textContent = totalAmount.toFixed(2);
  }
});

function removeExpense(button, amount) {
  button.parentElement.remove();
  totalAmount -= amount;
  document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}