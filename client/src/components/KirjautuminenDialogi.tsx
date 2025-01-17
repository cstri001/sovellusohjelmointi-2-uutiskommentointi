import React, { Dispatch, SetStateAction } from "react";
import { useRef } from "react";
import { Dialog, DialogContent, DialogTitle, TextField, Button, Stack, Box } from "@mui/material";


// Tässä välitetään propseihin se setToken, joka elää App.tsx-filussa. Ne on aina tätä tyyppiä
// (Dispatch<....>)
interface DialogProps {
  setToken: Dispatch<SetStateAction<string>>
  open: boolean
  onClose: () => void
}

const KirjautuminenDialogi : React.FC<DialogProps> = (props : DialogProps) : React.ReactElement => {
    
  const lomakeRef = useRef<HTMLFormElement>();
  const kirjaudu = async (e : React.FormEvent) : Promise<void> => {
    e.preventDefault();

    if (lomakeRef.current?.kayttajatunnus.value) {
      if (lomakeRef.current?.salasana.value) {
        const yhteys = await fetch('http://localhost:3106/api/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              kayttajatunnus: lomakeRef.current?.kayttajatunnus.value,
              salasana: lomakeRef.current?.salasana.value
          })
        })
        if (yhteys.status === 200) {
          let {token} = await yhteys.json();
          // Tämä setToken on App.tsx-puolella oleva homma, joka on propsien kautta annettu
          // se tieto päivittyy siksi tästä sinne App.tsx-filussa olevaan muuttujaan
          props.setToken(token);
          localStorage.setItem('token', token)
          
        }
      }
    }

    props.onClose()
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogContent>
        <DialogTitle>Kirjaudu sisään</DialogTitle>
        <Box 
          component='form'
          onSubmit={kirjaudu}
          ref={lomakeRef}
        >
          <Stack spacing={2}>
            <TextField label='Käyttäjätunnus' name='kayttajatunnus'/>
            <TextField label='Salasana' name='salasana' type='password'/>
            <Button type='submit'>
                Kirjaudu sisään
            </Button>
            <Button onClick={props.onClose}>
                Peruuta
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default KirjautuminenDialogi;