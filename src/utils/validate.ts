export const isValidUsername = (str: string) => str.length > 0

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)
