import axios from 'axios'
import { BigNumber } from 'bignumber.js'

// const AIRDROP_START_TIME = '2021-07-31T23:59:59Z' // 1627689599
// const AIRDROP_END_TIME = '2021-08-31T23:59:59Z'  //  1627826399
// const AIRDROP_START_TIMESTAMP = new Date(AIRDROP_START_TIME).getTime() / 1000
// const AIRDROP_END_TIMESTAMP = new Date(AIRDROP_END_TIME).getTime() / 1000

/**
 * Don't remove these data
 * 18,674,621,366.91410927 --2021-07-30T16:56:00Z -  1627664160
 * 37,525.41807334  - '2021-07-29T18:07:16Z' - 1627582036
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
 
export const LP_TOKENS = [
  {
    symbol: 'QTUM_QI',
    address: '222b099fe58d01b2eac666177dd06d9b0003b25c',
    mileStoneTime: '2021-07-30T16:56:01Z',
    mileStoneSupply: '18674621366.91410927'
  },
  {
    symbol: 'QTUM_QC',
    address: 'b406040d9e1a9bbb19fcc803a7a808b038ae45ce',
    mileStoneTime: '2021-07-29T18:07:17Z',
    mileStoneSupply: '37525.41807334'
  }
]

const getAddressWeight = async(token, addr) => {
  try {
    const url = `${API_BASE_URL}address-weight?token=${token}&address=${addr}`
    const { data } = await axios.get(url);
    return data
  } catch (e) {
    // Check Qtum Address or something wrong happened in api server
    throw Error(e)
  }
}

export async function getAddressWeights(address) {
  const promiseQI = getAddressWeight(`${LP_TOKENS[0].address}`, address)
  const promiseQC = getAddressWeight(`${LP_TOKENS[1].address}`, address)

  const weights = await Promise.all([promiseQI, promiseQC]).then((values) => {
    return values
  })
  return weights
}

export async function getTotalWeight() {
  const url = `${API_BASE_URL}/total-weight`
  const promiseQI = axios.get(`${url}?lp_idx=0`)
  const promiseQC = axios.get(`${url}?lp_idx=1`)

  try {
    const weights = await Promise.all([promiseQI, promiseQC]).then((values) => {
      return values.map(( value ) => value.data )
    })
    return weights
  } catch (err) {
    throw Error(err)
  }
}

const formatWeightHistoryItems = (address, data, lpIdx) => {
  const lpList = data
    .filter(function(o) { return o.token === LP_TOKENS[lpIdx].address })
    .sort(function(a, b) {
      return a.timestamp - b.timestamp
    })
  
  const formattedList = lpList
    .filter(function(o) { return o.address === address })
    .map((item) => {
      const timestamp = item.timestamp
      const lpItem = lpList.find(el => el.timestamp === timestamp && el.address === LP_TOKENS[lpIdx].address)
      // date: new Date(item)
      const date = new Date(timestamp * 1000).toUTCString();
      return {
        date: date,
        totalWeight: lpItem.weight,
        weight: item.weight,
        percentage: getPercent(lpItem.weight, item.weight)
      }
    })
  
  return formattedList
}

export async function getHistoryData(address) {
  const url = `${API_BASE_URL}history-data?address=${address}`
  try {
    const { data } = await axios.get(url)
    const formattedQtumQiList = formatWeightHistoryItems(address, data, 0)
    const formattedQtumQcList = formatWeightHistoryItems(address, data, 1)

    return [formattedQtumQiList, formattedQtumQcList]
  } catch (err) {
    throw Error(err)
  }
}

export function getSumOfWeights(w1, w2) {
  const sum = new BigNumber(w1).plus(new BigNumber(w2)).toString()
  return sum
}

export function getPercent(total, share) {
  if (isNaN(total) || new BigNumber(total).eq(0)) {
    return 0
  }
  const percent = new BigNumber(share).times(100).div(new BigNumber(total)) 
  return percent.toString()
}
