// src/components/Tracker/LogPeriod.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Calendar from '../Shared/Calendar';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { useCycleData } from '../../context/CycleContext';

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: center;
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

const FlowSelector = styled.div`
  display: flex;
  gap: 12px;
  margin: 24px 0;
  justify-content: center;
`;

const FlowOption = styled.button<{ selected: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid ${props => props.selected ? '#0057ff' : '#ccc'};
  background: ${props => props.selected ? '#e6f0ff' : 'white'};
  color: ${props => props.selected ? '#0057ff' : '#333'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #0057ff;
  }
`;

interface PeriodDay {
  date: Date;
  flow: 'light' | 'medium' | 'heavy';
}

const LogPeriod: React.FC = () => {
  const navigate = useNavigate();
  const { logPeriod } = useCycleData();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [periodDays, setPeriodDays] = useState<PeriodDay[]>([]);

  const handleDateClick = (date: Date) => {
    const dateExists = selectedDates.find(d => 
      format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    if (dateExists) {
      setSelectedDates(selectedDates.filter(d => 
        format(d, 'yyyy-MM-dd') !== format(date, 'yyyy-MM-dd')
      ));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleSave = async () => {
    if (selectedDates.length > 0) {
      const sorted = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
      await logPeriod(
        sorted[0].toISOString(),
        sorted[sorted.length - 1].toISOString(),
        selectedFlow
      );
      navigate('/tracker');
    }
  };

  const getTileClassName = ({ date }: { date: Date }): string => {
    return selectedDates.some(d => 
      format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ) ? 'period-day' : '';
  };

  return (
    <Container>
      <Header>
        <h2>Log Period</h2>
      </Header>

      <Calendar
        value={null}
        onChange={(date: Date) => handleDateClick(date)}
        tileClassName={getTileClassName}
      />

      <FlowSelector>
        <FlowOption 
          selected={selectedFlow === 'light'}
          onClick={() => setSelectedFlow('light')}
        >
          Light
        </FlowOption>
        <FlowOption 
          selected={selectedFlow === 'medium'}
          onClick={() => setSelectedFlow('medium')}
        >
          Medium
        </FlowOption>
        <FlowOption 
          selected={selectedFlow === 'heavy'}
          onClick={() => setSelectedFlow('heavy')}
        >
          Heavy
        </FlowOption>
      </FlowSelector>

      <ButtonGroup>
        <Button variant="secondary" onClick={() => navigate('/tracker')}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={selectedDates.length === 0}
        >
          Save
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default LogPeriod;