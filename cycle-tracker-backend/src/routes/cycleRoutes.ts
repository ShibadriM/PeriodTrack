import express from 'express';
import { getCycleData, logPeriod, logSymptoms, getCycleHistory, getCycleAnalysis, updateCycleLength, clearPeriodLogs } from '../controllers/cycleController';

const router = express.Router();

router.get('/', getCycleData);
router.post('/log-period', logPeriod);
router.post('/log-symptoms', logSymptoms);
router.get('/history', getCycleHistory);
router.get('/analysis', getCycleAnalysis);
router.post('/update-cycle-length', updateCycleLength);
router.post('/clear-period-logs', clearPeriodLogs);

export default router;