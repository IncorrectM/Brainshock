import { V4MAPPED } from "dns";
import { exit } from "process";
import { getSource } from "./source";

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
 *  (   注释起点
 *  )   注释重点
 *  当 ( 出现而 ) 未出现时会报错， 而当单独的 ) 出现时不会
 *  =   将当前指针指向位置压入栈中
 *  压入值不包括维度值
 *  ~   将栈顶赋值给指针指向位置
 *  *   弹出栈顶值，并将其赋予指针所指位置
 *  :   将指针的值压入栈中
 *  ;   弹出栈顶值并赋予指针
 *  "   将程序指针的值压入栈中
 *  '   弹出栈顶值并赋予程序指针
 *  @   将指针所指位置归零
 *  忽略不在此表中的其他字符
 */
const OPERATORS: string[] = ["+", "-", "<", ">", ".", ",", "[", "]"];
const INITIAL_LENGTH = 16;
const NUM_DIMENSION = 2;

class BFDVirtualMachine {
    private step: number = 0.5;

    private leftComment: boolean = false;
    private operatorStack: number[] = new Array(0);
    private stack: number[] = [];

    private memories: number[][] = new Array(NUM_DIMENSION);
    private curMemory: number = 0;
    private program: string = "";

    private mp: number = 0; // memory pointer
    private pp: number = 0; // program pointer

    constructor(code: string) {
        for (let i = 0; i <= NUM_DIMENSION - 1; i++) {
            this.memories[i] = new Array(INITIAL_LENGTH);
        }
        this.memories.forEach(mem => {
            for (let i = 0; i <= INITIAL_LENGTH - 1; i++) {
                mem[i] = 0;
            }
        })
        this.program = code;
    }


    private pointedValue(): number {
        return this.memories[this.curMemory][this.mp];
    }

    private changeAt(pos: number, value: number) {
        if (pos >= this.memories[this.curMemory].length) {
            console.log(`Error: ArrayIndexOutOfBonus: ${pos}.\n\tAt: ${this.pp} - ${this.program[this.pp]}`);
            exit(-1);
        } else {
            this.memories[this.curMemory][pos] = value;
        }
    }

    private enlarge(): void {
        const newLen = Math.floor(this.memories[this.curMemory].length * this.step);
        while (this.memories[this.curMemory].length <= newLen) {
            this.memories[this.curMemory].push(0);
        }
    }

    private nextMem(): void {
        if (this.mp >= this.memories[this.curMemory].length) {
            this.enlarge();
            this.nextMem();
        } else {
            this.mp++;
        }
    }

    private previousMem(): void {
        if (this.mp == 0) {
            console.log(`Error: ArrayIndexOutOfBonus: -1.\n\tAt: ${this.pp} - ${this.program[this.pp]}`);
            exit(-1);
        } else {
            this.mp--;
        }
    }

    private add(): void {
        const curValue = this.pointedValue();
        if (curValue >= 255) {
            this.changeAt(this.mp, 0);
        } else {
            this.changeAt(this.mp, curValue + 1);
        }
    }

    private sub(): void {
        const curValue = this.pointedValue();
        if (curValue <= 0) {
            this.changeAt(this.mp, 255);
        } else {
            this.changeAt(this.mp, curValue - 1);
        }
    }

    public nextPrg(): string {
        if (!this.hasNextPrg) {
            console.log(`Error: Program Pointer out of bonus :${this.pp}.`);
            exit(-1);
        } else {
            this.pp++;
            return this.program[this.pp];
        }
    }

    public hasNextPrg(): boolean {
        return this.pp < this.program.length;
    }

    private previousPrg(): void {
        if (this.pp <= 0) {
            console.log(`Error: Program Pointer out of bonus : No previous oeprator.`);
            exit(-1);
        } else {
            this.pp--;
        }
    }

    private toPreviousLSquare(): void {
        if (this.operatorStack.length == 0) {
            console.log(`No paired square bracket found: ${this.pp} - ${this.currentPrg()}`);
            exit(-1);
        } else {
            const tmp = this.operatorStack[this.operatorStack.length - 1];
            // console.log(`\tJumped to ${tmp}`)
            this.pp = tmp - 1;
        }
    }

    private newLeftSquare(): void {
        this.operatorStack.push(this.pp + 1);
    }

    private newRightSquare(): void {
        if (this.pointedValue() != 0) {
            this.toPreviousLSquare();
        } else {
            // console.log(`\t Jump cancelled : ${this.pointedValue()}.`);
            this.operatorStack.pop();
        }
    }

    private printCurrent(): void {
        process.stdout.write(this.getCurrent());
    }

    private getCurrent(): string {
        return String.fromCharCode(this.pointedValue());
    }

    private newLeftComment(): void {
        this.leftComment = true;
    }

    private closeComment(): void {
        this.leftComment = false;
    }

    private dimensionUp(): void {
        this.curMemory--;
        if (this.curMemory < 0) {
            this.curMemory = this.memories.length - 1;
        }
    }

    private dimensionDown(): void {
        this.curMemory++;
        if (this.curMemory >= this.memories.length) {
            this.curMemory = 0;
        }
    }

    public currentPrg(): string {
        return this.program[this.pp];
    }

    public operate(opr: string): void {
        // console.log(`\tOperator: ${opr}`)
        if (this.leftComment) {
            if (opr == ")") {
                // end comment
                // console.log(`\t "{" found, close comment`);
                this.leftComment = false;
            } else if (!this.hasNextPrg()) {
                console.log("\n");
                console.log(`Unexpected EOF: no ')' found after '('.\nDetailed infomation:`);
                this.reportStatus();
                exit(-1);
            } else {
                // console.log(`\thasNextPrg: ${this.hasNextPrg()}\n\tleftComment: ${this.leftComment}\n\tIgnored: ${opr}`);
                // skip
            }
        } else {
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
                default:
                    // 跳过不在表内的字符
                    break;
            }
        }
    }

    public reportStatus(num: number = 0) {
        console.log(`${num} VirtualMachine\n\tStack: ${this.operatorStack}\n\tCurrent Memory: ${this.memories[this.curMemory]}\n`);
        // console.log(`\tProgram: ${this.program}`);
        console.log(`\tleftComment: ${this.leftComment}`);
        console.log(`\tPP: ${this.pp}\n\tMP: ${this.mp}`);
        console.log(`\tCommand: ${this.currentPrg()}`);
    }
}

function runBF(): void {
    const vm = new BFDVirtualMachine(getSource());
    let count = 0;
    while (vm.hasNextPrg()) {
        const opr: string = vm.currentPrg();
        vm.nextPrg();
        vm.operate(opr);
        // vm.reportStatus(count++);
    }
    process.stdout.write("\n");
}

export { runBF };