
// 联合类型是⼀种⾼级类型,它表示⼀个值可以是⼏种不同类型之⼀
type Status = number | string;
type Gender = '男' | '女';

function printStatus(status: Status) {
	console.log(status);
}

function logGender(str: Gender) {
	console.log(str);
}

printStatus(404);
printStatus('200');
printStatus('501');

logGender('男');
logGender('女')

// 声明一个类
class Person {
  // 属性
  name: string
  age: number

  // 构造器
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  // 方法
  sayHi() {
    console.log(`我是${this.name}，今年${this.age}岁`)
  }
}

// 实例化
const p = new Person("张三", 18)
p.sayHi()



class Student {
  constructor(public name: string,public age: number
  ) {}

  study() {
    console.log("学习中")
  }
}

const s = new Student("小明", 20)
console.log(s.name)

// 声明一个类
class Animal {
  eat() {
    console.log("吃东西")
  }
}

class Dog extends Animal {
  bark() {
    console.log("汪汪叫")
  }
}

const dog = new Dog()
dog.eat()
dog.bark()

// 声明一个静态类
class Tool {
  static msg: string = "静态文本"

  static fn() {
    console.log("静态方法")
  }
}

// 直接类调用，不用 new
console.log(Tool.msg)
Tool.fn()


class Person1 {
    // name和age是受保护属性，不能在类外部访问，但可以在类与子类中访问
    // protected name: string;
    // protected age: number;

    constructor(protected name: string, protected age: number) { }

    // getDetails是受保护方法，不能在类外部访问，但可以在类与子类中访问
    protected getDetails(): string {
        // 类中能访问受保护的name和age属性
        return `我叫: ${this.name}, 年龄是: ${this.age}`;
    }

    // introduce是公开方法，类、子类、类外部都能使用
    introduce() {
        // 类中能访问受保护的getDetails方法
        console.log(this.getDetails());
    }
}

const p1 = new Person1('杨超越', 18);
// 可以在类外部访问introduce
p1.introduce();