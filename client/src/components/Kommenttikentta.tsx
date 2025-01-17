import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Kayttaja } from "../App";

interface KommenttikenttaProps {
  kayttaja: Kayttaja | null
  uutisId: number
}

const Kommenttikentta: React.FC<KommenttikenttaProps> = (props): React.ReactElement => {
  const [kommentti, setKommentti] = useState<string>('');
  const token = localStorage.getItem('token');

  const handleKommenttiChange = (uusiKommentti: string) => {
    setKommentti(uusiKommentti)
  }

  const lahetaKommentti = async () => {
    if (!kommentti) {
      window.alert('Kommentti ei saa olla tyhjä!');
      return;
    }

    if (!props?.uutisId) {
      console.error('Jotakin meni vikaan. UutisId puuttuu.');
      return;
    }

    const yhteys = await fetch('http://localhost:3106/api/kommentit', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        kommentti,
        uutisId: props.uutisId
      })
    })
    if (yhteys.status === 201) {
      console.log('Kommentti lähetetty onnistuneesti!')
    } else {
      console.error('Kommentin lähettäminen epäonnistui!')
    }
  }

  return (
    <Box>
      <Typography
        variant="h6"
        color="pink"
      >
        Olet jättämässä kommenttia käyttäjänä {`${props.kayttaja?.kayttajatunnus}`.toLocaleUpperCase()}
      </Typography>
      <TextField
        id='outlined-textarea'
        label='Kommentti'
        placeholder='Kommentti'
        multiline
        value={kommentti} 
        onChange={(e) => handleKommenttiChange(e.target.value)}
      />
      <Button onClick={lahetaKommentti}>
        Lähetä kommentti
      </Button>
    </Box>
  )
}

export default Kommenttikentta;