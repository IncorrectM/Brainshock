"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBF = void 0;
var process_1 = require("process");
var source_1 = require("./source");
/** Operators
 *  约定：指针特指内存指针
 *  >	指针右移一个元素
 *  <	指针左移一个元素
 *  +	指针当前所指元素加1
 *  -	指针当前所指元素减1
 *  .	输出指针所指元素对应字符
 *  ,	输入字符的ASCII码值到指针所指元素 暂未实现
 *  [	若指针所指元素为0，则跳转到对应']'处继续执行
 *  ]	若指针所指元素不为0，则跳转至对应'['处继续执行
 *  ^   指针上移
 *  v   指针下移
 *  当 ^(v) 到达 上(下)界， mp会循环
 *  {   注释起点
 *  }   注释重点
 *  当 { 出现而 } 未出现时会报错， 而当单独的 } 出现时不会
 *  =   将当前指针指向位置压入栈中
 *  ~   将栈顶赋值给指针指向位置
 *  *   弹出栈顶值，若指针指向一维则不赋值，指向二维则将栈顶值赋予指针所指位置
 *  :   将指针的值压入栈中
 *  ;   弹出栈顶值并赋予指针
 *  "   将程序指针的值压入栈中
 *  '   弹出栈顶值并赋予程序指针
 *  @   将指针所指位置归零
 *  忽略不在此表中的其他字符
 */
var OPERATORS = ["+", "-", "<", ">", ".", ",", "[", "]"];
var INITIAL_LENGTH = 16;
var BFDVirtualMachine = /** @class */ (function () {
    function BFDVirtualMachine(code) {
        this.step = 0.5;
        this.leftComment = false;
        this.stack = new Array(0);
        this.memory = [];
        this.program = "";
        this.mp = 0; // memory pointer
        this.pp = 0; // program pointer
        this.memory = new Array(INITIAL_LENGTH);
        for (var i = 0; i <= INITIAL_LENGTH - 1; i++) {
            this.memory[i] = 0;
        }
        this.program = code;
    }
    BFDVirtualMachine.prototype.pointedValue = function () {
        return this.memory[this.mp];
    };
    BFDVirtualMachine.prototype.changeAt = function (pos, value) {
        if (pos >= this.memory.length) {
            console.log("Error: ArrayIndexOutOfBonus: " + pos + ".\n\tAt: " + this.pp + " - " + this.program[this.pp]);
            process_1.exit(-1);
        }
        else {
            this.memory[pos] = value;
        }
    };
    BFDVirtualMachine.prototype.enlarge = function () {
        var newLen = Math.floor(this.memory.length * this.step);
        while (this.memory.length <= newLen) {
            this.memory.push(0);
        }
    };
    BFDVirtualMachine.prototype.nextMem = function () {
        if (this.mp >= this.memory.length) {
            this.enlarge();
            this.nextMem();
        }
        else {
            this.mp++;
        }
    };
    BFDVirtualMachine.prototype.previousMem = function () {
        if (this.mp == 0) {
            console.log("Error: ArrayIndexOutOfBonus: -1.\n\tAt: " + this.pp + " - " + this.program[this.pp]);
            process_1.exit(-1);
        }
        else {
            this.mp--;
        }
    };
    BFDVirtualMachine.prototype.add = function () {
        var curValue = this.pointedValue();
        if (curValue >= 255) {
            this.changeAt(this.mp, 0);
        }
        else {
            this.changeAt(this.mp, curValue + 1);
        }
    };
    BFDVirtualMachine.prototype.sub = function () {
        var curValue = this.pointedValue();
        if (curValue <= 0) {
            this.changeAt(this.mp, 255);
        }
        else {
            this.changeAt(this.mp, curValue - 1);
        }
    };
    BFDVirtualMachine.prototype.nextPrg = function () {
        if (!this.hasNextPrg) {
            console.log("Error: Program Pointer out of bonus :" + this.pp + ".");
            process_1.exit(-1);
        }
        else {
            this.pp++;
            return this.program[this.pp];
        }
    };
    BFDVirtualMachine.prototype.hasNextPrg = function () {
        return this.pp < this.program.length;
    };
    BFDVirtualMachine.prototype.previousPrg = function () {
        if (this.pp <= 0) {
            console.log("Error: Program Pointer out of bonus : No previous oeprator.");
            process_1.exit(-1);
        }
        else {
            this.pp--;
        }
    };
    BFDVirtualMachine.prototype.toPreviousLSquare = function () {
        if (this.stack.length == 0) {
            console.log("No paired square bracket found: " + this.pp + " - " + this.currentPrg());
            process_1.exit(-1);
        }
        else {
            var tmp = this.stack[this.stack.length - 1];
            // console.log(`\tJumped to ${tmp}`)
            this.pp = tmp - 1;
        }
    };
    BFDVirtualMachine.prototype.newLeftSquare = function () {
        this.stack.push(this.pp + 1);
    };
    BFDVirtualMachine.prototype.newRightSquare = function () {
        if (this.pointedValue() != 0) {
            this.toPreviousLSquare();
        }
        else {
            // console.log(`\t Jump cancelled : ${this.pointedValue()}.`);
            this.stack.pop();
        }
    };
    BFDVirtualMachine.prototype.printCurrent = function () {
        process.stdout.write(this.getCurrent());
    };
    BFDVirtualMachine.prototype.getCurrent = function () {
        return String.fromCharCode(this.pointedValue());
    };
    BFDVirtualMachine.prototype.newLeftComment = function () {
        this.leftComment = true;
    };
    BFDVirtualMachine.prototype.closeComment = function () {
        this.leftComment = false;
    };
    BFDVirtualMachine.prototype.currentPrg = function () {
        return this.program[this.pp];
    };
    BFDVirtualMachine.prototype.operate = function (opr) {
        // console.log(`\tOperator: ${opr}`)
        if (this.leftComment) {
            if (opr == "}") {
                // end comment
                this.leftComment = false;
            }
            else if (!this.hasNextPrg()) {
                console.log("Unexpected EOF: no '}' found after '{'.");
                process_1.exit(-1);
            }
            else {
                // skip
            }
        }
        else {
            switch (opr) {
                case "+":
                    this.add();
                    break;
                case "-":
                    this.sub();
                    break;
                case ".":
                    this.printCurrent();
                    break;
                case "<":
                    this.previousMem();
                    break;
                case ">":
                    this.nextMem();
                    break;
                case "[":
                    this.newLeftSquare();
                    break;
                case "]":
                    this.newRightSquare();
                    break;
                case ",":
                    // TODO: 赋值
                    break;
                case "{":
                    this.newLeftComment();
                    break;
                case "}":
                    this.closeComment();
                    break;
                default:
                    // 跳过不在表内的字符
                    break;
            }
        }
    };
    BFDVirtualMachine.prototype.reportStatus = function (num) {
        if (num === void 0) { num = 0; }
        console.log(num + " VirtualMachine\n\tStack: " + this.stack + "\n\tMemort: " + this.memory + "\n\tProgram: " + this.program);
        console.log("\tPP: " + this.pp + "\n\tMP: " + this.mp);
        console.log("\tCommand: " + this.currentPrg());
    };
    return BFDVirtualMachine;
}());
function runBF() {
    var vm = new BFDVirtualMachine(source_1.getSource());
    var count = 0;
    while (vm.hasNextPrg()) {
        var opr = vm.currentPrg();
        vm.operate(opr);
        vm.reportStatus(count++);
        vm.nextPrg();
    }
    process.stdout.write("\n");
}
exports.runBF = runBF;
