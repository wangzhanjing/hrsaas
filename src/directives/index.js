// 所有自定义指令
export const imageerror = {
  // 指令对象
  inserted (dom, options) {
    // dom指令当前作用对象，image
    // 图片加载失败会报错，触发一个 onerror事件
    // options是指令变量中的解释，val为变量的值
    dom.onerror = function () {
      dom.src = options.value
    }
  }
}
