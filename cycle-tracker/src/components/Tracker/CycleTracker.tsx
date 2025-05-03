import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addDays, differenceInDays } from 'date-fns';
import { useCycleData } from '../../context/CycleContext';
import { calculateCyclePhases, validateCycleLength } from '../../utils/cycleCalculations';

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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin: 24px 0;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' ? '#0057ff' : '#f0f0f0'};
  color: ${props => props.variant === 'primary' ? 'white' : '#333'};
  padding: 12px 24px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const PhaseIndicator = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
`;

const Phase = styled.div<{ active?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.active ? '#0057ff' : '#f0f0f0'};
  margin: 0 8px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: -12px;
    top: 50%;
    width: 16px;
    height: 2px;
    background: #f0f0f0;
  }

  &:last-child::after {
    display: none;
  }
`;

const WarningBanner = styled.div`
  background: #ffd700;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-weight: 500;
`;

const CycleTracker: React.FC = () => {
  const navigate = useNavigate();
  const { cycleData, loading } = useCycleData();
  const [nextPeriod, setNextPeriod] = useState<number>(0);
  const [nextOvulation, setNextOvulation] = useState<number>(0);
  const [currentPhase, setCurrentPhase] = useState<string>('menstrual');
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!cycleData) return;

    const { validation, phases } = calculateCyclePhases(
      cycleData.cycleLength,
      new Date(cycleData.lastPeriodStart)
    );
    
    // Show warning if cycle length is irregular
    if (!validation.isValid && validation.message) {
      setWarning(validation.message);
    }

    const today = new Date();
    const daysSinceStart = differenceInDays(today, cycleData.lastPeriodStart);
    
    // Determine current phase
    if (daysSinceStart <= cycleData.periodLength) {
      setCurrentPhase('menstrual');
    } else if (daysSinceStart <= phases.follicular.end) {
      setCurrentPhase('follicular');
    } else if (daysSinceStart <= phases.ovulation.end) {
      setCurrentPhase('ovulation');
    } else {
      setCurrentPhase('luteal');
    }

    // Calculate next period
    const nextPeriodDate = addDays(cycleData.lastPeriodStart, cycleData.cycleLength);
    const daysToNextPeriod = differenceInDays(nextPeriodDate, today);
    setNextPeriod(Math.max(0, daysToNextPeriod));

    // Calculate ovulation (based on reverse counting from next period)
    const ovulationDate = addDays(nextPeriodDate, -14); // Counting back from next period
    const daysToOvulation = differenceInDays(ovulationDate, today);
    setNextOvulation(Math.max(0, daysToOvulation));
  }, [cycleData]);

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      {warning && (
        <WarningBanner>
          {warning}
        </WarningBanner>
      )}
      <Header>
        <h2>Cycle Tracker</h2>
        <Button variant="primary" onClick={() => navigate('/month-view')}>
          Month View
        </Button>
      </Header>

      <PhaseIndicator>
        <Phase active={currentPhase === 'menstrual'} />
        <Phase active={currentPhase === 'follicular'} />
        <Phase active={currentPhase === 'ovulation'} />
        <Phase active={currentPhase === 'luteal'} />
      </PhaseIndicator>

      <CardGrid>
        <Card>
          <h3>Next Period in</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0057ff' }}>
            {nextPeriod} days
          </div>
          <Button variant="primary" onClick={() => navigate('/log-period')}>
            Log Period
          </Button>
        </Card>

        <Card>
          <h3>Next Ovulation in</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0057ff' }}>
            {nextOvulation} days
          </div>
        </Card>
      </CardGrid>

      <Card>
        <h3>Today's Symptoms</h3>
        <p>No symptoms logged for today</p>
        <Button variant="primary" onClick={() => navigate('/add-symptoms')}>
          Add Symptoms
        </Button>
      </Card>

      <CardGrid>
        <Button variant="primary" onClick={() => navigate('/analysis')}>
          View Analysis
        </Button>
        <Button variant="primary" onClick={() => navigate('/cycle-history')}>
          Cycle History
        </Button>
      </CardGrid>
    </Container>
  );
};

export default CycleTracker;