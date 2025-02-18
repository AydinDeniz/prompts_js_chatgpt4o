// HTML for Personal Finance Management Assistant (assumed to be in your HTML file)
/*
<div id="finance-assistant">
  <h2>Personal Finance Dashboard</h2>
  <div>
    <input type="number" id="income-input" placeholder="Enter monthly income" />
    <button id="add-income">Add Income</button>
  </div>
  <div>
    <input type="number" id="expense-input" placeholder="Enter expense amount" />
    <input type="text" id="expense-category" placeholder="Enter category" />
    <button id="add-expense">Add Expense</button>
  </div>
  <canvas id="budget-chart" width="400" height="200"></canvas>
  <div id="financial-summary"></div>
</div>
*/

class PersonalFinanceAssistant {
  constructor() {
    this.income = 0;
    this.expenses = [];
    this.setupEventListeners();
    this.initChart();
  }

  setupEventListeners() {
    document.getElementById('add-income').addEventListener('click', () => this.addIncome());
    document.getElementById('add-expense').addEventListener('click', () => this.addExpense());
  }

  addIncome() {
    const incomeInput = document.getElementById('income-input').value;
    this.income += parseFloat(incomeInput);
    this.updateFinancialSummary();
    this.updateChart();
  }

  addExpense() {
    const amount = parseFloat(document.getElementById('expense-input').value);
    const category = document.getElementById('expense-category').value.trim();
    this.expenses.push({ amount, category });
    this.updateFinancialSummary();
    this.updateChart();
  }

  updateFinancialSummary() {
    const totalExpenses = this.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const remainingBalance = this.income - totalExpenses;

    const summary = document.getElementById('financial-summary');
    summary.innerHTML = `
      <p>Total Income: $${this.income.toFixed(2)}</p>
      <p>Total Expenses: $${totalExpenses.toFixed(2)}</p>
      <p>Remaining Balance: $${remainingBalance.toFixed(2)}</p>
    `;
  }

  initChart() {
    const ctx = document.getElementById('budget-chart').getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

  updateChart() {
    const categories = Array.from(new Set(this.expenses.map(expense => expense.category)));
    const categoryTotals = categories.map(category => ({
      category,
      total: this.expenses
        .filter(expense => expense.category === category)
        .reduce((acc, expense) => acc + expense.amount, 0),
    }));

    this.chart.data.labels = categories;
    this.chart.data.datasets[0].data = categoryTotals.map(ct => ct.total);
    this.chart.data.datasets[0].backgroundColor = categories.map(() =>
      '#' + Math.floor(Math.random()*16777215).toString(16)
    );
    this.chart.update();
  }
}

const financeAssistant = new PersonalFinanceAssistant();