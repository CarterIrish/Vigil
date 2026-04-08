import 'dotenv/config';

import path from 'path';
import express, { Express } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import { engine } from 'express-handlebars';
import router from './router';

const PORT = process.env.PORT || process.env.NODE_PORT;
const app: Express = express();

app.use(helmet());
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
app.use(favicon(path.resolve(`${__dirname}/../hosted/img/favicon.png`)));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', path.resolve(`${__dirname}/../views`));

router(app);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}. View at http://localhost:${PORT}`);
});

