

// dep和watcher是多对多的关系
// 每个属性都有自己的dep
let id = 0 // dep实例的唯一标识
export default class Dep {
  constructor() {
    this.id = id++
    this.subs = [] // 存放watcher的容器
  }
  depend() {
    if(Dep.target) {
      Dep.target.addDep(this) // 把自身实例存到watcher里
    }
  }
  notify() {
    // 依次执行subs里面的watcher更新方法
    this.subs.forEach(watcher => watcher.update())
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
}

Dep.target = null
// 栈结构用来存watcher
const targetStack = []
export function pushTarget(watcher) {
  targetStack.push(watcher)
  Dep.target = watcher
}

export function popTarget() {
  targetStack.pop() // 当前watcher出栈 拿到上一个watcher
  Dep.target = targetStack[targetStack.length - 1]
}