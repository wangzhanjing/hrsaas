export function arrToTree (arr) {
  const res = arr.filter(item => {
    item.children = arr.filter(item2 => {
      return item.id === item2.pid
    })
    return !item.pid
  })
  return res
}
