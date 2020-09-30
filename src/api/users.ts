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
