import request from '@/utils/request'
import { IUserData } from '@/api/types';

const users: IUserData[] = [
  {
    atomicId: 'abcrslkjhfrqlkabsdvuirlwslkj;AF',
    status: 'Memeber',
    awcBalance: 0.17,
    devices: [ { platform: 'Win32 10.18.0', appVersion: '2.18.3'}, { platform: 'Win32 10.18.0', appVersion: '2.18.3'} ],
    exchangeVolume: 0,
    buyingVolume: 0.19,
    stakingVolume: 2.0,
    airdropsReferrals: []
  },
  {
    atomicId: 'veraulnclw4ugfjaiewRUBCLYAKLWSHEDF',
    status: 'Memeber',
    awcBalance: 0.17,
    devices: [ { platform: 'Win32 10.18.0', appVersion: '2.18.3'}, { platform: 'Win32 10.18.0', appVersion: '2.18.3'} ],
    exchangeVolume: 0,
    buyingVolume: 0.19,
    stakingVolume: 2.0,
    airdropsReferrals: []
  },
  {
    atomicId: 'vnswleoof4msghtls;oqw4r',
    status: 'Memeber',
    awcBalance: 7.2,
    devices: [ { platform: 'Win32 10.18.0', appVersion: '2.18.3'}, { platform: 'Win32 10.18.0', appVersion: '2.18.3'} ],
    exchangeVolume: 0.33,
    buyingVolume: 1.2,
    stakingVolume: 0.3,
    airdropsReferrals: []
  },
]

export const getUsers = async (data: any) =>  {
  await request({
    url: '/users',
    method: 'get'
  })
  return users
}

export const getUserInfo = async (data: any) =>  {
  const response = await request({
    url: '/users/info',
    method: 'post',
    data
  })
  const info = users.find(user => user.atomicId === data.atomicId)
  return {
    data: {
      user: response.data.user,
      info
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
