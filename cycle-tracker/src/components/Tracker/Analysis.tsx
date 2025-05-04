// src/components/Tracker/Analysis.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format, addDays } from 'date-fns';
import { cycleService } from '../../services/api'; // Adjust path if needed
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Container = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin: 12px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 24px 0;
`;

const Stat = styled.div`
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;

  h3 {
    margin: 0;
    color: #666;
    font-size: 14px;
  }

  p {
    margin: 8px 0 0;
    font-size: 24px;
    font-weight: bold;
    color: #0057ff;
  }
`;

const Button = styled.button`
  background: #0057ff;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-weight: 500;
`;

const Chart = styled.div`
  height: 200px;
  margin: 24px 0;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
`;

interface CycleStats {
  averageLength: number;
  lengthVariation: number;
  periodLength: number;
  periodVariation: number;
  ovulationDay: number;
  lutealPhase: number;
  symptoms: { name: string; frequency: string }[];
}

const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<CycleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await cycleService.getCycleAnalysis();
        setStats(data);
        const hist = await cycleService.getCycleHistory();
        setHistory(hist);
      } catch (e) {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Prepare cycle length data for the chart
  // Sort history by startDate ascending
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const cycleLengthData = [];
  for (let i = 1; i < sortedHistory.length; i++) {
    const prev = new Date(sortedHistory[i - 1].startDate);
    const curr = new Date(sortedHistory[i].startDate);
    const length = Math.ceil((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    cycleLengthData.push({
      cycle: i,
      length,
      start: sortedHistory[i].startDate
    });
  }

  if (loading) return <div>Loading...</div>;
  if (!stats) return <div>No analysis data found.</div>;

  return (
    <Container>
      <Header>
        <h2>Cycle Analysis</h2>
        <Button onClick={() => navigate('/tracker')}>
          Back to Tracker
        </Button>
      </Header>

      <Card>
        <h3>Cycle Statistics</h3>
        <StatGrid>
          <Stat>
            <h3>Average Cycle Length</h3>
            <p>{stats.averageLength} days</p>
          </Stat>
          <Stat>
            <h3>Length Variation</h3>
            <p>±{stats.lengthVariation} days</p>
          </Stat>
          <Stat>
            <h3>Average Period Length</h3>
            <p>{stats.periodLength} days</p>
          </Stat>
          <Stat>
            <h3>Period Variation</h3>
            <p>±{stats.periodVariation} days</p>
          </Stat>
        </StatGrid>
      </Card>

      <Card>
        <h3>Cycle Length Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={cycleLengthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cycle" label={{ value: 'Cycle', position: 'insideBottomRight', offset: 0 }} />
            <YAxis label={{ value: 'Length (days)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="length" stroke="#0057ff" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3>Common Symptoms</h3>
        {stats.symptoms.map(symptom => (
          <div key={symptom.name} style={{ margin: '12px 0' }}>
            <strong>{symptom.name}</strong>: {symptom.frequency} of cycles
          </div>
        ))}
      </Card>
    </Container>
  );
};

export default Analysis;