import './App.css'
import { Container, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import KirjautuminenDialogi from './components/KirjautuminenDialogi'
import Uutiset from './components/Uutiset'
import { jwtDecode } from 'jwt-decode'

export interface Uutinen {
  uutisId: number,
  otsikko: string,
  sisalto: string
}

export interface Kayttaja {
  kayttajatunnus: string
}

function App() {


  // Tässä tallennetaan asioita sinne apiDataan, mitä saadaan servusta vastauksena fetchilla
  const [apiData, setApiData] = useState<Uutinen[]>([])

  // tässä katsotaan onko kirjautumisdialogi auki
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  }

  // Tämä välitetään KirjautuminenDialogiin propseilla. Se onnistuu koska tämä on ns. ylempänä, 
  // ja sen tiedon voi sitten välittää sen "alemmas"
  const [token, setToken] = useState<string>(String(localStorage.getItem('token')))
  const [kayttaja, setKayttaja] = useState<Kayttaja | null>(null);
  const apiKutsu = async (): Promise<void> => {
    try {
      const yhteys = await fetch('http://localhost:3106/api/uutiset', { method: 'GET' })

      const uutiset: Uutinen[] = await yhteys.json()
      setApiData(uutiset);
    }
    catch {
      console.log('uptit')
    }
  }

  useEffect(() => {
    if (token) {
      try {
        const decoded: Kayttaja = jwtDecode(token)
        setKayttaja(decoded)
      } catch (error) {
        console.error('Tokenin dekoodaus epäonnistui:', error)
        kirjauduUlos()
      }
    }
  }, [token])

  useEffect(() => {
    apiKutsu();
  }, []);

  // Poistetaan token localStoragesta, mikäli painetaan nappia "Kirjaudu ulos"
  const kirjauduUlos = () => {
    setToken('')
    localStorage.removeItem('token')
  }

  return (
    <Container>


      <Routes>
        <Route path='/' element={<Uutiset apiData={apiData} token={token} kayttaja={kayttaja} />} />
      </Routes>

      {
        !token ? (
          <Button onClick={() => setOpen(true)}>
            Kirjaudu sisään kommentoidaksesi
          </Button>
        ) : (
          <Button onClick={kirjauduUlos}>
            {`Kirjaa ulos käyttäjä ${kayttaja?.kayttajatunnus}`}
          </Button>
        )
      }
      <KirjautuminenDialogi
        open={open}
        onClose={handleClose}
        setToken={setToken} // Tässä annetaan kirjautumisdialogille setToken funktio, joka tallentaa tokenin stateen
      />
    </Container>
  )
}

export default App
