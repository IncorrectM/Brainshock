# Brainfucked

Brainfucked is a Brainfuck extension by zzhdev. It's Brainfuck with stack and 2-Dimensional memories.  
Multi-thread support is under discussion.
***

## Overview

Brainfucked operates two arrays of memory cells, each initially set to zero. There is one pointer pointing at the first element of the fisrt array of memeory cells.  
As well as memory cells, Brainfucked has a tiny stack which contains nothing initially.
***

## Commands

***
Brainfucked is backwards compatible with brainfuck: all brainfuck programs work just the same in brainfucked. The command set is the same as brainfuck's, with addition of the following:  
***
**Command** &emsp;&emsp; **Description**  
&emsp;^&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Move mp down.  
&emsp;v&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Move mp up.  
&emsp;=&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Push the value pointed by mp into stack.  
&emsp;~&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Give the value at the top of the stack to where the mp points at.  
&emsp;*&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Pop the value at the top of the stack. If mp is pointing at Dimension One, this command should not change the value where mp pointed at. If mp is pointing at Dimension Two, give the value to where mp points at.  
&emsp;:&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Push the value of mp into stack.  
&emsp;;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Pop the value at the top of the stack and give it to mp.  
&emsp;"&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Push the value of pp into stack.  
&emsp;'&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Pop the value at the top of the stack and give it to pp.  
&emsp;@&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Set the value pointed by mp to zero.  
***
All charactoer other than commands should be ignored as comments.  
A simple implementation of Brainfucked is included in this repository.
