import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'

import { Divider } from '../../components'
import { withRouter } from 'react-router-dom'
import { formattedNum, formattedPercent } from '../../utils'
import { TYPE } from '../../Theme'
import { AutoColumn } from '../Column'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'name liq vol';
  padding: 0 1.125rem;

  opacity: ${({ fade }) => (fade ? '0.6' : '1')};

  > * {
    justify-content: flex-end;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (min-width: 740px) {
    padding: 0 1.125rem;
    grid-template-columns: 1.5fr 1fr 1fr};
    grid-template-areas: ' name liq vol pool ';
  }

  @media screen and (min-width: 1080px) {
    padding: 0 1.125rem;
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: ' name liq vol volWeek fees apy';
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    grid-template-areas: ' date totalWeight weight percentage ';
  }
`

const ListWrapper = styled.div``

const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  text-align: end;
  user-select: none;
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const formatDataText = (value) => {
  return (
    <AutoColumn gap="2px" style={{ opacity: '1' }}>
      <div style={{ textAlign: 'right' }}>{value}</div>
    </AutoColumn>
  )
}

function PairList({ pairs, color, disbaleLinks, maxItems = 10, useTracked = false }) {
  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [pairs])

  useEffect(() => {
    if (pairs) {
      let extraPages = 1
      if (Object.keys(pairs).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(pairs).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, pairs])

  const ListItem = ({ pairAddress }) => {
    if (pairAddress.date) {
      return (
        <DashGrid style={{ height: '48px' }} disbaleLinks={disbaleLinks} focus={true}>
          <DataText area="date" fontWeight="500" style={{ whiteSpace: 'nowrap' }}>
            {pairAddress.date}
          </DataText>
          <DataText area="totalWeight">{formattedNum(pairAddress.totalWeight, false)}</DataText>
          <DataText area="weight">{formatDataText(pairAddress.weight, false)}</DataText>
          <DataText area="percentage">
            {formattedPercent(pairAddress.percentage)}
          </DataText>
        </DashGrid>
      )
    } else {
      return ''
    }
  }

  const pairList =
    pairs &&
    pairs
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
      .map((pairAddress, index) => {
        return (
          pairAddress && (
            <div key={index}>
              <ListItem key={index} index={(page - 1) * ITEMS_PER_PAGE + index + 1} pairAddress={pairAddress} />
              <Divider />
            </div>
          )
        )
      })

  return (
    <ListWrapper>
      <DashGrid
        center={true}
        disbaleLinks={disbaleLinks}
        style={{ height: 'fit-content', padding: '0 1.125rem 1rem 1.125rem' }}
      >
        <Flex alignItems="center" justifyContent="flexEnd">
          <TYPE.main area="date">Date</TYPE.main>
        </Flex>
        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText area="totalWeight">
            Total Weight
          </ClickableText>
        </Flex>
        <Flex alignItems="center">
          <ClickableText area="weight">
            Weight
          </ClickableText>
        </Flex>
        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText area="percentage">
            Percentage
          </ClickableText>
        </Flex>
      </DashGrid>
      <Divider />
      <List p={0}>{!pairList ? <LocalLoader /> : pairList}</List>
      <PageButtons>
        <div
          onClick={(e) => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
        <div
          onClick={(e) => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </ListWrapper>
  )
}

export default withRouter(PairList)
