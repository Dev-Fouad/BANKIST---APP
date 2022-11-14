'use strict';
/////////////////////////////////////////////////
// BANKIST APP

// // Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];


// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

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

let displayMovements = function (movements , sort = false) {

  containerMovements.innerHTML = '';

  let movs = sort? movements.slice().sort((a,b) => a-b) : movements
  
  movs.forEach((mov , i) => {

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
  acc.balance = acc.movements.reduce((acc , mov) => acc + mov, 0)

  labelBalance.textContent = `${acc.balance} €`
}

//  Diplaying the Income , out and the interests
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



//  Creating the username 
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

// Updating the UI 
let UpdateUI = function(acc){
  // Display Movements
  displayMovements(acc.movements)

  // Display Balance
  calcDisplayBalance(acc)

  // Display Summary
  calDisplaySummary(acc)
}


// Using the find method to find the current account
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

//  Implementing the transfer  
btnTransfer.addEventListener('click' , function(e) {
  e.preventDefault();

  let amount = Number(inputTransferAmount.value)
  let receiverAcc = accounts.find((acc) => acc.username === inputTransferTo.value) 


  inputTransferAmount.value = inputTransferTo.value = '';

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

btnLoan.addEventListener('click' , function (e) {
  e.preventDefault(); 

  let amount = Number(inputLoanAmount.value);

  if ( amount > 0 && currentAccount.movements.some((mov) => mov >= amount * 0.1)){

    // Add movementt
    currentAccount.movements.push(amount);

    // Update UI
    UpdateUI(currentAccount)
  }
  inputLoanAmount.value = '';
})

btnClose.addEventListener('click' , function(e) {
  e.preventDefault();


  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ){

    let index = accounts.findIndex(acc => acc.username === currentAccount.username)

    console.log(index);

    // Delete account 
    accounts.splice(index , 1)

    // hide UI
    containerApp.style.opacity = 0;

  }
    inputCloseUsername.value = inputClosePin = ''
})


//Implementing the  Sort button
let sorted = false
btnSort.addEventListener('click' , function(e) {
  e.preventDefault();

  displayMovements(currentAccount.movements , !sorted)
  sorted = !sorted

})

