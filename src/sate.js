import { observe } from "./observer/index"

// 初始化状态 注意这里的顺序 比如：能否在data里面直接使用prop的值？为什么？
export function initState(vm) {
  const opts = vm.$options
  if(opts.props) {
    initProps(vm)
  }
  if(opts.methods) {
    initMethods(vm)
  }
  if(opts.data) {
    initData(vm)
  }
  if(opts.computed) {
    initComputed(vm)
  }
  if(opts.watch) {
    initWatch(vm)
  }
}

// 初始化data数据：1.数据代理，将data代理到实例对象的this上 2.对数据进行观测observe
function initData(vm) {
  const data = vm.$options.data
  // Vue 组件的 data 推荐使用函数 防止数据在组件之间共享
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}
  // 把data数据代理到vm 也就是Vue实例上 我们可以使用 this.a 来 访问 this._data.a
  for(let key in data) {
    proxy(vm, '_data', key)
  }

  // 对数据进行观测 --响应式数据核心
  observe(data)
}
function proxy(object, sourceKey, key) {
  Object.defineProperty(object, key, {
    get() {
      return object[sourceKey][key]
    },
    set(newValue) {
      object[sourceKey][key] = newValue
    }
  })
}