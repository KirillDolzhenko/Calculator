"use strict"

let a = "";
let b = "";
let oper = "";
let roundAmount = 3;
let maxDigitsNumber = 15;

let allNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ","];
let allOperations = ['*', '/', '+', '-', '√', '^', 'log'];
let allOperationsOneAction = ['%', '1/x', 'atg', 'tg', 'sin', 'cos', 'ln', 'lg'];

let calc = document.querySelector(".calc");
let calcBtns = document.querySelector(".calc__btns");
let calcAlert = document.querySelector(".calc__alert");
let calcScreen = document.querySelector(".calc__screen p");


function checkNumMax(num, add = false) {
    if ((num.length + 1) <= maxDigitsNumber) {
        calcAlert.classList.remove("active-element");
        if (add) {
            return num + add;
        } else {
            return num
        }
    } else {
        calcAlert.classList.add("active-element");
        return num
    }

}

function addNum(num) {
    if (oper != "") {
        if (!(b.includes(",") && num == ",")) {
            if ((b == "" && num == "0")) {
                calcScreen.textContent = 0;
            } else if (!(num == ',' && b == "")) {
                b = checkNumMax(b, num)
                calcScreen.textContent = b;
            }
        }
    } else {
        if (!(a.includes(",") && num == ",")) {
            if ((a == "" && num == "0")) {
                calcScreen.textContent = 0;
            } else if (!(num == ',' && a == "")) {
                if (a.includes("e+")) {
                    oper = "*";
                    b = "10";
                    calcResults();
                    oper = "+";
                    b = String(num);
                    calcResults();
                } else {
                    a = checkNumMax(a, num)
                    calcScreen.textContent = a;
                }
            }
        }
    }
}

function transformingNum(num) {

    console.log(num, String(num))
    if (String(num).includes(".") && !String(num).includes("e+")) {
        if ((String(num).split(".")[0].length > (maxDigitsNumber))) {
            return String(num)[0] + '.' + String(num).slice(1, roundAmount + 1) + "e+" + (String(num).split(".")[0].length - 1);
        } else if ((String(num).split(".")[1].length > roundAmount)) {
            if ((String(num).split(".")[0].length > (maxDigitsNumber - (roundAmount + 1)))) {
                return String(num)[0] + '.' + String(num).slice(1, roundAmount + 1) + "e+" + (String(num).split(".")[0].length - 1);
            } else {
                return String(Math.round(num * 10 ** roundAmount) / 10 ** roundAmount);
            }
        } else {
            return String(num)
        }
    } else if (String(num).includes("e+")) {
        let numFloatPart = String(num).split("e+")[0].split(".")[1];
        if ((numFloatPart.length > (roundAmount))) {
            return transformingNum(Number(String(num)[0] + "." + numFloatPart)) + "e+" + (String(num).split("e+")[1]);
        } else {
            return String(num)
        }
    } else if (!String(num).includes(".") && String(num).length > maxDigitsNumber) {
        return String(num)[0] + '.' + String(num).slice(1, roundAmount + 1) + "e+" + (String(num).length - 1);
    } else {
        return String(num)
    }
}

function operation(op) {
    if (oper) {
        if (op == "-" && b == "") {
            b = "-";
            calcScreen.textContent = b;
        } else {
            calcResults();
            oper = op;
            calcScreen.textContent = oper;
        }
    } else {
        if (op == "-" && a == "") {
            a = "-";
            calcScreen.textContent = a;

        } else {
            oper = op;
            calcScreen.textContent = oper;
            b = "";
        }
    }
}

function clearAll() {
    checkNumMax("0")
    a = "";
    b = "";
    oper = ""
    calcScreen.textContent = 0;
}

function viewResults() {

    a = a.replace(",", ".");
    if (isNaN(a)) {
        a = "";
        calcScreen.textContent = "Ошибка";
    } else if (a == Infinity || a == "Infinity") {
        calcScreen.textContent = "∞";
    } else if (a == -Infinity || a == "-Infinity") {
        calcScreen.textContent = "-∞";
    } else {
        a = transformingNum(a);
        a = a.replace(".", ",");
        calcScreen.textContent = a;
        if (+a == 0) {
            a = "";
        }
    }
}

function calcResults() {

    a = a.replace(",", ".");
    b = b.replace(",", ".");
    a = +a;
    switch (oper) {
        case "/":
            a /= +b;
            break;
        case "*":
            a *= +b;
            break;
        case "+":
            a += +b;
            break;
        case "-":
            a -= +b;
            break;
        case "√":
            a **= (1 / +b);
            break;
        case "^":
            a **= +b;
            break;
        case "log":
            a = Math.log(a, +b);
            break;
    }
    a = String(a);
    a = a.replace(".", ",");
    b = "";
    oper = "";
}

function clearOne() {
    checkNumMax(calcScreen.textContent.slice(0, -1));
    if (!oper) {
        if (calcScreen.textContent.length == 1) {
            if (a) {
                a = "";
                calcScreen.textContent = 0;
            }
        } else if (calcScreen.textContent.length == 2) {
            if (a == Infinity) {
                a = "";
                calcScreen.textContent = 0;
            } else if (a == -Infinity) {
                a = "";
                calcScreen.textContent = 0;
            } else {
                a = a.slice(0, -1);
                calcScreen.textContent = a;
            }
        } else {
            if (a.length != 0) {
                if (a[a.length - 2] == ",") {
                    a = a.slice(0, -2);
                } else {
                    a = a.slice(0, -1);
                }
                calcScreen.textContent = a;
            } else {
                a = 0;
                calcScreen.textContent = 0;
            }
        }
    } else {
        if (allOperations.includes(calcScreen.textContent)) {
            oper = "";
            calcScreen.textContent = a;
        } else {
            if (calcScreen.textContent.length == 1 && b == "") {
                oper = "";
                calcScreen.textContent = a;
            } else if (calcScreen.textContent.length == 1) {
                b = "";
                calcScreen.textContent = 0;
            }
            calcScreen.textContent = calcScreen.textContent;
        }
    }
}

function operationOne(op) {
    a = a.replace(",", ".");
    a = +a;
    switch (op) {
        case "%":
            a /= 100;
            break
        case "tg":
            a = Math.tan(a);
            break
        case "sin":
            a = Math.sin(a);
            break
        case "cos":
            a = Math.cos(a);
            break
        case "atg":
            a = Math.atan(a);
            break
        case "ln":
            a = Math.log(a, Math.E);
            break
        case "lg":
            a = Math.log(a, 10);
            break
        case "1/x":
            a = 1 / a;
            break
    }

    a = transformingNum(a);
    if (a == "0") {
        a = "";
        calcScreen.textContent = 0;
    } else if (isNaN(a)) {
        a = "";
        calcScreen.textContent = "Ошибка";
    } else if (a == Infinity || a == "Infinity") {
        calcScreen.textContent = "∞";
    } else if (a == -Infinity || a == "-Infinity") {
        calcScreen.textContent = "-∞";
    } else {
        a = a.replace(".", ",");
        calcScreen.textContent = a;
        if (+a == 0) {
            a = "";
        }
    }
}

calcBtns.addEventListener("click", (e) => {
    let element = e.target;
    if (element.classList.contains("calc__btn")) {
        if (allNumbers.includes(element.textContent)) {
            addNum(element.textContent);
        } else if (allOperations.includes(element.textContent)) {
            operation(element.textContent);
        } else if (element.textContent == "=") {
            calcResults();
            viewResults();
        } else if (element.textContent == "ac") {
            clearAll();
        } else if (element.textContent == "c") {
            clearOne();
        } else if (allOperationsOneAction.includes(element.textContent)) {
            operationOne(element.textContent);
        } else if (element.textContent == "←") {
            calc.classList.toggle("calc-wide");
            console.log("FF")
        }
    }
})