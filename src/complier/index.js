

export function compileToFunction(template) {
  // 1.将html字符串转成ast语法树 ast用来描述代码本身形成树结构 不仅可以描述html 也能描述css以及js语法
  // 很多库都用到了ast 比如 webpack babel eslint 等等
  let ast = parse(template)
  // 2.通过ast重新生成代码
  // 最后生成的代码需要和render函数一样
  // _c('div',{id:"app"}, _c('div', undefined, -v("hello"+_s(name)))
  // _c创建元素   _v创建文本   _s代表Json.stringify --把对象解析成文本
  let code = generate(ast)
  // 使用with语法改变作用域为this
  let renderFn = new Function(`with(this){return ${code}}`)
  return renderFn
}