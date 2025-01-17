import React, { useState, useEffect } from "react";
import { Container, Typography, Stack, Box, Button, List, ListItem, ListItemText } from "@mui/material";
import { Kayttaja, Uutinen } from "../App";
import Kommenttikentta from './Kommenttikentta';


// Tässä määritellään, että komponentille välitettyjen propsien muoto on tämä tietty
// Tuolta App.tsx lähetetään tämä apiData, mihin on servulta haettu api-routen kautta tietoja
interface UutisetProps {
  apiData: Uutinen[]
  token: string
  kayttaja: Kayttaja | null
}

interface Kommentti {
  kommenttiId: string
  uutisId: number
  kayttajatunnus: string
  kommentti: string
  aikaleima: string
}

const Uutiset: React.FC<UutisetProps> = (props): React.ReactElement => {
  const [kommentitMap, setKommentitMap] = useState<Record<number, Kommentti[]>>({})

  const fetchKommentit = async (uutisId: number) => {
    try {
      const yhteys = await fetch(`http://localhost:3106/api/kommentit/${uutisId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${props.token}`
        }
      });

      if (yhteys.status === 200) {
        const kommentit = await yhteys.json();
        return kommentit;
      } else {
        console.error('Kommenttien haku epäonnistui:', await yhteys.text());
        return [];
      }
    } catch (error) {
      console.error('Virhe kommenttien haussa:', error);
      return [];
    }
  }

  useEffect(() => {
    // Hae kommentit kaikille uutisille
    const fetchAllKommentit = async () => {
      const kommentitPromises = props.apiData.map(async (uutinen) => {
        const kommentit = await fetchKommentit(uutinen.uutisId);
        return { uutisId: uutinen.uutisId, kommentit };
      });

      const kommentitData = await Promise.all(kommentitPromises);
      const kommentitObj = kommentitData.reduce((acc, { uutisId, kommentit }) => {
        acc[uutisId] = kommentit;
        return acc;
      }, {} as Record<number, Kommentti[]>);

      setKommentitMap(kommentitObj);
    };

    fetchAllKommentit();
  }, [props.apiData, props.token]);

  return (
    <Container>
      <Typography variant='h1'>
        Uutiset
      </Typography>
      <Stack spacing={2}>
        {
          props.apiData.map((uutinen: Uutinen, idx: number) => {
            const kommentit = kommentitMap[uutinen.uutisId] || []
            return (
              <Box component='section' key={idx}>
                <Typography variant='h2'>{uutinen.otsikko}</Typography>
                <Typography variant='body1'>{uutinen.sisalto}</Typography>
                {
                  props?.token && (
                    <>
                      <List>
                        <Typography variant="h4">Kommentit</Typography>
                        {kommentit.length > 0 ? (
                          kommentit.map((kommentti) => (
                            <ListItem key={kommentti.kommenttiId} sx={{ margin: '10px 0' }}>
                              <ListItemText
                                secondary={`${kommentti.kayttajatunnus} (${kommentti.aikaleima}) uutisId: ${kommentti.uutisId}`}
                                primary={kommentti.kommentti}
                              />
                            </ListItem>
                          ))
                        ) : (
                          <Typography variant="body2">Ei kommentteja.</Typography>
                        )}
                      </List>
                      <Kommenttikentta
                        kayttaja={props.kayttaja}
                        uutisId={uutinen.uutisId}
                      />
                    </>
                  )
                }
              </Box>
            )
          })
        }
      </Stack>
    </Container>
  )
}

export default Uutiset;