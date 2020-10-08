
export const createQueryString = (params: any) => {
  let query = '?'

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key) && (!!params[key] || params[key] === 0)) {
      if (params[key] instanceof Date) {
        params[key] = params[key].toISOString()
      }

      query += `${key}=${params[key]}&`
    }
  }

  return query
}
