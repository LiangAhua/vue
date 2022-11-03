import { initMixin } from './init.js'
// Vue就是一个构造函数 通过New关键字进行实例化
function Vue(options) {
  // 初始化
  this._init(options)
}

// _init() 是挂载在Vue原型上的方法
initMixin(Vue)

export default Vue