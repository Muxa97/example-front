import request from '@/utils/request'
import axios from 'axios'
import { IUserData } from '@/api/types'

const users: IUserData[] = [
  {
    atomicId: 'abcrslkjhfrqlkabsdvuirlwslkj;AF',
    status: 'Memeber',
    awcBalance: 0.17,
    devices: [ { platform: 'Win32 10.18.0', appVersion: '2.18.3' }, { platform: 'Win32 10.18.0', appVersion: '2.18.3' } ],
    exchangeVolume: 0,
    buyingVolume: 0.19,
    stakingVolume: 2.0,
    airdropsReferrals: []
  },
  {
    atomicId: 'veraulnclw4ugfjaiewRUBCLYAKLWSHEDF',
    status: 'Memeber',
    awcBalance: 0.17,
    devices: [ { platform: 'Win32 10.18.0', appVersion: '2.18.3' }, { platform: 'Win32 10.18.0', appVersion: '2.18.3' } ],
    exchangeVolume: 0,
    buyingVolume: 0.19,
    stakingVolume: 2.0,
    airdropsReferrals: []
  },
  {
    atomicId: 'vnswleoof4msghtls;oqw4r',
    status: 'Memeber',
    awcBalance: 7.2,
    devices: [ { platform: 'Win32 10.18.0', appVersion: '2.18.3' }, { platform: 'Win32 10.18.0', appVersion: '2.18.3' } ],
    exchangeVolume: 0.33,
    buyingVolume: 1.2,
    stakingVolume: 0.3,
    airdropsReferrals: []
  }
]

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

export const getUserInfo = async(data: any) => {
  const response = await request({
    url: '/users/info',
    method: 'post',
    data
  })
  const info = { data: {} } /* await axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `http://${process.env.VUE_APP_APOLLO_API_HOST}/users/info`,
    method: 'post',
    data
  }) */
  return {
    data: {
      user: response.data.user,
      info: info.data as IUserData
    }
  }
}

export const login = (data: any) =>
  request({
    url: '/users/login',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: '/users/logout',
    method: 'post'
  })
