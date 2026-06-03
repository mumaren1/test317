interface PersonInterface1<T> {
    name: string,
    age: number,
    extraInfo: T
}
let p1: PersonInterface1<string>
let p2: PersonInterface1<number>
p1 = { name: '张三', age: 18, extraInfo: '一个好人' }
p2 = { name: '李四', age: 18, extraInfo: 250 }

console.log(p1.name)




// PersonInterface接口，用与限制Person类的格式
interface PersonInterface {
    name: string;
    age: number;
    extraInfo: string
}

// 定义一个类Person，实现 PersonInterface 接口
class Person implements PersonInterface {
    constructor(
        public name: string,
        public age: number,
        public extraInfo: string
    ) { }

}
// 创建一个 Person 类的实例 p1，传入名字 'tom' 和年龄 18
const p3 = new Person('张三', 18, '一个好人');

console.log(p3.name)

//⾯积
type Area = {
	height: number; //⾼
	width: number; //宽
};

//地址
type Address = {
	num: number; //楼号
	cell: number; //单元号
	room: string; //房间号
};

// 定义类型House,且House是Area和Address组成的交叉类型
type House = Area & Address;
	const house: House = {
	height: 180,
	width: 75,
	num: 6,
	cell: 3,
	room: '702'
};