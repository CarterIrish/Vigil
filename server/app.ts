import 'dotenv/config';

import path from 'path';
import express, { Express } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import { engine } from 'express-handlebars';
import router from './router';

import mongoose from 'mongoose';
import session from 'express-session';
import {RedisStore} from 'connect-redis';
import redis from 'redis';

const PORT = process.env.PORT || process.env.NODE_PORT;
const dbURI = process.env.MOGODB_URI || 'mongodb://localhost/Vigil';

mongoose.connect(dbURI).catch((err) => {
    if (err) {
        console.log('Failed to connect to MongoDB');
        throw err;
    }
})

const redisClient = redis.createClient({ url: process.env.REDISCLOUD_URL });

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect().then(() => {
    const app: Express = express();

    app.use(helmet());
    app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
    app.use(favicon(path.resolve(`${__dirname}/../hosted/img/favicon.png`)));
    app.use(compression());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(session({
        name: 'sessionid',
        store: new RedisStore({
            client:redisClient
        }),
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false
    }));

    app.engine('handlebars', engine({ defaultLayout: '' }));
    app.set('view engine', 'handlebars');
    app.set('views', path.resolve(`${__dirname}/../views`));

    router(app);

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}. View at http://localhost:${PORT}`);
    });
});
