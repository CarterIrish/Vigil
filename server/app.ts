import 'dotenv/config';

//* TODO: Sessions use `rolling: true`, so any request from the client extends the cookie's TTL.
//* To avoid keeping sessions alive for users who aren't actually viewing the page, gate client-side
//* refresh requests (widget polling, keep-alives) on the Page Visibility API:
//*   - Only fire requests when `document.visibilityState === 'visible'`.
//*   - Subscribe to `visibilitychange` to pause/resume the refresh interval.
//* Use visibility, NOT `document.hasFocus()` — focus is false when another window is active, which
//* would incorrectly pause updates for users viewing the tab on a second monitor.

import path from 'path';
import express, { Express } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import { engine } from 'express-handlebars';
import router from './router';

import mongoose from 'mongoose';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

const PORT = process.env.PORT || process.env.NODE_PORT;
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/Vigil';
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS) || 30 * 60 * 1000;

mongoose.connect(dbURI).catch((err) => {
    if (err) {
        console.error('Failed to connect to MongoDB', err);
        throw err;
    }
})

const redisClient = createClient({ url: process.env.REDISCLOUD_URL });

redisClient.on('error', err => console.error('Redis Client Error', err));

redisClient.connect().then(() => {
    const app: Express = express();

    app.use(helmet());
    app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
    app.use(favicon(path.resolve(`${__dirname}/../hosted/img/favicon.png`)));
    app.use(compression());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.set('trust proxy', 1);
    app.use(session({
        name: 'sessionid',
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            maxAge: SESSION_TTL_MS,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        }
    }));

    app.engine('handlebars', engine({ defaultLayout: '' }));
    app.set('view engine', 'handlebars');
    app.set('views', path.resolve(`${__dirname}/../views`));

    router(app);

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}. View at http://localhost:${PORT}`);
    });
});
