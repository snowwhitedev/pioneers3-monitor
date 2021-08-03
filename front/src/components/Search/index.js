import React, { useState } from 'react'
import styled from 'styled-components'

import { useMedia } from 'react-use'
import { transparentize } from 'polished'

const Container = styled.div`
  height: 48px;
  z-index: 30;
  position: relative;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${({ theme, small, open }) => (small ? (open ? theme.bg6 : 'none') : transparentize(0.4, theme.bg6))};
  border-bottom-right-radius: ${({ open }) => (open ? '0px' : '12px')};
  border-bottom-left-radius: ${({ open }) => (open ? '0px' : '12px')};
  z-index: 9999;
  width: 100%;
  min-width: 300px;
  box-sizing: border-box;
  box-shadow: ${({ open, small }) =>
    !open && !small
      ? '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04) '
      : 'none'};
  @media screen and (max-width: 500px) {
    background: ${({ theme }) => theme.bg6};
    box-shadow: ${({ open }) =>
      !open
        ? '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04) '
        : 'none'};
  }
`
const Input = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  width: 100%;
  color: ${({ theme }) => theme.text1};
  font-size: ${({ large }) => (large ? '20px' : '14px')};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

export const Search = ({ small = false, searchHandler }) => {
  const [value, setValue] = useState('')

  const below700 = useMedia('(max-width: 700px)')
  const below470 = useMedia('(max-width: 470px)')
  const below410 = useMedia('(max-width: 410px)')

  const onChangeHandler = (e) => {
    setValue(e.target.value)    
  }

  const onSearchHandler = (e) => {
    const pressedKey = e.which || e.keyCode
    if (pressedKey === 13) {
      searchHandler(value)
    }
  }

  return (
    <Container small={small}>
      <Wrapper shadow={true} small={small}>
        <Input
          large={!small}
          type={'text'}
          placeholder={
            small
              ? ''
              : below410
              ? 'Address...'
              : below470
              ? 'Search Address...'
              : below700
              ? 'Search Address...'
              : 'Search Address...'
          }
          value={value}
          onKeyPress={onSearchHandler}
          onChange={onChangeHandler}
        />
      </Wrapper>
    </Container>
  )
}

export default Search
