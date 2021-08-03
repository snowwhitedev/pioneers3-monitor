import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'
import { getTotalWeight } from './utils/airdrop'
import GlobalPage from './pages/GlobalPage'
import SideNav from './components/SideNav'
import LocalLoader from './components/LocalLoader'

const AppWrapper = styled.div`
  position: relative;
  width: 100%;
`
const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;

  @media screen and (max-width: 1400px) {
    grid-template-columns: 220px 1fr;
  }

  @media screen and (max-width: 1080px) {
    grid-template-columns: 1fr;
    max-width: 100vw;
    overflow: hidden;
    grid-gap: 0;
  }
`

const Center = styled.div`
  height: 100%;
  z-index: 9999;
  transition: width 0.25s ease;
  background-color: ${({ theme }) => theme.onlyLight};
`

/**
 * Wrap the component with the header and sidebar pinned tab
 */
const LayoutWrapper = ({ children, savedOpen }) => {
  return (
    <>
      <ContentWrapper open={savedOpen}>
        <SideNav />
        <Center id="center">{children}</Center>
      </ContentWrapper>
    </>
  )
}

function App() {
  const [tokenWeights, setTokenWeights] = useState([])
  const [savedOpen, setSavedOpen] = useState(false)

  useEffect(() => {
    const getWeights = async () => {
      const weights = await getTotalWeight()
      setTokenWeights([...weights])
    }
    getWeights()
  }, [])

  return (
    <AppWrapper>
      {tokenWeights.length > 0 ? (
        <BrowserRouter>
          <Switch>
            <Route
              exacts
              strict
              path="/pair/:pairAddress"
              render={({ match }) => {
                return <Redirect to="/home" />
              }}
            />
            <Route path="/home">
              <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
                <GlobalPage tokenWeights={tokenWeights} />
              </LayoutWrapper>
            </Route>
            <Redirect to="/home" />
          </Switch>
        </BrowserRouter>
      ) : (
        <LocalLoader fill="true" />
      )}
    </AppWrapper>
  )
}

export default App
