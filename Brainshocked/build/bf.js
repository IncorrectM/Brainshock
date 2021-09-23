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
 *
 *  ^   指针上移
 *  v   指针下移
 *      当 ^(v) 到达 上(下)界， mp会循环
 *
 *  (   注释起点
 *  )   注释终点
 *  当 ( 出现而 ) 未出现时会报错， 而当单独的 ) 出现时不会
 *
 *  =   将当前指针指向位置压入栈中
 *  ~   将栈顶赋值给指针指向位置
 *  *   弹出栈顶值，并将其赋予指针所指位置
 *
 *  :   将指针的值压入栈中
 *      压入值不包括维度值
 *  ;   弹出栈顶值并赋予指针
 *
 *  "   将程序指针的值压入栈中
 *  '   弹出栈顶值并赋予程序指针
 *
 *  @   将指针所指位置归零
 *  忽略不在此表中的其他字符
 */
var OPERATORS = ["+", "-", "<", ">", ".", ",", "[", "]"];
var INITIAL_LENGTH = 16;
var NUM_DIMENSION = 2;
var stdoutVM = console.log;
var BFDVirtualMachine = /** @class */ (function () {
    function BFDVirtualMachine(code) {
        this.step = 0.5;
        this.leftComment = false;
        this.operatorStack = new Array(0);
        this.stack = [];
        this.memories = new Array(NUM_DIMENSION);
        this.curMemory = 0;
        this.program = "";
        this.mp = 0; // memory pointer
        this.pp = 0; // program pointer
        for (var i = 0; i <= NUM_DIMENSION - 1; i++) {
            this.memories[i] = new Array(INITIAL_LENGTH);
        }
        this.memories.forEach(function (mem) {
            for (var i = 0; i <= INITIAL_LENGTH - 1; i++) {
                mem[i] = 0;
            }
        });
        this.program = code;
    }
    BFDVirtualMachine.prototype.pointedValue = function () {
        return this.memories[this.curMemory][this.mp];
    };
    BFDVirtualMachine.prototype.changeAt = function (pos, value) {
        if (pos >= this.memories[this.curMemory].length) {
            stdoutVM("Error: ArrayIndexOutOfBonus: " + pos + ".\n\tAt: " + (this.pp - 1) + " - " + this.program[this.pp]);
            process_1.exit(-1);
        }
        else {
            this.memories[this.curMemory][pos] = value;
        }
    };
    BFDVirtualMachine.prototype.enlarge = function () {
        var newLen = Math.floor(this.memories[this.curMemory].length * this.step);
        while (this.memories[this.curMemory].length <= newLen) {
            this.memories[this.curMemory].push(0);
        }
    };
    BFDVirtualMachine.prototype.nextMem = function () {
        if (this.mp >= this.memories[this.curMemory].length) {
            this.enlarge();
            this.nextMem();
        }
        else {
            this.mp++;
        }
    };
    BFDVirtualMachine.prototype.previousMem = function () {
        if (this.mp == 0) {
            stdoutVM("Error: ArrayIndexOutOfBonus: -1.\n\tAt: " + (this.pp - 1) + " - " + this.program[this.pp]);
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
    BFDVirtualMachine.prototype.setPointed = function (value) {
        this.memories[this.curMemory][this.mp] = Math.abs(value) % 255;
    };
    BFDVirtualMachine.prototype.nextPrg = function () {
        if (!this.hasNextPrg) {
            stdoutVM("Error: Program Pointer out of bonus :" + (this.pp - 1) + ".");
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
            stdoutVM("Error: Program Pointer out of bonus : No previous oeprator.");
            process_1.exit(-1);
        }
        else {
            this.pp--;
        }
    };
    BFDVirtualMachine.prototype.toPreviousLSquare = function () {
        if (this.operatorStack.length == 0) {
            stdoutVM("No paired square bracket found: " + (this.pp - 1) + " - " + this.currentPrg());
            process_1.exit(-1);
        }
        else {
            var tmp = this.operatorStack[this.operatorStack.length - 1];
            // console.log(`\tJumped to ${tmp}`)
            this.pp = tmp - 1;
        }
    };
    BFDVirtualMachine.prototype.newLeftSquare = function () {
        this.operatorStack.push(this.pp + 1);
    };
    BFDVirtualMachine.prototype.newRightSquare = function () {
        if (this.pointedValue() != 0) {
            this.toPreviousLSquare();
        }
        else {
            // console.log(`\t Jump cancelled : ${this.pointedValue()}.`);
            this.operatorStack.pop();
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
    BFDVirtualMachine.prototype.dimensionUp = function () {
        this.curMemory--;
        if (this.curMemory < 0) {
            this.curMemory = this.memories.length - 1;
        }
    };
    BFDVirtualMachine.prototype.dimensionDown = function () {
        this.curMemory++;
        if (this.curMemory >= this.memories.length) {
            this.curMemory = 0;
        }
    };
    BFDVirtualMachine.prototype.currentPrg = function () {
        return this.program[this.pp];
    };
    BFDVirtualMachine.prototype.operate = function (opr) {
        // console.log(`\tOperator: ${opr}`)
        if (this.leftComment) {
            if (opr == ")") {
                // end comment
                // console.log(`\t "{" found, close comment`);
                this.leftComment = false;
            }
            else if (!this.hasNextPrg()) {
                stdoutVM("\n");
                stdoutVM("Unexpected EOF: no ')' found after '('.\nDetailed infomation:");
                this.reportStatus();
                process_1.exit(-1);
            }
            else {
                // console.log(`\thasNextPrg: ${this.hasNextPrg()}\n\tleftComment: ${this.leftComment}\n\tIgnored: ${opr}`);
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
                case "(":
                    this.newLeftComment();
                    break;
                case ")":
                    this.closeComment();
                    break;
                case "^":
                    this.dimensionUp();
                    break;
                case "v":
                    this.dimensionDown();
                    break;
                case "@":
                    this.setPointed(0);
                    break;
                default:
                    // 跳过不在表内的字符
                    break;
            }
        }
    };
    BFDVirtualMachine.prototype.reportStatus = function (num) {
        if (num === void 0) { num = 0; }
        stdoutVM(num + " VirtualMachine\n\tStack: " + this.operatorStack + "\n\tCurrent Memory: " + this.memories[this.curMemory] + "\n");
        // VM_STDOUT(`\tProgram: ${this.program}`);
        stdoutVM("\tleftComment: " + this.leftComment);
        stdoutVM("\tPP: " + this.pp + "\n\tMP: " + this.mp);
        stdoutVM("\tCommand: " + this.currentPrg());
    };
    return BFDVirtualMachine;
}());
function runBF() {
    var vm = new BFDVirtualMachine(source_1.getSource());
    var count = 0;
    while (vm.hasNextPrg()) {
        var opr = vm.currentPrg();
        vm.nextPrg();
        vm.operate(opr);
        // vm.reportStatus(count++);
    }
    process.stdout.write("\n");
}
exports.runBF = runBF;
