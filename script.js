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
    "2020-11-01T13:15:33.035Z",
    "2020-11-30T09:48:16.867Z",
    "2020-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-11-10T14:43:26.374Z",
    "2022-11-14T18:49:59.371Z",
    "2022-11-15T15:01:20.894Z",
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
    "2020-11-01T13:15:33.035Z",
    "2020-11-30T09:48:16.867Z",
    "2020-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-06-10T14:43:26.374Z",
    "2022-09-12T18:49:59.371Z",
    "2022-11-15T15:01:20.894Z",
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

//
let formatMovementDates = function (date , locale) {
    let calcDaysPassed = (date1, date2) => Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)))

    let DaysPassed = calcDaysPassed(new Date() , date)
    console.log(DaysPassed);
 
    if (DaysPassed === 0) return 'Today';
    if (DaysPassed === 1) return 'Yesterday';
    if (DaysPassed <= 7) return `${DaysPassed} days ago.`
    return new Intl.DateTimeFormat(locale).format(date);
}

let formatCur = function(value , locale , currency){
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,       
    }).format(value)
}



// Display Movements   
let displayMovements = function (acc , sort = false) {

  containerMovements.innerHTML = '';

  let movs = sort 
    ? acc.movements.slice().sort((a,b) => a-b) 
    : acc.movements
  
  movs.forEach((mov , i) => {

    let type = mov > 0 ? 'deposit' : 'withdrawal'

    let date = new Date(acc.movementsDates[i])
    let displayDate = formatMovementDates(date , acc.locale)

    let formattedMov = formatCur(mov ,acc.locale ,acc.currency)

    let html = `

    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>

    `
    containerMovements.insertAdjacentHTML('afterbegin' , html)
  });
}
  

// Displaying the balance
let calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc , mov) => acc + mov, 0)
  let formattedBalance = formatCur(acc.balance ,acc.locale, acc.currency) 
  labelBalance.textContent = `${formattedBalance}`
}


//  Diplaying the Income , out and the interests
let calDisplaySummary = function (acc) {
  let income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc , mov) => acc + mov , 0) 
  labelSumIn.textContent = formatCur(income, acc.locale, acc.currency)

  let Out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc,mov) => acc + mov, 0) 
  labelSumOut.textContent = formatCur(Math.abs(Out), acc.locale, acc.currency)

  let interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate / 100))
    .filter((int , i , arr) => {
      console.log(arr);
      return int >= 1
    })
    .reduce((acc , int) => acc + int, 0)
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency)
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
// const accounts = [account1, account2];


// Updating the UI 
let UpdateUI = function(acc){
  // Display Movements
  displayMovements(acc)

  // Display Balance
  calcDisplayBalance(acc)

  // Display Summary
  calDisplaySummary(acc)
}


// Using the find method to find the current account
let currentAccount;

// FAKE ALWAYS LOGGED IN
currentAccount = account1
UpdateUI(currentAccount)
containerApp.style.opacity = 100;



btnLogin.addEventListener('click' , function (e) {
  // Prevent form from submitting
  e.preventDefault();

 // const accounts = [account1, account2];
  currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value)
  console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;

    // Create current date and time.
    let now = new Date();
    let options = {
        hour: 'numeric',
        minute: 'numeric',
        day: 'numeric',
        month: 'numeric'
    }
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale , options).format(now)

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

      // Add transfer Date
      currentAccount.movementsDates.push(new Date().toISOString())
      receiverAcc.movementsDates.push(new Date().toISOString())

      // Update UI
      UpdateUI(currentAccount)
    }  
})


// Implementing the loan button.
btnLoan.addEventListener('click' , function (e) {
  e.preventDefault(); 

  let amount = Math.floor(inputLoanAmount.value);

  if ( amount > 0 && currentAccount.movements.some((mov) => mov >= amount * 0.1)){
    setTimeout(function(){
        // Add movement
        currentAccount.movements.push(amount);

        // Add loan date
        currentAccount.movementsDates.push(new Date().toISOString())

        // Update UI
        UpdateUI(currentAccount)
    },2500)
  }
  inputLoanAmount.value = '';
})


// Implementing the close button
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
//     inputCloseUsername.value = inputClosePin = ''

})


//Implementing the  Sort button
let sorted = false
btnSort.addEventListener('click' , function(e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted)
  sorted = !sorted

})

let future = new Date( 2037,10,19)
console.log(future);

let calcDaysPassed = (date1, date2) => Math.round((date2 - date1) / (1000 * 60 * 60 * 24))

let day1 = calcDaysPassed(new Date(2037,3,4) ,new Date (2037 , 3, 14 , 10 ,8))
console.log(day1);
