import express from 'express';
import { infoRouter } from './src/info/info.controller.js';
import cors from 'cors';

const app = express();

async function main() {

    app.use(express.json())

    app.use(cors());

    app.use(express.urlencoded({ extended: true }));

    app.use('/api', infoRouter)

    app.all('*', (req, res) => {
        res.json({'message': 'Нормально напиши роут, дебил'}).status(404)
    })

    app.listen(8000, () => {
        console.log('server is running');        
    })

}

main()

