import express from 'express';
import { sessionsRoutes, sessionsRoutesGet } from './routes/wts_sessions.routes.js';
import indexRoutes from './routes/index.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./src/public'));
app.use(indexRoutes);
app.use(sessionsRoutesGet)
app.use('/api', sessionsRoutes)

// TODO: Moverlo a un archivo de rutas
app.use((req, res) => {
  if (req.method === 'GET') {
    res.status(404).sendFile('./src/public/404.html', { root: '.' });
  } else if (req.method === 'POST') {
    res.status(404).json({
      message: 'Not found...'
    });
  } else {
    res.status(404).send('Not found...');
  }
});


export default app;
