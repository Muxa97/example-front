import axios from 'axios'
import { IUserData } from '@/api/types'

export const getUsers = async(params: any) => {
  const response = await axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/users/all?offset=${params.offset}&limit=${params.limit}${params.atomicId ? '&atomicId=' + params.atomicId : ''}`,
    method: 'get'
  })
  const { data } = response
  return data
}

export const getUserInfo = async(params: any) => {
  try {
    const {data} = await axios({
      headers: {
        'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
      },
      url: `${process.env.VUE_APP_APOLLO_API_HOST}/users/info`,
      method: 'get'
    })
    return data
  } catch (err) {
    console.error(err)
    return {
      atomicId: '5f274d0c742f687b216f40c060a3c2b9106ff1e33ad16746bd53717f27490437',
      role: 'admin', // admin, user и т.д., пока не обсуждалось
      status: 'Status',
      awcBalance: 0,
      devices: [],
      exchangeVolume: 0, // USD или BTC?
      buyingVolume: 0, // USD или BTC?
      stakingVolume: 0, // USD или BTC?
      airdropsReferrals: ['asdfgqre', 'SADVEQTR', 'asdgfvg']
    }
  }
}

export const login = async (params: any) => {
  const { data } = await axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/login`,
    method: 'post',
    params
  })
  return data
}

export const logout = async (params: any) => {
  const { data } = await axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/logout`,
    method: 'post',
    params
  })
  return data
}
