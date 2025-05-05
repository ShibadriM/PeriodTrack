import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Calendar from '../Shared/Calendar';
import { isSameDay, addDays } from 'date-fns';
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

const Legend = styled.div`
  display: flex;
  gap: 16px;
  margin: 24px 0;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
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

interface CalendarDay {
  date: Date;
  type: 'period' | 'ovulation' | 'fertile';
}

interface CycleData {
  lastPeriodStart: string;
  cycleLength: number;
  periodLength: number;
}

const MonthView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hasInitialized, setHasInitialized] = useState(false);
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await cycleService.getCycleData();
        setCycleData(data);
      } catch (e) {
        setCycleData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Automatically select the last period start date as the visible calendar date
  useEffect(() => {
    if (cycleData?.lastPeriodStart && !hasInitialized) {
      const startDate = new Date(cycleData.lastPeriodStart);
      setSelectedDate(startDate);
      setHasInitialized(true);
    }
  }, [cycleData, hasInitialized]);

  useEffect(() => {
    if (!cycleData) return;

    const days: CalendarDay[] = [];
    const currentDate = new Date(cycleData.lastPeriodStart);

    // Add period days
    for (let i = 0; i < cycleData.periodLength; i++) {
      days.push({
        date: addDays(currentDate, i),
        type: 'period'
      });
    }

    // Ovulation day
    const ovulationDay = Math.round(cycleData.cycleLength * 0.6);
    const ovulationDate = addDays(currentDate, ovulationDay);
    days.push({ date: ovulationDate, type: 'ovulation' });

    // Fertile window
    const fertileWindowStart = Math.max(ovulationDay - 3, cycleData.periodLength);
    const fertileWindowEnd = Math.min(ovulationDay + 2, cycleData.cycleLength - 1);

    for (let i = fertileWindowStart; i <= fertileWindowEnd; i++) {
      if (i === ovulationDay) continue;
      days.push({ date: addDays(currentDate, i), type: 'fertile' });
    }

    setCalendarDays(days);
  }, [cycleData]);

  const getTileClassName = ({ date }: { date: Date }): string => {
    const day = calendarDays.find(d => isSameDay(d.date, date));
    return day ? `${day.type}-day` : '';
  };

  const getTileContent = ({ date }: { date: Date }) => {
    const day = calendarDays.find(d => isSameDay(d.date, date));
    if (!day) return null;

    return (
      <div className="dot-container">
        <Dot
          color={
            day.type === 'period'
              ? '#ff9999'
              : day.type === 'ovulation'
              ? '#66cc99'
              : '#ffcc99'
          }
        />
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (!cycleData) return <div>No cycle data found.</div>;

  return (
    <Container>
      <Header>
        <h2>Month View</h2>
        <Button onClick={() => navigate('/tracker')}>
          Back to Tracker
        </Button>
      </Header>

      <Calendar
        value={selectedDate}
        onChange={(date: Date) => setSelectedDate(date)}
        tileClassName={getTileClassName}
        tileContent={getTileContent}
      />

      <Legend>
        <LegendItem>
          <Dot color="#ff9999" />
          <span>Period</span>
        </LegendItem>
        <LegendItem>
          <Dot color="#66cc99" />
          <span>Ovulation</span>
        </LegendItem>
        <LegendItem>
          <Dot color="#ffcc99" />
          <span>Fertile Window</span>
        </LegendItem>
      </Legend>
    </Container>
  );
};

export default MonthView;
