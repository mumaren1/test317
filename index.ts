let a: string
let b: number
let c: boolean

a = 'hello'
b = -99
c = true

console.log(a, b, c)

function count(x: number, y: number): number {
    return x + y
}

count(1, 2)

// 定义一个对象常量
const person = {
    name: '张三',
    age: 18
};
console.log(`我叫${person.name}, 我今年${person.age}岁了`);


// 定义一个对象类型
let person3: {
    name: string
    age?: number
}
person3 = {name:'王五'}



// 声明变量时只定义类型，不赋值
let numArr: number[];
let strArr: Array<string>;
// let strArr: string[];

// 后续再赋值
numArr = [1, 2, 3, 4, 5];
strArr = ['apple', 'banana', 'orange'];

console.log(numArr); // [1, 2, 3, 4, 5]
console.log(strArr); // ['apple', 'banana', 'orange']

// 声明成元组
let arr1: [string,number]
arr1 = ['hello',123]
let arr3: [number,...string[]]
arr3 = [100,'hello','world']