import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Box } from 'rebass'
import styled from 'styled-components'

import { AutoRow, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import PairList from '../components/PairList'
import Search from '../components/Search'
import Spinner from '../components/Spinner'

import { useMedia } from 'react-use'
import Panel from '../components/Panel'
import { formattedNum, formattedPercent } from '../utils'
import { getAddressWeights, getSumOfWeights, getPercent, getTotalWeight, LP_TOKENS, getHistoryData } from '../utils/airdrop'
import { TYPE, ThemedBackground } from '../Theme'
import { transparentize } from 'polished'
import { PageWrapper, ContentWrapper } from '../components'

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

const GridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 6px;
  align-items: start;
  justify-content: space-between;
`

function GlobalPage( { tokenWeights } ) {
  const [lpWeights, setLPWeights] = useState([tokenWeights[0], tokenWeights[1]])
  const [addressWeights, setAddressWeights] = useState(['0', '0'])
  const [historyData, setHistoryData] = useState([[], []])
  const [showError, setShowError] = useState(false)

  const [loadingWeight, setLoadingWeight] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  // breakpoints
  const below800 = useMedia('(max-width: 800px)')

  // scrolling refs
  useEffect(() => {
    document.querySelector('body').scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  const searchHandler = async (address) => {
    const getWeights = async () => {
      try {
        setLoadingWeight(true)
        const lpTotalWeights = await getTotalWeight()
        const weights = await getAddressWeights(address)
        setShowError(false)
        setLPWeights([...lpTotalWeights])
        setAddressWeights([...weights])
        setLoadingWeight(false)
      } catch {
        setShowError(true)
        setLoadingWeight(false)
      }
    }

    const getHistory = async () => {
      try {
        setLoadingHistory(true)
        const data = await getHistoryData(address)
        setHistoryData([...data])
        setShowError(false)
        setLoadingHistory(false)
      } catch {
        setShowError(true)
        setLoadingHistory(false)
      }
    }
    if (!!address) {
      getWeights()
      getHistory()
    }
  }

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.6, '#ff007a')} />
      <ContentWrapper>
        <div>
          <AutoColumn gap="24px" style={{ paddingBottom: below800 ? '0' : '24px' }}>
            <TYPE.largeHeader>QiSwap Pioneers 3 Airdrop</TYPE.largeHeader>
            <Search searchHandler={searchHandler} />
            {
              showError &&
              <TYPE.main color={'red'}>
                Qtum Address is invalid or something wrong happened. Try again!
              </TYPE.main>
            }
          </AutoColumn>

          <GridRow>
            {LP_TOKENS.map((lp, idx) => {
              return (
                <Panel style={{ height: '100%' }} key={idx}>
                  { loadingWeight === false
                    ? (
                      <Box>
                        <AutoColumn gap="36px">
                          <AutoColumn gap="20px">
                            <RowBetween>
                              <TYPE.main>{lp.symbol} Pool</TYPE.main>
                              <div />
                            </RowBetween>
                            <RowBetween align="flex-end">
                              <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
                                {formattedNum(lpWeights[idx], false)}
                              </TYPE.main>
                            </RowBetween>
                            <RowBetween align="flex-end">
                              <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
                                {formattedNum(addressWeights[idx], false)}
                              </TYPE.main>
                              <TYPE.main fontSize={12}>
                                {formattedPercent(getPercent(lpWeights[idx], addressWeights[idx]))}
                              </TYPE.main>
                            </RowBetween>
                          </AutoColumn>
                        </AutoColumn>
                      </Box>
                    )
                    : (
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Spinner />
                      </div>
                    )
                  }
                </Panel>
              )
            })}
          </GridRow>
          <Box mb={20} mt={20}>
            <Panel>
              <Box>
                <AutoColumn gap="36px">
                  {
                    loadingWeight === false
                      ? (
                        <AutoColumn gap="20px">
                          <RowBetween>
                            <TYPE.main>Aggregation</TYPE.main>
                            <div />
                          </RowBetween>
                          <RowBetween align="flex-end">
                            <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
                              {formattedNum(getSumOfWeights(lpWeights[0], lpWeights[1]), false)}
                            </TYPE.main>
                          </RowBetween>
                          <RowBetween align="flex-end">
                            <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
                              {formattedNum(getSumOfWeights(addressWeights[0], addressWeights[1]), false)}
                            </TYPE.main>
                            <TYPE.main fontSize={12}>
                              {formattedPercent(getPercent(getSumOfWeights(lpWeights[0], lpWeights[1]), getSumOfWeights(addressWeights[0], addressWeights[1])))}
                            </TYPE.main>
                          </RowBetween>
                        </AutoColumn>
                      )
                      : (
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                          <Spinner />
                        </div>
                      )
                  }
                </AutoColumn>
              </Box>
            </Panel>
          </Box>
          {
            LP_TOKENS.map((lp, idx) => {
              return (
                <div key={idx}>
                  <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
                    <RowBetween>
                      <TYPE.main fontSize={'1rem'} style={{ whiteSpace: 'nowrap' }}>
                        {lp.symbol} Weight History
                      </TYPE.main>
                    </RowBetween>
                  </ListOptions>
                  <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
                    {
                      loadingHistory === false
                      ? (
                        <PairList pairs={historyData[idx]} />
                      )
                      : (
                        <div style={{display: 'flex', justifyContent: 'center'}} key={idx}>
                          <Spinner />
                        </div>
                      )
                    }
                  </Panel>
                </div>
              )
            })
          }
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(GlobalPage)
