const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-paasswordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#upperCase");
const lowercaseCheck = document.querySelector("#Lowercase");
const numberCheck = document.querySelector("#Numbers");
const symbolCheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordlength = 10;
let checkCount = 0;
handleSlider();
//set indicator color to the gray
setIndicator("#ccc");

function handleSlider() {
  inputSlider.value = passwordlength;
  lengthDisplay.innerText = passwordlength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =((passwordlength - min)/ (max - min)  * 100) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow to the indicator

  indicator.style.boxShadow = "0px 0px 12px 1px" + color;
}

function getrndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getrandomNumber() {
  return getrndInteger(0, 9);
}

function generatelowerCase() {
  return String.fromCharCode(getrndInteger(97, 123));
}
function generateupperCase() {
  return String.fromCharCode(getrndInteger(65, 91));
}

function generateSymbol() {
  let randNum = getrndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcSrength() {
  let hasupNum = false;
  let haslowNum = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasupNum = true;
  if (lowercaseCheck.checked) haslowNum = true;
  if (symbolCheck.checked) hasSym = true;
  if (numberCheck.checked) hasNum = true;

  if (hasNum && hasSym && (hasupNum || haslowNum) && passwordlength >= 10) {
    setIndicator("#0f0");
  } else if (
    (hasNum || hasSym) &&
    (haslowNum || hasupNum) &&
    passwordlength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }

  //for making visible
  copyMsg.classList.add("active");
  //for making invisble
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function handlecheckboxChnage() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
    // special condition
    if (passwordlength < checkCount) {
      passwordlength = checkCount;
      handleSlider();
    }
  });
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handlecheckboxChnage);
});

inputSlider.addEventListener("input", (e) => {
  passwordlength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", (e) => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

//shuffling function

function shufflePassword(array) {
  //fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

generateBtn.addEventListener("click", () => {
  // non of check is selected then
  if (checkCount <= 0) return;
  if (passwordlength < checkCount) {
    passwordlength = checkCount;
    handleSlider();
  }
  console.log("Starting jounery");

  //remove old password
  password = "";

  let funArr = [];

  if (uppercaseCheck.checked) {
    funArr.push(generateupperCase);
  }
  if (lowercaseCheck.checked) {
    funArr.push(generatelowerCase);
  }
  if (numberCheck.checked) {
    funArr.push(getrandomNumber);
  }
  if (symbolCheck.checked) {
    funArr.push(generateSymbol);
  }

  //complusory addition
  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }
  console.log("complusory done");

  //remaining password

  for (let i = 0; i < passwordlength - funArr.length; i++) {
    let rnxdNum = getrndInteger(0, funArr.length);

    password += funArr[rnxdNum]();
  }
  console.log("remaining done");

  // shufle password
  password = shufflePassword(Array.from(password));
  console.log("Shufling done");

  // display the password to the screen

  passwordDisplay.value = password;
  console.log("UI");

  // to calaculate strength

  calcSrength();
});
