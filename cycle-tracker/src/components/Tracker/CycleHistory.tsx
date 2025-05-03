// src/components/Tracker/CycleHistory.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { cycleService } from '../../services/api'; // Adjust path if needed

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

const CycleCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin: 12px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const Dot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 8px;
`;

const FlowIndicator = styled.div`
  display: flex;
  align-items: center;
`;

interface CycleEntry {
  startDate: string;
  endDate: string;
  length: number;
  flow: 'light' | 'medium' | 'heavy';
  symptoms: string[];
}

const CycleHistory: React.FC = () => {
  const navigate = useNavigate();
  const [cycles, setCycles] = useState<CycleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCycles = async () => {
      setLoading(true);
      try {
        // You should implement this endpoint in your backend!
        const data = await cycleService.getCycleHistory();
        setCycles(data);
      } catch (e) {
        setCycles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCycles();
  }, []);

  const getFlowColor = (flow: string) => {
    switch (flow) {
      case 'light': return '#ffe6e6';
      case 'medium': return '#ff9999';
      case 'heavy': return '#ff6666';
      default: return '#ffe6e6';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!cycles.length) return <div>No cycle history found.</div>;

  return (
    <Container>
      <Header>
        <h2>Cycle History</h2>
        <Button onClick={() => navigate('/tracker')}>
          Back to Tracker
        </Button>
      </Header>

      {cycles.map((cycle, index) => (
        <CycleCard key={index}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {cycle.length} days
            </div>
            <div style={{ color: '#666', marginTop: '4px' }}>
              {format(new Date(cycle.startDate), 'MMM d')} - {format(new Date(cycle.endDate), 'MMM d, yyyy')}
            </div>
            <div style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>
              Symptoms: {cycle.symptoms.join(', ')}
            </div>
          </div>
          <FlowIndicator>
            <Dot color={getFlowColor(cycle.flow)} />
            {cycle.flow} flow
          </FlowIndicator>
        </CycleCard>
      ))}
    </Container>
  );
};

export default CycleHistory;