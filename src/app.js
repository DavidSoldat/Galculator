'use strict';

// variables //
const deleteRow = document.querySelector('#delete-row');
const navBtns = document.querySelector('#nav-btns');
const calculator = document.querySelector('#calculator');
// screen
const screen = document.querySelector('#screen');
const screenContainer = document.querySelector('#screen-container');
// grid
const grid = document.querySelector('#grid');
const key = document.querySelectorAll('button');

const disabled = document.querySelector('#m');
const disabled1 = document.querySelector('#mr');

console.log(disabled, disabled1);
disabled.disabled = true;
disabled1.disabled = true;

// temp variables
let displayValue = 0;
let firstOperand = null;
let firstOperator = null;
let secondOperand = null;
let secondOperator = null;
let result = null;
let res = 0;

//
// FUNCTIONS
//

// display value
const updateDisplay = function () {
  screen.innerText = displayValue;
  if (displayValue.length > 9) {
    screen.innerText = displayValue.substring(0, 9);
  }
};

updateDisplay();

// button clicks
const clickBtn = function () {
  grid.addEventListener('click', function (e) {
    if (e.target.dataset.type === 'num') {
      inputOperand(e.target.innerText);
      updateDisplay();
    } else if (e.target.dataset.type === 'operator') {
      inputOperator(e.target.innerText);
    } else if (e.target.dataset.type === 'equals') {
      inputEquals();
      updateDisplay();
    } else if (e.target.dataset.type === 'decimal') {
      inputDecimal(e.target.innerText);
      updateDisplay();
    } else if (e.target.dataset.type === 'percent') {
      inputPercent(displayValue);
      updateDisplay();
    } else if (e.target.dataset.type === 'sign') {
      inputSign(displayValue);
      updateDisplay();
    } else if (e.target.dataset.type === 'factorial') {
      inputOperator('factorial');
      updateDisplay();
    } else if (e.target.dataset.type === 'exponent') {
      inputOperator('exponent');
      updateDisplay();
    } else if (e.target.dataset.type === 'absolute') {
      inputOperator('absolute');
      updateDisplay();
    } else if (e.target.dataset.type === 'sqrt') {
      inputOperator('sqrt');
      updateDisplay();
    }
  });
};
clickBtn();

// input operand
const inputOperand = function (operand) {
  if (firstOperator === null) {
    if (displayValue === '0' || displayValue === 0) {
      displayValue = operand;
    } else if (displayValue === firstOperand) {
      displayValue = operand;
    } else {
      displayValue += operand;
    }
  } else {
    if (displayValue === firstOperand) {
      displayValue = operand;
    } else {
      displayValue += operand;
    }
  }
};

// input operator
const inputOperator = function (operator) {
  if (firstOperator != null && secondOperator === null) {
    secondOperator = operator;
    secondOperand = displayValue;
    result = operate(
      Number(firstOperand),
      Number(secondOperand),
      firstOperator
    );
    displayValue = roundAccurately(result, 15).toString();
    firstOperand = displayValue;
    result = null;
  } else if (firstOperator != null && secondOperator != null) {
    secondOperand = displayValue;
    result = operate(
      Number(firstOperand),
      Number(secondOperand),
      secondOperator
    );
    secondOperator = operator;
    displayValue = roundAccurately(result, 15).toString();
    firstOperand = displayValue;
    result = null;
  } else {
    firstOperator = operator;
    firstOperand = displayValue;
  }
};

// input equals
const inputEquals = function () {
  if (firstOperator === null) {
    displayValue = displayValue;
  } else if (secondOperator != null) {
    secondOperand = displayValue;
    result = operate(
      Number(firstOperand),
      Number(secondOperand),
      secondOperator
    );
    if (result === 'Error') {
      displayValue = 'Error';
    } else {
      displayValue = roundAccurately(result, 15).toString();
      firstOperand = displayValue;
      secondOperand = null;
      firstOperator = null;
      secondOperator = null;
      result = null;
    }
  } else {
    secondOperand = displayValue;
    result = operate(
      Number(firstOperand),
      Number(secondOperand),
      firstOperator
    );
    if (result === 'Error') {
      displayValue = 'Error';
    } else {
      displayValue = roundAccurately(result, 15).toString();
      firstOperand = displayValue;
      secondOperand = null;
      firstOperator = null;
      secondOperator = null;
      result = null;
    }
  }
};
const inputDecimal = function (dot) {
  if (displayValue === firstOperand || displayValue === secondOperand) {
    displayValue = '0';
    displayValue += dot;
  } else if (!displayValue.includes(dot)) {
    displayValue += dot;
  }
};

const inputPercent = function (num) {
  displayValue = (num / 100).toString();
};

const inputSign = function (num) {
  displayValue = (num * -1).toString();
};

const clearDisplay = function () {
  displayValue = '0';
  firstOperand = null;
  secondOperand = null;
  firstOperator = null;
  secondOperator = null;
  result = null;
};

const operate = function (x, y, op) {
  if (op === '+') {
    return x + y;
  } else if (op === '-') {
    return x - y;
  } else if (op === '*') {
    return x * y;
  } else if (op === '/') {
    if (y === 0) {
      return 'Error';
    } else {
      return x / y;
    }
  } else if (op === 'exponent') {
    return x ** y;
  } else if (op === 'absolute') {
    return Math.abs(x);
  } else if (op === 'sqrt') {
    return Math.sqrt(x);
  } else if (op === 'factorial') {
    function retFact(x) {
      if (x === 0) return 1;
      return x * retFact(x - 1);
    }
    console.log(retFact(x));
    return retFact(x);
  }
};

const roundAccurately = function (num, places) {
  return parseFloat(Math.round(num + 'e' + places) + 'e-' + places);
};

// minimize function
const minimize = function () {
  screenContainer.style.display = 'none';
  deleteRow.style.display = 'none';
  grid.style.display = 'none';
  calculator.style.height = '44px';
  navBtns.children[1].style.display = 'none';
  navBtns.children[2].classList.remove('hidden');
  calculator.style.position = 'absolute';
  calculator.style.top = '151.5px';
};

const maximize = function () {
  screenContainer.style.display = 'block';
  deleteRow.style.display = 'flex';
  grid.style.display = 'grid';
  calculator.style.height = '550px';
  navBtns.children[1].style.display = 'block';
  navBtns.children[2].classList.add('hidden');
};

//
// EVENTS
//

// deleting
deleteRow.addEventListener('click', function (e) {
  if (!e.target.closest('button')) return;
  if (
    e.target.id !== 'delete-back' &&
    e.target.id !== 'svg' &&
    e.target.id !== 'path'
  ) {
    clearDisplay();
    updateDisplay();
  } else {
    console.log('david');
    if (displayValue)
      displayValue = Number(displayValue.toString().slice(0, -1));
    updateDisplay();
  }
});

// minimizing and maximizing
navBtns.addEventListener('click', function (e) {
  // console.log(e.target);
  if (e.target.querySelector('[id^="mini"]') !== null) {
    console.log(e.target);
    minimize();
  } else if (e.target.querySelector('[id^="maxi"]')) {
    console.log(e.target);
    maximize();
  } else if (e.target.querySelector('[id^="close"]')) {
    if (window.confirm('Do you want to close the tab?')) {
      window.close();
    }
  }
});
