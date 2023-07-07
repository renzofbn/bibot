import express from 'express';
import sessionsRoutes from './routes/wts_sessions.routes.js';
import indexRoutes from './routes/index.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./src/public'));
app.use(indexRoutes)
app.use('/api', sessionsRoutes)

app.use((req, res) => {
  res.status(404).json({
    message: 'Not found...' 
  });  
})


export default app;
