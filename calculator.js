const display = document.getElementById('display');
let expression = '';

function updateDisplay() {
  display.value = expression || '0';
}

function appendNumber(value) {
  if (expression === '0' && value !== '.') {
    expression = value;
  } else if (expression === '' && value === '.') {
    expression = '0.';
  } else {
    const lastNumber = expression.split(/[-+*/]/).pop();
    if (value === '.' && lastNumber.includes('.')) {
      return;
    }
    expression += value;
  }
  updateDisplay();
}

function appendOperator(operator) {
  if (!expression) {
    if (operator === '-') {
      expression = '-';
    }
    updateDisplay();
    return;
  }

  const lastChar = expression.slice(-1);
  if (['+', '-', '*', '/'].includes(lastChar)) {
    expression = expression.slice(0, -1) + operator;
  } else {
    expression += operator;
  }
  updateDisplay();
}

function calculate() {
  if (!expression) return;

  try {
    const safeExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
    const valid = /^[\d+\-*/().\s]+$/.test(safeExpression);
    if (!valid) {
      expression = 'Error';
      updateDisplay();
      return;
    }

    const result = Function(`"use strict"; return (${safeExpression})`)();
    expression = Number.isFinite(result) ? String(result) : 'Error';
    updateDisplay();
  } catch (error) {
    expression = 'Error';
    updateDisplay();
  }
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function clearAll() {
  expression = '';
  updateDisplay();
}

function percent() {
  if (!expression) return;
  expression = `${expression}/100`;
  calculate();
}

document.querySelectorAll('.btn').forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === 'clear') {
      clearAll();
    } else if (action === 'delete') {
      deleteLast();
    } else if (action === 'percent') {
      percent();
    } else if (action === 'equals') {
      calculate();
    } else if (['+', '-', '*', '/'].includes(value)) {
      appendOperator(value);
    } else {
      appendNumber(value);
    }
  });
});

updateDisplay();
