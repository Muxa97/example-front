/* eslint-disable camelcase */
export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IExchangeData {
  id: number
  orderId: string
  atomicId: string
  status: string
  fromCurrency: string
  toCurrency: string
  amountSend: string
  amountReceive: string
  payinAddress: string
  payoutAddress: string
  payoutExtraId: string
  refundAddress: string
  refundExtraId: string
  payinHash: string
  payoutHash: string
  createdAt: Date
  updatedAt: Date
  Cashbacks: ICashbackData[]
}

export interface ICashbackData {
  id: number
  atomicId: string
  paymentId: string
  orderId: string
  bnbAddress: string
  ethAddress: string
  expectedCashbackAmount: string
  awcBep2Balance: string
  awcBep2Rate: string
  exchangeService: string
  platform: string
  walletVersion: string
  order_id: string
  payment_id: string
}
