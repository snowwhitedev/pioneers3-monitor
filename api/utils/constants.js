const AIRDROP_START_TIME = '2021-07-31T23:59:59Z'; // 1627689599
const AIRDROP_END_TIME = '2021-08-31T23:59:59Z';  //  1627826399

const AIRDROP_START_TIMESTAMP = new Date(AIRDROP_START_TIME).getTime() / 1000;
const AIRDROP_END_TIMESTAMP = new Date(AIRDROP_END_TIME).getTime() / 1000;

const LP_TOKENS = [
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
];

module.exports = {
  AIRDROP_START_TIME,
  AIRDROP_END_TIME,
  AIRDROP_START_TIMESTAMP,
  AIRDROP_END_TIMESTAMP,
  LP_TOKENS
}
