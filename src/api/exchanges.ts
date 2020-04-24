import request from '@/utils/request'
import axios from 'axios'

export const getExchanges = (params: any) => {
  return axios({
    headers: {
      'Authorization': process.env.APOLLO_AUTHORIZATION_HEADER
    },
    url: 'https://apollo.atomicwallet.io/transactions/all',
    method: 'get',
    params
  })
}
