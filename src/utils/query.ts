export const constructQuery = (searchQuery:any) => {
  let str = ''
  for (const key in searchQuery) {
    if (searchQuery[key] === '') continue
    if (str !== '') {
      str += '&'
    }
    str += key + '=' + encodeURIComponent(searchQuery[key])
  }
  return str
}
