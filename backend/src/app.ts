import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { apiLimiter, corsMiddleware, helmetMiddleware } from './middleware/security.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.routes.js';
import { catalogRouter } from './routes/catalog.routes.js';
import { aiRouter } from './routes/ai.routes.js';
import { projectRouter } from './routes/project.routes.js';
import { dashboardRouter } from './routes/dashboard.routes.js';

export const app = express();
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'student-research-assistant-api' }));
app.use('/api/auth', authRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/ai', aiRouter);
app.use('/api/projects', projectRouter);
app.use('/api/dashboard', dashboardRouter);
app.use(notFound);
app.use(errorHandler);
