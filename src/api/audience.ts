import request from '@/utils/request'

export const getDeviceUsages = async (data: any) => {
  await request({
    url: '/users/info',
    method: 'post',
    data
  })
  return { data: [{ name: "darwin 13.12.8", value: 100 }, { name: "win32 13.17.0", value: 180 }, { name: "android", value: 320 }, { name: "ios", value: 45 }]}
}
