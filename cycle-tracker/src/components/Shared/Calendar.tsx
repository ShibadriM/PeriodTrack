import React, { MouseEvent } from 'react';
import ReactCalendar, { CalendarProps as ReactCalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import styled from 'styled-components';

interface CalendarProps extends Omit<ReactCalendarProps, 'onChange'> {
  value: Date | null;
  onChange: (date: Date) => void;
  tileContent?: ({ date }: { date: Date }) => React.ReactNode;
  tileClassName?: ({ date }: { date: Date }) => string;
}

const StyledCalendar = styled(ReactCalendar)`
  width: 100%;
  max-width: 400px;
  background: white;
  border: none;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .react-calendar__tile {
    padding: 16px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .react-calendar__tile--active {
    background: #e6f0ff;
    color: #0057ff;
  }

  .react-calendar__tile--now {
    background: #f0f0f0;
  }

  /* Add these stronger color styles */
  .period-day {
    background: #ffe6e6 !important;
  }

  .ovulation-day {
    background: #e6fff0 !important;
  }

  .fertile-day {
    background: #fff0e6 !important;
  }

  /* Style for dots */
  .dot-container {
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  tileContent,
  tileClassName,
  ...props
}) => {
  return (
    <StyledCalendar
      {...props}
      value={value}
      onChange={(value: Value, event: MouseEvent<HTMLButtonElement>) => {
        if (value instanceof Date) {
          onChange(value);
        }
      }}
      tileContent={tileContent}
      tileClassName={tileClassName}
    />
  );
};

export default Calendar;