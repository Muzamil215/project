// Login credentials (stored in memory for demo purposes)
const validUsername = 'trucker';
const validPassword = 'Trucker123!@#';

// DOM Elements
const loginSection = document.getElementById('loginSection');
const expensesSection = document.getElementById('expensesSection');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const expenseForm = document.getElementById('expenseForm');
const clearBtn = document.getElementById('clearBtn');
const loginError = document.getElementById('loginError');
const expenseError = document.getElementById('expenseError');
const expenseSuccess = document.getElementById('expenseSuccess');
const expensesList = document.getElementById('expensesList');
const totalAmount = document.getElementById('totalAmount');

// Expenses array to store all expenses
let expenses = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Load expenses from localStorage if available
    loadExpenses();
    
    // Display expenses
    displayExpenses();
    
    // Add real-time password validation
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function() {
        validatePasswordComplexity(passwordInput.value);
    });
});

// Login Form Event Handler
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Clear previous error messages
    loginError.textContent = '';
    loginError.classList.remove('show');
    
    // Validate password complexity first
    const passwordValidation = checkPasswordComplexity(password);
    if (!passwordValidation.isValid) {
        showLoginError(passwordValidation.message);
        return;
    }
    
    // Validate login credentials
    if (validateLogin(username, password)) {
        // Successful login
        showExpensesSection();
    } else {
        // Failed login
        showLoginError('Invalid username or password. Please try again.');
    }
});

// Logout Button Event Handler
logoutBtn.addEventListener('submit', function(event) {
    event.preventDefault();
});

logoutBtn.addEventListener('click', function() {
    showLoginSection();
    // Clear login form
    loginForm.reset();
});

// Expense Form Event Handler
expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Clear previous messages
    expenseError.textContent = '';
    expenseError.classList.remove('show');
    expenseSuccess.textContent = '';
    expenseSuccess.classList.remove('show');
    
    // Get form values
    const expenseName = document.getElementById('expenseName').value.trim();
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    
    // Validate input
    if (validateExpenseInput(expenseName, category, amount, date)) {
        // Add expense
        addExpense(expenseName, category, amount, date);
        
        // Show success message
        showExpenseSuccess('Expense added successfully!');
        
        // Clear form
        expenseForm.reset();
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        
        // Display updated expenses
        displayExpenses();
    }
});

// Clear Form Button Event Handler
clearBtn.addEventListener('click', function() {
    expenseForm.reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    expenseError.textContent = '';
    expenseError.classList.remove('show');
    expenseSuccess.textContent = '';
    expenseSuccess.classList.remove('show');
});

// Password Complexity Validation Function
function checkPasswordComplexity(password) {
    const errors = [];
    
    // Check length
    if (password.length < 12) {
        errors.push('Password must be at least 12 characters long.');
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter.');
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter.');
    }
    
    // Check for number
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number.');
    }
    
    // Check for symbol
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one symbol.');
    }
    
    if (errors.length > 0) {
        return {
            isValid: false,
            message: errors.join(' ')
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}

// Real-time Password Complexity Validation (for visual feedback)
function validatePasswordComplexity(password) {
    // Check length
    const reqLength = document.getElementById('req-length');
    if (password.length >= 12) {
        reqLength.classList.add('requirement-met');
        reqLength.classList.remove('requirement-unmet');
    } else {
        reqLength.classList.add('requirement-unmet');
        reqLength.classList.remove('requirement-met');
    }
    
    // Check uppercase
    const reqUppercase = document.getElementById('req-uppercase');
    if (/[A-Z]/.test(password)) {
        reqUppercase.classList.add('requirement-met');
        reqUppercase.classList.remove('requirement-unmet');
    } else {
        reqUppercase.classList.add('requirement-unmet');
        reqUppercase.classList.remove('requirement-met');
    }
    
    // Check lowercase
    const reqLowercase = document.getElementById('req-lowercase');
    if (/[a-z]/.test(password)) {
        reqLowercase.classList.add('requirement-met');
        reqLowercase.classList.remove('requirement-unmet');
    } else {
        reqLowercase.classList.add('requirement-unmet');
        reqLowercase.classList.remove('requirement-met');
    }
    
    // Check number
    const reqNumber = document.getElementById('req-number');
    if (/[0-9]/.test(password)) {
        reqNumber.classList.add('requirement-met');
        reqNumber.classList.remove('requirement-unmet');
    } else {
        reqNumber.classList.add('requirement-unmet');
        reqNumber.classList.remove('requirement-met');
    }
    
    // Check symbol
    const reqSymbol = document.getElementById('req-symbol');
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        reqSymbol.classList.add('requirement-met');
        reqSymbol.classList.remove('requirement-unmet');
    } else {
        reqSymbol.classList.add('requirement-unmet');
        reqSymbol.classList.remove('requirement-met');
    }
}

// Login Validation Function
function validateLogin(username, password) {
    if (username === validUsername && password === validPassword) {
        return true;
    }
    return false;
}

// Expense Input Validation Function
function validateExpenseInput(expenseName, category, amount, date) {
    // Check if expense name is empty
    if (expenseName === '') {
        showExpenseError('Expense name cannot be empty.');
        return false;
    }
    
    // Check if category is selected
    if (category === '') {
        showExpenseError('Please select a category.');
        return false;
    }
    
    // Check if amount is valid
    if (isNaN(amount) || amount <= 0) {
        showExpenseError('Please enter a valid amount greater than 0.');
        return false;
    }
    
    // Check if date is selected
    if (date === '') {
        showExpenseError('Please select a date.');
        return false;
    }
    
    return true;
}

// Add Expense Function
function addExpense(name, category, amount, date) {
    const expense = {
        id: Date.now(),
        name: name,
        category: category,
        amount: amount,
        date: date
    };
    
    expenses.push(expense);
    
    // Save to localStorage
    saveExpenses();
}

// Display Expenses Function
function displayExpenses() {
    // Clear current list
    expensesList.innerHTML = '';
    
    if (expenses.length === 0) {
        expensesList.innerHTML = '<p class="no-expenses">No expenses added yet. Add your first expense above.</p>';
    } else {
        // Sort expenses by date (newest first)
        const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedExpenses.forEach(function(expense) {
            const expenseItem = createExpenseItem(expense);
            expensesList.appendChild(expenseItem);
        });
    }
    
    // Update total
    updateTotal();
}

// Create Expense Item Element
function createExpenseItem(expense) {
    const item = document.createElement('div');
    item.className = 'expense-item';
    
    const formattedDate = formatDate(expense.date);
    const formattedAmount = expense.amount.toFixed(2);
    
    item.innerHTML = `
        <div class="expense-item-header">
            <span class="expense-item-name">${escapeHtml(expense.name)}</span>
            <span class="expense-item-amount">$${formattedAmount}</span>
        </div>
        <div class="expense-item-details">
            <span class="expense-item-category">${escapeHtml(expense.category)}</span>
            <span>${formattedDate}</span>
        </div>
    `;
    
    return item;
}

// Update Total Function
function updateTotal() {
    const total = expenses.reduce(function(sum, expense) {
        return sum + expense.amount;
    }, 0);
    
    totalAmount.textContent = total.toFixed(2);
}

// Format Date Function
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show Login Section
function showLoginSection() {
    loginSection.classList.remove('hidden');
    expensesSection.classList.add('hidden');
}

// Show Expenses Section
function showExpensesSection() {
    loginSection.classList.add('hidden');
    expensesSection.classList.remove('hidden');
}

// Show Login Error
function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.add('show');
}

// Show Expense Error
function showExpenseError(message) {
    expenseError.textContent = message;
    expenseError.classList.add('show');
}

// Show Expense Success
function showExpenseSuccess(message) {
    expenseSuccess.textContent = message;
    expenseSuccess.classList.add('show');
    
    // Hide success message after 3 seconds
    setTimeout(function() {
        expenseSuccess.classList.remove('show');
    }, 3000);
}

// Save Expenses to LocalStorage
function saveExpenses() {
    localStorage.setItem('truckerExpenses', JSON.stringify(expenses));
}

// Load Expenses from LocalStorage
function loadExpenses() {
    const savedExpenses = localStorage.getItem('truckerExpenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }
}
