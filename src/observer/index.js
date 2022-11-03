import { arrayMethods } from "./array"
import Dep from "./dep"

export function observe(value) {
  // 如果传过来的是对象或者数组 就进行数据劫持
  if(Array.isArray(value) || Object.prototype.toString.call(value) === "[object Object]") {
    return new Observer(value)
  }
}
class Observer {
  constructor(value) {
    this.dep = new Dep()
    Object.defineProperty(value, '__ob__', {
      value: this, // 值指代的就是Observer的实例
      enumerable: false, //不可枚举
      writable: true,
      configurable: true,
    })
    /**
     * 这段代码的意思就是给每个响应式数据添加了一个不可枚举的__ob__属性，并且指向了Observer实例
     * 那么我们首先可以根据这个属性来防止已经被响应式观察的数据反复被观测
     * 其次 响应式数据可以使用__ob__来获取Observer实例上的相关方法 这对数组很关键
     * 数组的依赖收集和派发更新都是基于对象数据的__ob__属性来完成的
     */
    if(Array.isArray(value)) {
      // 因为对数组下标进行拦截太耗费性能 对Observer构造函数传入的参数增加了数组的判断
      // 通过重写数组的__proto__原型，来对数组的七种方法进行拦截
      value.__proto__ = arrayMethods
      // 如果数组里面还包含数组或对象 就需要递归
      this.observeArray(value)
    } else {
      // 对象
      this.walk(value)
    }
  }
  walk(data) {
    // 对象上的所有值依次进行观测
    const keys = Object.keys(data)
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index]
      const value = data[key]
      defineReactive(data, keys, value)
    }
  }
  observeArray(data) {
    for (let i = 0; i < data.length; i++) {
      observe(data[i])
    }
  }
}

// Object.defineProperty数据劫持中心 兼容ie9及以上
function defineReactive(data, key, value) {
  // 递归关键
  let childOb = observe(value) // childOb就是Observer实例
  // 如果value还是一个对象 会继续走一边defineReactive 层层遍历一直到value不是一个对象为止
  // 思考？如果Vue数据嵌套层级过深 >> 性能会受影响
  let dep = new Dep() // 为每一个属性实例化一个dep
  Object.defineProperty(data, key, {
    get() {
      // 收集依赖 页面取值的时候 可以把watcher收集到dep里面
      if(Dep.target) {
        // 如果有watcher dep就会保存watcher 同时wacher也会保存dep
        dep.depend()
        if(childOb) {
          childOb.dep.depend()
          // data:{a:{b:1}}
          // childOb指向a对象的__ob__属性，一个Observe实例。
          // childOb.dep.depend()意思是a对象的整个对象的结构也加入了依赖中，
          // 为了监听对象属性的增加和删除，而不是为了监听对象某个属性的值是否发生变化
          if(Array.isArray(value)) { // 数组收集依赖
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newValue) {
      if(value === newValue) return
      // 赋值的新值也需要进行观测 判断是否是对象或者数组 是否需要劫持
      childOb = observe(newValue)
      value = newValue
      // 派发更新 通知渲染watcher去更新
      dep.noify()
    }
  })
}
// 递归收集数组依赖
function dependArray(value) {
  for (let e, i = 0; i < value.length; i++) {
    e = value[1]
    e && e.__ob__ && e.__ob__.dep.depend() // e.__ob__代表已经被观测
    if(Array.isArray(e)) {
      dependArray(e)
    }
  }
}
// 数据劫持的核心是 defineReactive函数 主要只用 Object.defineProperty 来对数据的get和set进行劫持
// 数据变动就在set里去通知视图更新