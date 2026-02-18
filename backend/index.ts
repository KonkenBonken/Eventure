import express, {type Request, type Response} from 'express';
import {join as join_path} from 'path';

const app = express();
const port = 80;

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

const current_directory = import.meta.dirname;
const frontend_directory = join_path(current_directory, '../frontend');
const serve_file = (filename: string) =>
    (req: Request, res: Response) => res.sendFile(join_path(frontend_directory, filename));

app.get('/', serve_file('index.html'));
app.get('/index.js', serve_file('index.js'));

app.listen(port, () => console.log('Listening on port ' + port));
