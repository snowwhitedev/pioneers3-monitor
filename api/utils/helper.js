const axios = require('axios');
const { BigNumber } = require('bignumber.js');
const { AIRDROP_END_TIME, AIRDROP_END_TIMESTAMP, AIRDROP_START_TIMESTAMP } = require('./constants');

const PAGE_SIZE = 100;

const getAddressWeight = async(token, addr, toStamp) => {
  const url = `https://qtum.info/api/address/${addr}/qrc20-balance-history/${token}?pageSize=${PAGE_SIZE}`
  try {
    const { data: { totalCount } } = await axios.get(`${url}&page=0`)
    const totalPages = ~~(totalCount / PAGE_SIZE)
    const balanceHistory = []
    for(let page = 0; page < totalPages + 1; page++) {
      const { data: { transactions } } = await axios.get(`${url}&page=${page}`)
      for (const tx of transactions) {
        balanceHistory.push({
          timestamp: tx.timestamp,
          balance: tx.tokens[0].balance
        })
      }
    }

    balanceHistory.sort(function(a, b) {
      return b.timestamp - a.timestamp
    })
  
    let weight = new BigNumber(0)
    // const currentStamp = new Date().getTime() / 1000
    // let endStamp = currentStamp > AIRDROP_END_TIMESTAMP ? AIRDROP_END_TIMESTAMP : currentStamp
    let endStamp = toStamp > AIRDROP_END_TIMESTAMP ? AIRDROP_END_TIMESTAMP : toStamp

    for(const bs of balanceHistory) {
      let startStamp = bs.timestamp > AIRDROP_START_TIMESTAMP ? bs.timestamp : AIRDROP_START_TIMESTAMP
      if (endStamp > startStamp) {
        weight = weight.plus(new BigNumber(bs.balance).times(new BigNumber(endStamp - startStamp)))
      }

      if (bs.timestamp <= AIRDROP_START_TIMESTAMP) {
        break
      }
      endStamp = bs.timestamp > endStamp ? endStamp : bs.timestamp
    }

    weight = weight.div(3600).div(1E8)
    return {
      address: addr,
      token: token,
      timestamp: toStamp,
      value: weight.toString()
    };
  } catch (e) {
    // Check Qtum Address or something wrong happened in api server
    throw Error(e)
  }
}

const getTotalSupply = async (lp_token, toStamp) => {
  const mileStoneTime = lp_token.mileStoneTime;
  let totalSupply = new BigNumber(lp_token.mileStoneSupply).times(new BigNumber(1E8));
  const url = `https://qtum.info/api/qrc20/${lp_token.address}/txs?pageSize=${PAGE_SIZE}&fromTime=${mileStoneTime}&toTime=${AIRDROP_END_TIME}` 
  try {
    const { data: { totalCount } } = await axios.get(`${url}&page=0`)
    const totalPages = ~~(totalCount / PAGE_SIZE)

    const mintHistory = []
    const burnHistory = []
    let totalTransactions = []
    for (let page = 0; page < totalPages + 1; page++) {
      const { data: { transactions } } = await axios.get(url)
      totalTransactions = [ ...totalTransactions, ...transactions ]
    }
    
    for (const txn of totalTransactions) {
      if (txn.from === null) {
        totalSupply = totalSupply.plus(new BigNumber(txn.value))
        if (txn.timestamp > AIRDROP_START_TIMESTAMP) {
          mintHistory.push({
            timestamp: txn.timestamp,
            value: txn.value
          })
        }
      }
      if (txn.to === null) {
        totalSupply = totalSupply.minus(new BigNumber(txn.value))
        if (txn.timestamp > AIRDROP_START_TIMESTAMP) {
          burnHistory.push({
            timestamp: txn.timestamp,
            value: txn.value
          })
        }
      }
    }

    // const currentStamp = new Date().getTime() / 1000
    // let endStamp = currentStamp > AIRDROP_END_TIMESTAMP ? AIRDROP_END_TIMESTAMP : currentStamp
    let endStamp = toStamp > AIRDROP_END_TIMESTAMP ? AIRDROP_END_TIMESTAMP : toStamp

    let totalWeight = totalSupply.times(new BigNumber(endStamp - AIRDROP_START_TIMESTAMP))
    let totalMintWeight = new BigNumber(0)
    for (const item of mintHistory) {
      const gw = new BigNumber(item.value).times(new BigNumber(item.timestamp - AIRDROP_START_TIMESTAMP))
      totalMintWeight = totalMintWeight.plus(gw)
    }

    let totalBurnWeight = new BigNumber(0)
    for (const item of burnHistory) {
      const gw = new BigNumber(item.value).times(new BigNumber(item.timestamp - AIRDROP_START_TIMESTAMP))
      totalBurnWeight = totalBurnWeight.plus(gw)
    }

    totalWeight = totalWeight.minus(totalMintWeight).plus(totalBurnWeight)
    totalWeight = totalWeight.div(3600).div(1E8)
    return {
      address: lp_token.address,
      value: totalWeight.toString(),
      timestamp: toStamp
    };
  } catch(e) {
    console.log('[error]', e)
  }
}

module.exports = {
  getAddressWeight,
  getTotalSupply
}
