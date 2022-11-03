// 保留数组原型
const arrayProto = Array.prototype
// 然后将arrayMethods继承自数组原型
// 这里用的是面向切片编程思想（AOP）-- 不破坏封装的前提下，动态的拓展功能
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'unshift',
  'pop',
  'shift',
  'splice',
  'reverse',
  'sort'
]

methodsToPatch.forEach(method => {
  arrayMethods[method] = function (...args) {
    // 保留原型方法的执行结果
    const result = arrayProto[method].apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)
        break;
      default:
        break;
    }
    // 如果有新增元素 inserted是一个数组 调用Observer实例的observeArray对数组每一项进行观测
    if(inserted) ob.arrayObserve(inserted)
    // 派发更新
    ob.dep.notify()
    return result
  }
})