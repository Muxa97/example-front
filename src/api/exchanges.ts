import request from '@/utils/request'

export const getExchanges = (params: any) => {
  return request({
    headers: {
      'Authorization': process.env.APOLLO_AUTHORIZATION_HEADER
    },
    url: 'https://apollo.atomicwallet.io/transactions/all',
    method: 'get',
    params
  })
}
