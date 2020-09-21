import request from '@/utils/request'
import axios from 'axios'

export const getUserInfo = (data: any) =>
  request({
    url: '/users/info',
    method: 'post',
    data
  })

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

export const getUniqueUsers = async (params: any) => {
  try {
    const {data} = await axios({
      headers: {
        'Authorization': process.env.VUE_APP_APOLLO_AUTHORIZATION_HEADER
      },
      url: `${process.env.VUE_APP_APOLLO_API_HOST}/users/unique?fromDate=${params.from.toUTCString()}&toDate=${params.to.toUTCString()}`,
      method: 'get'
    })
    return data
  } catch (err) {
    let startTime = params.from.getTime()
    const dateRangeByHours = []
    while (startTime <= params.to.getTime()) {
      dateRangeByHours.push(startTime)
      startTime += 1000 * 60 * 60
    }

    let lastUsers = Math.floor(Math.random() * 1000 + 100)
    const result = dateRangeByHours.map(date => {
      lastUsers = Math.floor(Math.random() * 100 - 35 + lastUsers)
      return {
        name: date.toString(),
        value: [date, lastUsers]
      }
    })

    const lastDay = Math.floor(Math.random() * 100)
    const lastWeek = lastDay + Math.floor(Math.random() * 1000)
    const lastMonth = lastWeek + Math.floor(Math.random() * 10000)
    console.error(err)
    return {
      byHours: result,
      lastDay,
      lastWeek,
      lastMonth
    }
  }
}

export const getUsersDevices = async (params: any) => {
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
        { os: "darwin 13.12.8", count: Math.floor(Math.random() * 250) },
        { os: "win32 13.17.0", count: Math.floor(Math.random() * 250) },
        { os: "android", count: Math.floor(Math.random() * 250) },
        { os: "ios", count: Math.floor(Math.random() * 250) }
        ]
    }
  }
}
