import 'dotenv/config';

import path from 'path';
import express, { Express } from 'express';
import compression from 'compression';
import favicon from 'serve-favicon';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

import router from './router';

const port = process.env.PORT || process.env.NODE_PORT;
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI!).catch((error: Error) => {
    console.log("Could not connect to database");
    throw error;
});

const redisClient = createClient({
    url: process.env.REDISCLOUD_URL,
});

redisClient.on("error", (err: Error) => {
    console.log("Redis Client Error", err);
});

redisClient.connect().then(() => {
    const app: Express = express();

    app.use(helmet());
    app.use("/assets", express.static(path.resolve(`${__dirname}/../hosted`)));
    app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
    app.use(compression());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(
        session({
            name: "sessionid",
            store: new RedisStore({ client: redisClient }),
            secret: process.env.SESSION_SECRET!,
            resave: false,
            saveUninitialized: false,
        }),
    );

    app.engine("handlebars", engine({ defaultLayout: "" }));
    app.set("view engine", "handlebars");
    app.set("views", `${__dirname}/../views`);

    router(app);

    app.listen(port, () => {
        console.log(`Listening on port ${port}. View at http://localhost:${port}`);
    });
});
