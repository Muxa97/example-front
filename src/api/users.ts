import request from '@/utils/request'
import axios from 'axios'

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

export const getHourData = async(params: any) => {
  const { data } = await axios({
    headers: {
      'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
    },
    url: `${process.env.VUE_APP_APOLLO_API_HOST}/users/hour_data?fromDate=${params.from.toISOString()}&toDate=${params.to.toISOString()}`,
    method: 'get'
  })
  return data
}

export const getUsersDevices = async(params: any) => {
  try {
    const { data } = await axios({
      headers: {
        'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
      },
      url: `${process.env.VUE_APP_APOLLO_API_HOST}/users/devices?fromDate=${params.from}&toDate=${params.to}`,
      method: 'get'
    })
    return data
  } catch (err) {
    console.error(err)
    return { data: [
      { os: 'darwin 13.12.8', count: Math.floor(Math.random() * 250) },
      { os: 'win32 13.17.0', count: Math.floor(Math.random() * 250) },
      { os: 'android', count: Math.floor(Math.random() * 250) },
      { os: 'ios', count: Math.floor(Math.random() * 250) }
    ]
    }
  }
}
