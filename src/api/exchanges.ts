import axios from 'axios'

export const getExchanges = (params: any) => {
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: 'https://apollo.atomicwallet.io/transactions/all',
    method: 'get',
    params
  })
}

export const getExchangesByTerms = (params: string, query: string) => {
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `https://apollo.atomicwallet.io/transactions/searchByTerm?${params}&${query}`,
    method: 'get'
  })
}

export const getExchangesByTermsCount = (params: string) => {
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `https://apollo.atomicwallet.io/transactions/countByTerm?${params}`,
    method: 'get'
  })
}

export const getExchangesCount = () => {
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: 'https://apollo.atomicwallet.io/transactions/countAll',
    method: 'get'
  })
}
