import axios from 'axios'

export const getSimplexBuy = async (params: any) => {
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/simplex/buy/all`,
    method: 'get'
  })
  // ?limit=${params.limit}&offset=${params.offset}
}

export const getSimplexRange = async (params: any) => {
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/simplex/buy/range`,
    method: 'get'
  })
  // ?from=${params.from.toISOString()}&to=${params.to.toISOString()}
}
