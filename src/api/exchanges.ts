import request from '@/utils/request'
import axios from 'axios'

export const getExchanges = (params: any) => {
  return axios({
    headers: {
      'Authorization': 'Nx6\\0v%N++\\Oq&mNRwJ7iomOlzoYn'
    },
    url: 'https://apollo.atomicwallet.io/transactions/all',
    method: 'get',
    params
  })
}
