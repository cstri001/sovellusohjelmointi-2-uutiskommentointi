import express from 'express';
import path from 'path';
import apiUutisetRouter from './routes/apiUutiset';
import apiAuthRouter from './routes/apiAuth';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import apiKommentitRouter from './routes/apiKommentit';

const app : express.Application = express();

const port : number = Number(process.env.PORT) || 3106;

// tämä katsoo, onko se apiAuthissa annettu salasana ja sen salaustunnus (kissankarva)
// sama kun mikä täällä on määritetty
const checkToken: express.RequestHandler = (req : express.Request, res : express.Response, next : express.NextFunction) => {
    try {
        if (!req.headers.authorization) {
            res.status(401).json({ message: 'Token puuttuu!' });
            return;
        }
        // se headerin authorization-homma on defaulttina muotoa "Bearer sdfsdflg", 
        // joten splitataan tää homma välilyönnistä ja annetaan tokenille se jälkimmäisen
        // arvo
        let token : string = req.headers.authorization!.split(' ')[1];
        const decoded = jwt.verify(token, 'Kissankarva');

        (req as any).kayttaja = decoded;

        console.log('Token validioitu! Käyttäjä saa edetä!')

        // Jatka koodin suorittamista seuraavaan reittiin tai middlewareen
        next()
    } catch (error) {
        console.log('Huptis!', error)
        res.status(401)
    }
}

app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.static(path.resolve(__dirname, 'public')));

// tänne saa mennä vaikkei tokenia ole
app.use('/api/auth', apiAuthRouter)
// tästä alaspäin kaikki katsotaan sen mukaan, onko token tarkastettu vai ei
app.use('/api/uutiset', apiUutisetRouter);
app.use(checkToken)
app.use('/api/kommentit', apiKommentitRouter)

app.listen(port, () => {
    console.log(`Palvelin käynnistyi porttiin ${port}.`)
})