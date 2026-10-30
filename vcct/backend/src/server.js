import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', apiRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    name: 'DHIS2 VCCT Line List Bridge API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: [
      '/api/hierarchy',
      '/api/metadata',
      '/api/linelist/vcct',
      '/api/linelist/vcct/:siteCode/:vcctId',
      '/api/linelist/vcct-export/excel',
    ],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 DHIS2 VCCT Line List Backend API running on http://localhost:${PORT}`);
});
