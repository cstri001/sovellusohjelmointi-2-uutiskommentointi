import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const apiAuthRouter : express.Router = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiAuthRouter.post('/login', async (req : express.Request, res : express.Response) : Promise<void> => {
  try {
    const { kayttajatunnus, salasana } = req.body;

    // jos jompikumpi puuttuu, palautetaan virhekoodi ja viesti
    if (!kayttajatunnus || !salasana) {
      res.status(400).json({ message: 'Käyttäjätunnus tai salasana vaaditaan' })
      return;
    }

    // tässä etsitään tietokannasta käyttäjän antama käyttäjätunnus
    const kayttaja = await prisma.kayttaja.findFirst({
      where: { kayttajatunnus : kayttajatunnus }
    });

    // Jos käyttäjä löydettiin, aletaan katsomaan lisää asioita
    if (kayttaja) {
      // otetaan käyttäjän antama salasana ja hashataan se, verrataan sitä tietokannassa olevaan
      const hash = crypto.createHash('SHA512').update(salasana).digest('hex')
      if (hash === kayttaja.salasana) {
        // jwt sign luo tokenin, ja siihen voi liittää kaikkea eri tietoa mukaan, tässä 
        // tapauksessa käyttäjän submittaaman käyttäjätunnuksen.
        // tuo viimeinen ("kissankarva") on salaustunnus, jonka pitää matchata servun 
        // index.ts olevaan salaustunnukseen
        const token = jwt.sign({kayttajatunnus: kayttaja.kayttajatunnus}, 'Kissankarva');
        // jos kaikki ok, palautetaan frontille tietona token
        res.status(200).json({ token })
        return
      }
    }

    res.status(401).json({ message: 'Virheellinen käyttäjätunnus tai salasana' })
  } catch {
    res.status(401)
  }
})

export default apiAuthRouter;