import { Request, Response } from 'express';
import CycleData from '../models/CycleData';

export const clearPeriodLogs = async (req: Request, res: Response) => {
  try {
    await CycleData.updateOne({}, { $set: { periodLogs: [] } });
    res.json({ message: 'Period logs cleared.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing period logs' });
  }
};
export const getCycleData = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const cycleData = await CycleData.findOne({});
    if (!cycleData) {
      return res.status(404).json({ message: 'No cycle data found' });
    }
    return res.json(cycleData);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching cycle data' });
  }
};

export const logPeriod = async (req: Request, res: Response) => {
  console.log('Received body:', req.body);
  try {
    const { startDate, endDate, flow } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid startDate or endDate' });
    }

    const periodLength = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    const cycleData = await CycleData.findOneAndUpdate(
      {},
      {
        $push: { periodLogs: { startDate, endDate, flow } },
        $set: { 
          lastPeriodStart: startDate,
          periodLength: periodLength
        }
      },
      { new: true, upsert: true }
    );

    res.json(cycleData);
  } catch (error) {
    console.error('Error logging period:', error); 
    res.status(500).json({ message: 'Error logging period' });
  }
};

export const logSymptoms = async (req: Request, res: Response) => {
  try {
    const { date, type, severity } = req.body;

    const cycleData = await CycleData.findOneAndUpdate(
      {},
      {
        $push: { symptoms: { date, type, severity } }
      },
      { new: true, upsert: true }
    );

    res.json(cycleData);
  } catch (error) {
    res.status(500).json({ message: 'Error logging symptoms' });
  }
};
export const getCycleHistory = async (req: Request, res: Response) => {
  try {
    // Get the latest (or only) cycle data document
    const cycleData = await CycleData.findOne().sort({ updatedAt: -1 });

    if (!cycleData || !cycleData.periodLogs || cycleData.periodLogs.length === 0) {
      return res.json([]);
    }

    // Map periodLogs to the format expected by the frontend
    const history = cycleData.periodLogs.map(log => ({
      startDate: log.startDate,
      endDate: log.endDate,
      length: Math.ceil((new Date(log.endDate).getTime() - new Date(log.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
      flow: log.flow,
      symptoms: (cycleData.symptoms || [])
        .filter(sym => {
          const symDate = new Date(sym.date);
          return symDate >= new Date(log.startDate) && symDate <= new Date(log.endDate);
        })
        .map(sym => sym.type)
    }));

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cycle history' });
  }
};
export const getCycleAnalysis = async (req: Request, res: Response) => {
  try {
    const cycleData = await CycleData.findOne().sort({ updatedAt: -1 });

    // No period logs at all
    if (!cycleData || !cycleData.periodLogs || cycleData.periodLogs.length === 0) {
      return res.json({
        averageLength: null,
        lengthVariation: null,
        periodLength: null,
        periodVariation: null,
        ovulationDay: null,
        lutealPhase: 14,
        symptoms: [],
        message: "No period data available. Please log at least two periods for full analysis."
      });
    }

    const periodLogs = cycleData.periodLogs;

    // Only one period log: can't calculate cycle length, but can show period length
    if (periodLogs.length === 1) {
      const log = periodLogs[0];
      const periodLength = Math.ceil(
        (new Date(log.endDate).getTime() - new Date(log.startDate).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

      return res.json({
        averageLength: null,
        lengthVariation: null,
        periodLength,
        periodVariation: null,
        ovulationDay: null,
        lutealPhase: 14,
        symptoms: [],
        message: "Not enough data to calculate cycle statistics. Please log at least two periods."
      });
    }
    console.log('Period logs:', periodLogs.map(log => log.startDate));
    // Sort period logs by startDate just in case
    periodLogs.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // Calculate cycle lengths (difference between start dates of consecutive periods)
    const cycleLengths: number[] = [];
    for (let i = 1; i < periodLogs.length; i++) {
      const prev = periodLogs[i - 1];
      const curr = periodLogs[i];
      const cycleLength = Math.ceil(
        (new Date(curr.startDate).getTime() - new Date(prev.startDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      cycleLengths.push(cycleLength);
    }

    // Calculate period lengths
    const periodLengths: number[] = periodLogs.map(log =>
      Math.ceil(
        (new Date(log.endDate).getTime() - new Date(log.startDate).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );

    // Helper functions
    const average = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
    const stddev = (arr: number[]) => {
      if (arr.length < 2) return null;
      const avg = average(arr) as number;
      return Math.sqrt(arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / (arr.length - 1));
    };

    const averageLength = cycleLengths.length ? Math.round(average(cycleLengths) as number) : null;
    const lengthVariation = cycleLengths.length > 1 ? Math.round(stddev(cycleLengths) as number) : null;
    const periodLength = periodLengths.length ? Math.round(average(periodLengths) as number) : null;
    const periodVariation = periodLengths.length > 1 ? Math.round(stddev(periodLengths) as number) : null;
    const ovulationDay = averageLength ? averageLength - 14 : null;
    const lutealPhase = 14;

    // Calculate symptom frequencies
    const symptomCounts: Record<string, number> = {};
    for (const sym of cycleData.symptoms || []) {
      symptomCounts[sym.type] = (symptomCounts[sym.type] || 0) + 1;
    }
    const totalCycles = periodLogs.length;
    const symptoms = Object.entries(symptomCounts).map(([name, count]) => ({
      name,
      frequency: totalCycles ? `${Math.round((count / totalCycles) * 100)}%` : '0%'
    }));

    res.json({
      averageLength,
      lengthVariation,
      periodLength,
      periodVariation,
      ovulationDay,
      lutealPhase,
      symptoms,
      message: "Analysis successful."
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analysis' });
  }
};
export const updateCycleLength = async (req: Request, res: Response) => {
  try {
    const { cycleLength } = req.body;
    if (!cycleLength || typeof cycleLength !== "number") {
      return res.status(400).json({ message: "Invalid cycle length" });
    }
    const cycleData = await CycleData.findOneAndUpdate(
      {},
      { $set: { cycleLength } },
      { new: true, upsert: true }
    );
    res.json(cycleData);
  } catch (error) {
    res.status(500).json({ message: "Error updating cycle length" });
  }
};