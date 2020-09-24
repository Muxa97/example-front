import axios from 'axios'

export const getStakings = async (params: any) => {
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/stakings/all?limit=${params.limit}&offset=${params.offset}&provider=${params.provider}`,
    method: 'get'
  })
}

export const getStakingsCount = async (params: any) => {
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/stakings/countAll`,
    method: 'get'
  })
}

export const getStakingsByUser = async (params: any) => {
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/stakings/user?atomicId=${params.atomicId}&limit=${params.limit}&offset=${params.offset}&provider=${params.provider}`,
    method: 'get'
  })
}
