import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { type User } from './types'

type sorting = 'none' | 'name' | 'lastname' | 'country'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState<boolean>(false)
  const [filterCountry, setFilterCountry] = useState<string>('')
  const [sortingType, setSortingType] = useState<sorting>('none')
  const usersImmutable = useRef<User[]>([])

  const handleDelete = (email: string) => {
    const newUsers = users.filter(user => user.email !== email)
    setUsers(newUsers)
  }

  const handleRestore = () => {
    setUsers(usersImmutable.current)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then(async res => await res.json())
      .then(data => {
        setUsers(data.results)
        usersImmutable.current = data.results
      })
      .catch(e => { console.log(e) })
  }, [])

  const filteredContry = useMemo(() => {
    return filterCountry.length > 0 && filterCountry != null
      ? users.filter(user => user.location.country.toLowerCase().includes(filterCountry.toLowerCase()))
      : users
  }, [filterCountry, users])

  const orderUsers = useMemo(() => {
    if (sortingType === 'none') {
      return filteredContry
    } else if (sortingType === 'name') {
      return filteredContry.sort((a, b) => a.name.first.localeCompare(b.name.first))
    } else if (sortingType === 'lastname') {
      return filteredContry.sort((a, b) => a.name.last.localeCompare(b.name.last))
    } else if (sortingType === 'country') {
      return filteredContry.sort((a, b) => a.location.country.localeCompare(b.location.country))
    }

    return users
  }, [filteredContry, sortingType])

  return (
    <main className="App">
      <header>
        <button onClick={(): void => {
          setShowColors(!showColors)
        }}>{showColors ? 'No colorear la tabla' : 'Colorear la tabla'}</button>

        <button onClick={(): void => {
          setSortingType('country')
        }}>{sortingType === 'country' ? 'No ordenar por país' : 'Ordenar por país'}</button>

        <button onClick={handleRestore}>Restore users</button>

        <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setFilterCountry(e.target.value)
        }} type='text' placeholder='Australia...' />
      </header>

      <section>
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th onClick={() => {
                setSortingType('name')
              }}>Nombre</th>
              <th onClick={() => {
                setSortingType('lastname')
              }}>Apellido</th>
              <th onClick={() => {
                setSortingType('country')
              }}>País</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>

            {orderUsers.map((user, index) => {
              const backgroundColor = index % 2 === 0 ? '#333' : '#555'
              const color = showColors ? backgroundColor : 'transparent'
              return (
                <tr style={{ backgroundColor: color }} key={user.email}>
                  <td><img src={user.picture.thumbnail} alt={'Photo user: ' + user.name.title} /></td>
                  <td>{user.name.first}</td>
                  <td>{user.name.last}</td>
                  <td>{user.location.country}</td>
                  <td>
                    <button onClick={() => {
                      handleDelete(user.email)
                    }}>Delete</button>
                  </td>
                </tr>
              )
            })}

          </tbody>
        </table>
      </section>
    </main>
  )
}

export default App
