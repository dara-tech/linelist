import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Resolve frontend static files path (checks multiple standard locations)
const possibleDistPaths = [
  process.env.CLIENT_DIST_PATH,
  path.resolve(__dirname, '../public'),
  path.resolve(__dirname, '../../frontend/dist'),
  '/opt/vcct-repo/vcct/frontend/dist',
].filter(Boolean);

let clientDistPath = null;
for (const p of possibleDistPaths) {
  if (fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html'))) {
    clientDistPath = p;
    break;
  }
}

if (clientDistPath) {
  console.log(`📦 Serving frontend static build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // SPA fallback for HTML5 History API (routes other than /api return index.html)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root greeting fallback if no frontend build is mounted
  app.get('/', (req, res) => {
    res.json({
      name: 'DHIS2 VCCT Line List Bridge API',
      version: '1.0.0',
      status: 'API Live (No frontend build mounted)',
      documentation: '/api/health',
      endpoints: [
        '/api/hierarchy',
        '/api/metadata',
        '/api/linelist/vcct',
        '/api/data-quality/summary',
        '/api/reports/art-vcct-summary',
      ],
    });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 DHIS2 VCCT Line List System running on http://localhost:${PORT}`);
});
