import React, { useState } from 'react'
import { useAragonApi, useGuiStyle } from '@aragon/api-react'
import { Main, Button } from '@aragon/ui'
import styled from 'styled-components'

function App() {
  const { api, appState } = useAragonApi()
  const { appearance } = useGuiStyle()
  const { katalysts, isSyncing } = appState
  const [owner, setOwner] = useState('')
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')

  function addKatalyst() {
    let error = ''
    if (owner.length != 42) {
      error += 'Invalid Owner'
    }

    if (domain.length === 0 || domain.indexOf('://') === -1) {
      error += '\nInvalid Domain'
    }

    if (!error) {
      api.addKatalyst(owner, domain).toPromise()
    }

    setError(error)
  }

  const _katalysts = []
  for (let i = 0; i < 10; i++) {
    _katalysts.push(katalysts[0])
  }

  return (
    <Main theme={appearance}>
      <BaseLayout>
        {isSyncing ? (
          <Syncing />
        ) : (
          <>
            <Title>Katalysts</Title>
            {katalysts.length ? (
              <TableLayout>
                <table>
                  <thead>
                    <tr>
                      <th>Owner</th>
                      <th>Domain</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {_katalysts.map(katalyst => (
                      <tr key={katalyst.id}>
                        <td>{katalyst.owner}</td>
                        <td>{katalyst.domain}</td>
                        <td>
                          <Button
                            mode="normal"
                            onClick={() =>
                              api.removeKatalyst(katalyst.id).toPromise()
                            }
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableLayout>
            ) : null}
            <AddKatalyst>
              <Input
                type="text"
                placeholder="0xb4124cEB3451635DAcedd11767f004d8a28c6eE7"
                name="owner"
                value={owner}
                onChange={e => setOwner(e.currentTarget.value)}
              />
              <Input
                type="text"
                name="domain"
                placeholder="https://decentraland.org"
                value={domain}
                onChange={e => setDomain(e.currentTarget.value)}
              />
              {error && <Error>{error}</Error>}
              <Button
                mode="strong"
                disabled={!owner.length || !domain.length}
                onClick={addKatalyst}
              >
                Add katalyst
              </Button>
            </AddKatalyst>
          </>
        )}
      </BaseLayout>
    </Main>
  )
}

const BaseLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  flex-direction: column;
`

const Title = styled.h1`
  margin-top: 20px;
  font-size: 28px;
`

const TableLayout = styled.div`
  max-height: 60%;
  overflow-y: scroll;
  border: 1px solid #e6e6e6;
  width: 100%;

  table {
    border: solid 1px #ddeeee;
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    height: 100%;
  }

  thead th {
    background-color: #d0faff;
    border: solid 1px #ddeeee;
    color: #333333;
    padding: 10px;
    text-align: left;
  }

  tbody td {
    border: solid 1px #ddeeee;
    padding: 10px;
  }

  tbody td button {
    font-size: 13px;
    padding: 4px 16px;
  }

  @media (max-width: 920px) {
    font-size: 12px;

    tbody td button {
      font-size: 12px;
      padding: 4px 16px;
    }
  }
`

const Syncing = styled.div.attrs({ children: 'Syncing…' })`
  position: absolute;
  top: 15px;
  right: 20px;
`

const AddKatalyst = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 20px;
`

const Input = styled.input`
  width: 400px;
  padding: 7px;
  font-size: 14px;
  margin-bottom: 20px;

  ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: #d2d2d2;
  }
  ::-moz-placeholder {
    /* Firefox 19+ */
    color: #d2d2d2;
  }
  :-ms-input-placeholder {
    /* IE 10+ */
    color: #d2d2d2;
  }
  :-moz-placeholder {
    /* Firefox 18- */
    color: #d2d2d2;
  }
`

const Error = styled.p`
  color: #fd4949;
  white-space: pre-line;
  margin-bottom: 10px;
`

export default App
