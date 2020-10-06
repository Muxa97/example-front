
export const createQueryString = (params: any) => {
  let query = '?'

  for (const key in params) {
    if (params.hasOwnProperty(key) && params[key].length) {
      if (params[key] instanceof Date) {
        params[key] = params[key].toISOString()
      }

      query += `${key}=${params[key]}&`
    }
  }

  return query
}
