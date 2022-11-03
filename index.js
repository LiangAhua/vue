new Vue({
  el: '#app',
  data: {},
  router,
  render: (h) => h(App)
})

// Vue其实就是一个构造函数


////////////////////// index  构造函数Vue
function Vue(options) {
  this._init(options)
}
initMixin(Vue) // 将_init()挂载到Vue的原型上
export default Vue
////////////////////////////////// init
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options
    initState(vm) // 初始化状态
  }
}
///////////////////////////////// sate
export function initState(vm) {
  // props -> methods -> data -> computed -> watch
}

function initData(vm) { // 初始化数据
  const data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}
  // 将options里的data的数据代理到实例vm上
  for (const key in data) {
    proxy(vm, '_data', key)
  }
  // 数据观测
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

 ///////////////////////////////// observer/index

 export function observe(value) {
   // 判断是不是Objet或者Array 是才观测
   if(Object.prototype.toString.call(value) || Array.isArray(value)) {
     return new Observer(value)
   }
 }

 class Observer {
   constructor(data) {
     if(Array.isArray(data)) {
       // 数组
       
     } else {
       // 对象
       this.walk(data)
     }
   }
   walk(data) {
     // 遍历对象进行数据劫持
     const keys = Object.keys(data)
     for (let index = 0; index < keys.length; index++) {
       const key = keys[index]
       const value = keys[key]
       defineProperty(data, key, value)
     }
   }
 }

 function defineProperty (data, key, value) { // 数据劫持中心
   observe(data) // 递归
   Object.defineProperty(data, key, {
     get() {
       // 收集依赖
       return value
     },
     set(newValue) {
       if(value === newValue) return
       // 更新视图
       value = newValue
     }
   })
 }