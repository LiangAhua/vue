import { initState } from "./state"
import { compileToFunction } from "./complier/index"
import { mountComponent } from "./lifecycle"

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this // this代表调用_init()的对象（实例对象）
    vm.$options = options // this.$options就是new Vue时传入的属性

    // 初始化状态
    initState(vm)

    // 如果有el属性 进行模板编译
    if(vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vum.prototype.$mount = function(el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    if(!options.render) {
      let template = options.template
      if(!template && el) {
        // 不能存在render和template 但是存在el属性 直接将el所在外层的html结构赋值给模板 （就是el本身 并不是父元素）
        template = el.outerHtml
      }
    }
    if(template) {
      // 把template模板字符串转化成render函数
      const render = compileToFunction(template)
      options.render = render
    }

    // 将当前组件实例挂载到真实的el节点上
    return mountComponent(vm, el)
    // mountComponent就是组件实例挂载的入口函数
    // 这个函数的源码在lifecycle文件里，代表了与生命周期相关
    // 因为我们组件初始渲染前后还有beforeMount和mounted生命周期钩子
  }
}

// initMixin 把 _init 挂载到Vue原型上供Vue实例调用