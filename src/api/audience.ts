import request from '@/utils/request'

export const getDeviceUsages = async (data: any) => {
  await request({
    url: '/users/info',
    method: 'post',
    data: {}
  })
  return { data: [{ name: "darwin 13.12.8", value: 100 }, { name: "win32 13.17.0", value: 180 }, { name: "android", value: 320 }, { name: "ios", value: 45 }]}
}

export const getUniqueUsers = async (data: any) => {
  await request({
    url: '/users/info',
    method: 'post',
    data
  })
  let startTime = data.from.getTime()
  const dateRangeByHours = []
  while (startTime <= data.to.getTime()) {
    dateRangeByHours.push(startTime)
    startTime += 1000 * 60 * 60
  }
  console.log(dateRangeByHours)
  let lastUsers = Math.floor(Math.random() * 1000 + 100)
  const result = dateRangeByHours.map(date => {
    lastUsers = Math.floor(Math.random() * 100 - 35 + lastUsers)
    return {
      name: date.toString(),
      value: [date, lastUsers]
    }})
  return { data: result }
}

export const getUsersCount = async (data: any) => {
  await request({
    url: '/users/info',
    method: 'post',
    data
  })
  const lastDay = Math.floor(Math.random() * 100)
  const lastWeek = lastDay + Math.floor(Math.random() * 1000)
  const lastMonth = lastWeek + Math.floor(Math.random() * 10000)
  return {
    lastDay,
    lastWeek,
    lastMonth
  }
}
