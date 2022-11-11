'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let displayMovements = function (movements) {

  containerMovements.innerHTML = '';

  movements.forEach((mov , i) => {

    let type = mov > 0 ? 'deposit' : 'withdrawal'

    let html = `

    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>

    `

    containerMovements.insertAdjacentHTML('afterbegin' , html)
  });

}
  


let calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc , mov) => {
    return acc + mov
  }, 0)

  labelBalance.textContent = `${acc.balance} €`
}


let calDisplaySummary = function (acc) {
  let income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc , mov) => acc + mov , 0) 
  labelSumIn.textContent = `${income}€`

  let Out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc,mov) => acc + mov, 0) 
  labelSumOut.textContent = `${Math.abs(Out)}€`  

  let interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate / 100))
    .filter((int , i , arr) => {
      console.log(arr);
      return int >= 1
    })
    .reduce((acc , int) => acc + int, 0)
  labelSumInterest.textContent = `${interest}€`  
};




let createUserName = function(accts) {

  accts.forEach((acc) => {

    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('')
  })

}
createUserName(accounts)
// const accounts = [account1, account2, account3, account4];
console.log(accounts);

let UpdateUI = function(acc){
  // Display Movements
  displayMovements(acc.movements)

  // Display Balance
  calcDisplayBalance(acc)

  // Display Summary
  calDisplaySummary(acc)
}

let currentAccount;
// Event Handler
btnLogin.addEventListener('click' , function (e) {
  // Prevent form from submitting
  e.preventDefault();

// const accounts = [account1, account2, account3, account4];
  currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value)
  console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur();

    UpdateUI(currentAccount)

  }
})


btnTransfer.addEventListener('click' , function(e) {
  e.preventDefault();

  let amount = Number(inputTransferAmount.value)
  let receiverAcc = accounts.find((acc) => acc.username === inputTransferTo.value) 


  inputTransferAmount.value = inputTransferTo.value = ''
  if( amount > 0 && 
      receiverAcc &&
      currentAccount.balance >= amount &&
      receiverAcc.username !== currentAccount.username
    ){
      // Doing the Transfer
      currentAccount.movements.push(-amount)
      receiverAcc.movements.push(amount)

      // Update UI
      UpdateUI(currentAccount)
    }  
})
