

export function mountComponent(vm, el) {
  // 上一步模板编译解析生成render函数
  // 下一步就是执行vm._render()方法 调用生成的render函数 生成虚拟dom
  // 最后使用vm._update()方法把虚拟dom渲染到页面

  // 将真实的el元素赋值给实例的$el属性 为之后虚拟dom 产生新的dom替换老的dom做铺垫
  vm.$el = el
  // _update()和_render()都是挂载在Vue原型上的方法 类似_init()
  let updateComponent = ()=> {
    vm._update(_render())
  }
  new Watcher(vm, updateComponent, null, true)
}