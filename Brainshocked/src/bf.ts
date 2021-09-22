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
 *  {   注释起点
 *  }   注释重点
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
const OPERATORS: string[] = ["+", "-", "<", ">", ".", ",", "[", "]"];
const INITIAL_LENGTH = 16;

class BFDVirtualMachine {
    private step: number = 0.5;

    private stack: number[] = new Array(0);
    private memory: number[] = [];
    private program: string = "";

    private mp: number = 0; // memory pointer
    private pp: number = 0; // program pointer

    constructor(code: string) {
        this.memory = new Array(INITIAL_LENGTH);
        for (let i = 0; i <= INITIAL_LENGTH - 1; i++) {
            this.memory[i] = 0;
        }
        this.program = code;
    }


    private pointedValue(): number {
        return this.memory[this.mp];
    }

    private changeAt(pos: number, value: number) {
        if (pos >= this.memory.length) {
            console.log(`Error: ArrayIndexOutOfBonus: ${pos}.\n\tAt: ${this.pp} - ${this.program[this.pp]}`);
            exit(-1);
        } else {
            this.memory[pos] = value;
        }
    }

    private enlarge(): void {
        const newLen = Math.floor(this.memory.length * this.step);
        while (this.memory.length <= newLen) {
            this.memory.push(0);
        }
    }

    private nextMem(): void {
        if (this.mp >= this.memory.length) {
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
        if (this.stack.length == 0) {
            console.log(`No paired square bracket found: ${this.pp} - ${this.currentPrg()}`);
            exit(-1);
        } else {
            const tmp = this.stack[this.stack.length - 1];
            // console.log(`\tJumped to ${tmp}`)
            this.pp = tmp - 1;
        }
    }

    private newLeftSquare(): void {
        this.stack.push(this.pp + 1);
    }

    private newRightSquare(): void {
        if (this.pointedValue() != 0) {
            this.toPreviousLSquare();
        } else {
            // console.log(`\t Jump cancelled : ${this.pointedValue()}.`);
            this.stack.pop();
        }
    }

    private printCurrent(): void {
        process.stdout.write(this.getCurrent());
    }

    private getCurrent(): string {
        return String.fromCharCode(this.pointedValue());
    }

    public currentPrg(): string {
        return this.program[this.pp];
    }

    public operate(opr: string): void {
        // console.log(`\tOperator: ${opr}`)
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
                // 未完成
                break;
            default:
                // 跳过不在表内的字符
                break;
        }
    }

    public reportStatus(num: number = 0) {
        console.log(`${num} VirtualMachine\n\tStack: ${this.stack}\n\tMemort: ${this.memory}\n\tProgram: ${this.program}`);
        console.log(`\tPP: ${this.pp}\n\tMP: ${this.mp}`);
    }
}

function runBF(): void {
    const vm = new BFDVirtualMachine(getSource());
    let count = 0;
    while (vm.hasNextPrg()) {
        const opr: string = vm.currentPrg();
        vm.operate(opr);
        // vm.reportStatus(count++);
        vm.nextPrg();
    }
    process.stdout.write("\n");
}

export { runBF };