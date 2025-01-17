import express from "express";
import { Prisma, PrismaClient, uutinen } from "@prisma/client";

const prisma : PrismaClient = new PrismaClient();
const apiKommentitRouter : express.Router = express.Router();

const muotoilePaiva = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.getMonth().toString().padStart(2, '0')
  const year = date.getFullYear().toString()

  return `${day}.${month}.${year}`
}

apiKommentitRouter.post('/', async (req : express.Request, res : express.Response) : Promise<void> => {
  try {
    const { kommentti, uutisId } = req.body
    const { kayttajatunnus } = (req as any).kayttaja
  
    if (!kommentti || !uutisId) {
      res.status(400).json({ message: 'Kommentti tai uutisId puuttuu' });
      return
    }

    const uusiKommentti = await prisma.kommentti.create({
      data: {
        kommentti,
        uutisId,
        kayttajatunnus: kayttajatunnus,
        aikaleima: muotoilePaiva(new Date())
      }
    })
  
    res.status(201).json({ message: 'Kommentti lisätty onnistuneesti', data: uusiKommentti });
  } catch (error) {
    console.error('Virhe kommentin lisäämisessä:', error);
    res.status(500).json({ message: 'Jotain meni pieleen, yritä uudelleen myöhemmin.' });
  }
})

apiKommentitRouter.get('/:uutisId', async (req : express.Request, res : express.Response) => {
  const { uutisId } = req.params;

  if (!uutisId) {
    res.status(400).json({ message: 'uutisId vaaditaan' });
    return;
  }

  try {
    const kommentit = await prisma.kommentti.findMany({
      where: {
        uutisId: Number(uutisId)
      },
      orderBy: {
        aikaleima: 'desc'
      }
    })

    res.status(200).json(kommentit)
  } catch (error) {
    console.error('Virhe kommenttien hakemisessa:', error);
    res.status(500).json({ message: 'Jotain meni pieleen haettaessa kommentteja, yritä uudelleen myöhemmin.' });
  }
})

export default apiKommentitRouter;