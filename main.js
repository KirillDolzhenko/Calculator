"use strict"
import {
    OverlayScrollbars
} from './overlayscrollbars.js';

let a;

if (localStorage.getItem("number")) {
    a = (localStorage.getItem("number") == "0") ? "" : localStorage.getItem("number");
} else {
    a = '';
}

let b = "";
let oper = "";
let historyBufer = "";
let roundAmount = 3;
let maxDigitsNumber = 15;

let allNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ","];
let allOperations = ['*', '/', '+', '-', '√', '^', 'log'];
let allOperationsOneAction = ['%', '1/x', 'atg', 'tg', 'sin', 'cos', 'ln', 'lg'];

let historyEmptyElement = document.createElement("p")
historyEmptyElement.classList.add("calc__history-text")
historyEmptyElement.textContent = "Тут пока-что пусто";

let calcHistoryList = document.querySelector(".calc__history-list");
OverlayScrollbars(calcHistoryList, {});
calcHistoryList = document.querySelector(".calc__history-list>div:nth-child(2)");

let calc = document.querySelector(".calc");
let calcBtns = document.querySelector(".calc__btns");
let calcAlert = document.querySelector(".calc__alert");
let calcScreen = document.querySelector(".calc__screen p");
let calcHistoryBtn = document.querySelector(".calc__history-button");
let calcHistoryContainer = document.querySelector(".calc__history-container");

calcScreen.textContent = getLocalStorageNum(localStorage.getItem("number"));

function historyCheckEmptiness() {
    if (document.querySelector(".calc__history-item")) {
        if (document.querySelector(".calc__history-text")) {
            document.querySelector(".calc__history-text").remove();
        }
    } else {
        calcHistoryList.appendChild(historyEmptyElement);
    }
}

function constructorOfHistoryItem(info, result) {
    if (info) {
        while (info.includes("looog(") || info.includes("^") || info.includes("sqrt")) {
            if (info.includes("^")) {
                info = info.split("^")[0] + `<span class="calc__history-small-number calc__history-small-number-high">${info.split("^")[1]}</span>`;
            } else if (info.includes("looog(")) {
                info = "log" + `<span class="calc__history-small-number calc__history-small-number">${info.split("looog(")[1].split("f)")[0]}</span>(${info.split("looog(")[0]})`;
            } else if (info.includes("sqrt")) {
                info = `<span class="calc__history-small-number calc__history-small-number-high">${info.split("sqrt(")[1].split("sq)")[0]}</span>√${info.split("sqrt(")[0]}`;
            }
        }

        calcHistoryList.insertAdjacentHTML("beforeend", `
        <li class="calc__history-item">
            <p class="calc__history-actions">${info}</p>
            <p class="calc__history-result">${result}</p>
        </li>
        `);

        historyCheckEmptiness()
    }
}

function constructorOfHistoryBufer(num1, oper, bufer, num2) {
    // debugger
    if (num1 == Infinity) {
        num1 = "∞";
    } else if (num1 == -Infinity) {
        num1 = "-∞";
    }

    if (bufer) {
        num1 = `(${bufer})`
    }

    num1 = (!String(num1)) ? "0" : num1;
    num2 = (!String(num2)) ? "0" : num2;

    if (num2) {
        if (oper == "log") {
            return `${num1}looog(${num2}f)`;
        } else if (oper == "√") {
            return `${num1}sqrt(${num2}sq)`;
        } else if (num1 == "0" || num1 == "") {
            return ''
        } else {
            return `${num1}${oper}${num2}`
        }
    } else {
        if (oper == "1/x") {
            if (!num1) {
                return `1/0`
            } else {
                return `1/${num1}`
            }
        } else {
            return `${oper}${num1}`
        }
    }
}

function convertStringToNum(s) {
    if (s == "∞") {
        return "Infinity";
    } else if (s == "-∞") {
        return "-Infinity";
    } else if (s == "0") {
        return "";
    } else {
        return s;
    }
}

function getLocalStorageNum(item) {
    console.log(item)
    if (item == Infinity) {
        return "∞";
    } else if (item == -Infinity) {
        return "-∞";
    } else {
        if (item) {
            return item
        } else {
            return 0;
        }
    }
}

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
            } else if ((a == "-Infinity" || a == "Infinity")) {
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
    oper = "";
    historyBufer = "";
    calcScreen.textContent = 0;
}

function viewResults() {
    // debugger
    a = a.replace(",", ".");
    if (isNaN(a)) {
        a = "";
        calcScreen.textContent = "Ошибка";
        localStorage.setItem("number", "");
    } else if (a == Infinity) {
        calcScreen.textContent = "∞";
        constructorOfHistoryItem(historyBufer, "∞")
        localStorage.setItem("number", a);
    } else if (a == -Infinity) {
        calcScreen.textContent = "-∞";
        constructorOfHistoryItem(historyBufer, "-∞")
        localStorage.setItem("number", a);
    } else {
        a = transformingNum(a);
        a = a.replace(".", ",");
        calcScreen.textContent = a;
        constructorOfHistoryItem(historyBufer, a)
        localStorage.setItem("number", a);
        if (+a == 0) {
            a = "";
        }
    }
    historyBufer = "";
}

function calcResults() {
    // debugger
    if (oper) {
        historyBufer = constructorOfHistoryBufer(a, oper, historyBufer, b);
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
        b = b.replace(".", ",");
        b = "";
        oper = "";
    }
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
            calcScreen.textContent = a ? a : 0;
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

    if (a == "0") {
        historyBufer = constructorOfHistoryBufer("0", op, historyBufer);
    } else if (a == "Infinity") {
        historyBufer = constructorOfHistoryBufer("∞", op, historyBufer);
    } else if (a == "-Infinity") {
        historyBufer = constructorOfHistoryBufer("-∞", op, historyBufer);
    } else {
        historyBufer = constructorOfHistoryBufer(a, op, historyBufer);
    }

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
        constructorOfHistoryItem(historyBufer, 0)
    } else if (isNaN(a)) {
        a = "";
        historyBufer = "";
        calcScreen.textContent = "Ошибка";
        localStorage.setItem("number", "");
    } else if (a == Infinity) {
        calcScreen.textContent = "∞";
        constructorOfHistoryItem(historyBufer, "∞")
        localStorage.setItem("number", Infinity);
    } else if (a == -Infinity) {
        calcScreen.textContent = "-∞";
        constructorOfHistoryItem(historyBufer, "-∞")
        localStorage.setItem("number", -Infinity);
    } else {
        a = a.replace(".", ",");
        calcScreen.textContent = a;
        constructorOfHistoryItem(historyBufer, a)
        localStorage.setItem("number", a);
        if (+a == 0) {
            a = "";
            localStorage.setItem("number", "");
        }
    }
    historyBufer = "";
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

calcHistoryBtn.addEventListener("click", (e) => {
    calcHistoryContainer.classList.toggle("active-element")
})

calcHistoryList.addEventListener("click", (e) => {
    console.log("1")
    let element = e.target.closest(".calc__history-item");

    if (element.classList.contains("calc__history-item")) {
        console.log("2")
        clearAll();
        let historyElement = element.querySelector(".calc__history-result");
        calcScreen.textContent = historyElement.textContent;
        a = convertStringToNum(historyElement.textContent);
        element.remove();
        historyCheckEmptiness()
    }
})