# Brainshock

Brainshock is a Brainfuck extension by zzhdev. It's Brainfuck with stack and Multi-Dimensional memories.  
***

## Overview

Brainshock operates two arrays of memory cells, each initially set to zero. There is one pointer pointing at the first element of the fisrt array of memeory cells.  
As well as memory cells, Brainshock has a tiny stack which contains nothing initially.
***

## Commands

Brainshock is backwards compatible with Brainfuck: all Brainfuck programs work just the same in Brainshock. The command set is the same as brainfuck's, with addition of the following:  
***
|***Command***|***Description***|
|     ----    |       ----      |
|^            |Move ```mp``` down.  |
|v            |Move ```mp``` up.  |
|=            |Push the value pointed by ```mp``` into stack.  |
|~            |Give the value at the top of the stack to where ```mp``` points at.  |
|*            |Pop the value at the top of the stack. Give the value to the position pointed by ```mp```.|
|:            |Push the value of ```mp``` into stack.  |
|;            |Pop the value at the top of the stack and give it to ```mp```.  |
|"            |Push the value of ```pp``` into stack.  |
|'            |Pop the value at the top of the stack and give it to ```pp```.  |
|@            |Set the value pointed by ```mp``` to zero.  |
|(            |Start comment.  |
|)            |End comment.|

Notice:  

1. command ^ and v loop when upper(lower) bound is exeeded.
2. unpaired ( will cause exceptio will a single ) will not.
3. commands are interpreted one by one.
4. command = won't push the value of dimension.  

***
All charactoer other than commands should be ignored as comments.  
A simple implementation of Brainshock(Brainshocked) is included in this repository.
