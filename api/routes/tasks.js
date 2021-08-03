var express = require("express");
var router = express.Router();
const Task = require("../model/Task");

const { AIRDROP_START_TIMESTAMP, AIRDROP_END_TIMESTAMP, LP_TOKENS } = require('../utils/constants');
const { getAddressWeight, getTotalSupply } = require('../utils/helper');

router.get('/address-weight', async (req, res) => {
  const currentStamp = ~~(new Date().getTime() / 1000);
  const { token } = req.query;
  const { address } = req.query;
  try {
    const weight = await getAddressWeight(token, address, currentStamp);
    res.json(weight.value);
  } catch (error) {
    // res.status(500).send({ error });
    res.send('error:' + error );
  }
});

router.get('/total-weight', async (req, res) => {
  const currentStamp = ~~(new Date().getTime() / 1000);
  const { lp_idx } = req.query;
  try {
    const weight = await getTotalSupply(LP_TOKENS[Number(lp_idx)], currentStamp);
    res.json(weight.value);
  } catch (error) {
    res.send('error:' + error);
  }
});

router.get("/history-data", async (req, res)=>{
  // We should validate it through middleware
  const { address } = req.query;
  try {
    const savedAddrHistory = await Task.findAll({
      where: { address },
      order: [['timestamp', 'DESC']]
    });

    const savedTokenHistory = await Task.findAll({
      where: { address: { in: [LP_TOKENS[0].address, LP_TOKENS[1].address] } },
      order: [['timestamp', 'DESC']]
    })

    const newAddrStampStart = savedAddrHistory.length > 0 ? savedAddrHistory[0].timestamp : AIRDROP_START_TIMESTAMP;
    const newTokenStampStart = savedTokenHistory.length > 0 ? savedTokenHistory[0].timestamp : AIRDROP_START_TIMESTAMP;
    const currentStamp = ~~(new Date().getTime() / 1000);
    const newStampEnd = AIRDROP_END_TIMESTAMP > currentStamp ? currentStamp : AIRDROP_END_TIMESTAMP;
    
    const newAddrHistoryMilestones = [];
    const newTokenHistoryMilestones = [];

    // Token total weight History
    let ii = 0;
    while(1) {
      const delta = (ii + 1) * 24 * 3600;
      if ((newAddrStampStart + delta) <= newStampEnd ) {
        newAddrHistoryMilestones.push(newAddrStampStart + delta);
      }
      if ((newTokenStampStart + delta) <= newStampEnd) {
        newTokenHistoryMilestones.push(newTokenStampStart + delta)
      }
      if ((newAddrStampStart + delta) > newStampEnd &&  (newTokenStampStart + delta) > newStampEnd) {
        break;
      }
      ii += 1;
    }
    // Update token weights
    const lpPromises = []
    for (const ts of newTokenHistoryMilestones) {
      lpPromises.push(getTotalSupply(LP_TOKENS[0], ts));
      lpPromises.push(getTotalSupply(LP_TOKENS[1], ts));
    }
    const newLPTotalWeights = await Promise.all(lpPromises).then((values) => {
      return values.map((value) => ({
        address: value.address,
        timestamp: value.timestamp,
        weight: value.value,
        token: value.address
      }))
    });

    // Update Address weights
    const addrPromises = [];
    for (const ts of newAddrHistoryMilestones) {
      addrPromises.push(getAddressWeight(LP_TOKENS[0].address, address, ts));
      addrPromises.push(getAddressWeight(LP_TOKENS[1].address, address, ts));
    }
    const newAddrWeights = await Promise.all(addrPromises).then((values) => {
      return values.map((value) => ({
        address: value.address,
        timestamp: value.timestamp,
        weight: value.value,
        token: value.token
      }))
    });

    await Task.bulkCreate([...newLPTotalWeights, ...newAddrWeights]);
    res.json([...savedAddrHistory, ...newAddrWeights, ...savedTokenHistory, ...newLPTotalWeights])
  } catch (error) {
    // res.status(500).send({ error })
    res.send('error:' + error);
  }
})

module.exports = router;
