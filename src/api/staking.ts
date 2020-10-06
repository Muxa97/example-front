import axios from 'axios'
import {createQueryString} from '@/utils/createQueryString'

export const getStakings = async (params: any) => {
  const queryString = createQueryString(params)

export const getStakings = async(params: any) => {
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/stakings/all?limit=${params.limit}&offset=${params.offset}&provider=${params.provider}`,
    method: 'get'
  })
}


export const getStakingsByUser = async (params: any) => {
  const queryString = createQueryString(params)
  
  return axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/stakings/user${queryString}`,
    method: 'get'
  })
}
