import CryptoJS from 'crypto-js'

const SECRET = (process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? '') as string

export const encrypt = (text: string): string =>
  CryptoJS.AES.encrypt(text, SECRET).toString()

export const decrypt = (cipher: string): string => {
  try {
    return CryptoJS.AES.decrypt(cipher, SECRET).toString(CryptoJS.enc.Utf8)
  } catch {
    return ''
  }
}

export const maskAccount = (accountNumber: string): string => {
  if (!accountNumber || accountNumber.length < 4) return '****'
  return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4)
}
