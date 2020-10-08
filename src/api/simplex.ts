import axios from 'axios'
import { createQueryString } from '@/utils/createQueryString'

export const getSimplexBuy = async(params: any) => {
  const query = createQueryString(params)
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/simplex/buy/all${query}`,
    method: 'get'
  })
}

export const getSimplexUser = async(params: any) => {
  const query = createQueryString(params)
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/simplex/buy/user${query}`,
    method: 'get'
  })
}
