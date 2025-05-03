import express from 'express';
import { getCycleData, logPeriod, logSymptoms, getCycleHistory, getCycleAnalysis, updateCycleLength } from '../controllers/cycleController';

const router = express.Router();

router.get('/', getCycleData);
router.post('/log-period', logPeriod);
router.post('/log-symptoms', logSymptoms);
router.get('/history', getCycleHistory);
router.get('/analysis', getCycleAnalysis);
router.post('/update-cycle-length', updateCycleLength);

export default router;