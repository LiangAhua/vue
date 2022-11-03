import { pushTarget, popTarget } from "./dep"

// 全局变量 id 每次new Watcher都会自增
let id = 0
export default class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb // 回调函数，例如在watcher更新前可以执行beforeUpdate方法
    this.options = options // 额外的选项 true代表渲染Watcher
    this.id = id++ // watcher的唯一标识
    this.deps = [] // 存储dep的容器
    this.depsId = new Set() // 用来去重dep
    // 如果表达式是一个函数
    if(typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    // 实例化会默认调用get方法
    this.get()
  }
  get() {
    pushTarget(this) // 在调用方法前 把当前watcher实例赋值到全局的Dep.target上 方便进行依赖收集
    // 如果watcher是渲染watcher 那么就相当于执行了vm._update(vm._render()) 在render函数执行的时候会取值 从而实现依赖收集
    this.getter()
    popTarget() // 在调用方法之后将当前watcher实例从Dep.target上移除
  }
  // 把dep放到deps里面 同时保证同一个dep只能被保存到watcher里一次 同样的 同一个watcher也只会保存在dep一次
  addDep(dep) {
    let id = dep.id
    if(!this.deps.has(id)) {
      this.depsId.add(id)
      this.deps.push(id)
      dep.addSub(this)
    }
  }

  // 这里简单的执行以下get方法 之后涉及到计算属性就不一样了
  update () {
    this.get()
  }
}