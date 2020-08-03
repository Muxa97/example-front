// Set utils function parseTime to filter
export { parseTime } from '@/utils'

// Filter for article status
export const articleStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}
export const parseApolloTime = (date: string) => {
  return new Date(date).toLocaleString()
}
export const parseDateTime = (date: string) => {
  return new Date(date).toDateString()
}

// Filter to uppercase the first character
export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const formatAtomicId = (str: string) => {
  return str.substr(0, 5) + '...' + str.substr(str.length - 5, 5)
}
