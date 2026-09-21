// ==============================
// GET HTML ELEMENTS
// ==============================

const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");

const clearButton = document.getElementById("clear");
const deleteButton = document.getElementById("delete");
const decimalButton = document.getElementById("decimal");
const equalsButton = document.getElementById("equals");


// ==============================
// CALCULATOR VARIABLES
// ==============================

let currentNumber = "";
let previousNumber = "";
let selectedOperator = "";
let justCalculated = false;


// ==============================
// UPDATE DISPLAY
// ==============================

function updateDisplay() {

    currentDisplay.textContent = currentNumber || "0";

    previousDisplay.textContent =
        previousNumber && selectedOperator
            ? `${previousNumber} ${selectedOperator}`
            : "";
}


// ==============================
// NUMBER BUTTONS
// ==============================

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        const number = button.textContent;

        if (currentNumber === "Error") {
            clearCalculator();
        }

        if (justCalculated) {
            currentNumber = "";
            justCalculated = false;
        }

        // Prevent unnecessary leading zeros
        if (currentNumber === "0") {
            currentNumber = number;
        } else {
            currentNumber += number;
        }

        updateDisplay();

    });

});


// ==============================
// OPERATOR BUTTONS
// ==============================

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (currentNumber === "" || currentNumber === "Error") {
            return;
        }

        // If an operator already exists, calculate first
        if (previousNumber !== "" && selectedOperator !== "") {
            calculate();
        }

        previousNumber = currentNumber;
        currentNumber = "";
        selectedOperator = button.dataset.operator;

        justCalculated = false;

        updateDisplay();

    });

});


// ==============================
// DECIMAL BUTTON
// ==============================

function addDecimal() {

    if (currentNumber === "Error") {
        clearCalculator();
    }

    if (justCalculated) {
        currentNumber = "";
        justCalculated = false;
    }

    // Only allow one decimal point
    if (currentNumber.includes(".")) {
        return;
    }

    currentNumber = currentNumber === ""
        ? "0."
        : currentNumber + ".";

    updateDisplay();
}

decimalButton.addEventListener("click", addDecimal);


// ==============================
// CALCULATE
// ==============================

function calculate() {

    const firstNumber = parseFloat(previousNumber);
    const secondNumber = parseFloat(currentNumber);

    if (isNaN(firstNumber) || isNaN(secondNumber)) {
        return;
    }

    let result;

    switch (selectedOperator) {

        case "+":

            result = firstNumber + secondNumber;

            break;

        case "-":

            result = firstNumber - secondNumber;

            break;

        case "×":

            result = firstNumber * secondNumber;

            break;

        case "÷":

            if (secondNumber === 0) {

                currentNumber = "Error";
                previousNumber = "";
                selectedOperator = "";
                justCalculated = true;

                updateDisplay();

                return;
            }

            result = firstNumber / secondNumber;

            break;

        default:
            return;
    }

    // Remove unnecessary decimal digits
    result = Number(result.toFixed(10));

    currentNumber = String(result);

    previousNumber = "";
    selectedOperator = "";

    justCalculated = true;

    updateDisplay();
}


// ==============================
// EQUALS BUTTON
// ==============================

equalsButton.addEventListener("click", () => {

    if (
        currentNumber === "" ||
        previousNumber === "" ||
        selectedOperator === ""
    ) {
        return;
    }

    calculate();

});


// ==============================
// CLEAR CALCULATOR
// ==============================

function clearCalculator() {

    currentNumber = "";
    previousNumber = "";
    selectedOperator = "";
    justCalculated = false;

    updateDisplay();
}

clearButton.addEventListener("click", clearCalculator);


// ==============================
// DELETE LAST CHARACTER
// ==============================

function deleteLastCharacter() {

    if (
        currentNumber === "" ||
        currentNumber === "Error"
    ) {
        return;
    }

    currentNumber = currentNumber.slice(0, -1);

    updateDisplay();
}

deleteButton.addEventListener("click", deleteLastCharacter);


// ==============================
// KEYBOARD SUPPORT
// ==============================

document.addEventListener("keydown", (event) => {

    const key = event.key;

    // Numbers
    if (key >= "0" && key <= "9") {

        const button = [...numberButtons]
            .find(btn => btn.textContent === key);

        if (button) {
            button.click();
        }

    }

    // Decimal
    else if (key === ".") {

        addDecimal();

    }

    // Operators
    else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        let operator;

        if (key === "*") {
            operator = "×";
        } else if (key === "/") {
            operator = "÷";
        } else {
            operator = key;
        }

        const button = [...operatorButtons]
            .find(btn => btn.dataset.operator === operator);

        if (button) {
            button.click();
        }

    }

    // Enter or =
    else if (key === "Enter" || key === "=") {

        equalsButton.click();

    }

    // Backspace
    else if (key === "Backspace") {

        deleteLastCharacter();

    }

    // Escape
    else if (key === "Escape") {

        clearCalculator();

    }

});