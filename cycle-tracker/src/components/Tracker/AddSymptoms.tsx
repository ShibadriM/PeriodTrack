// src/components/Tracker/AddSymptoms.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { cycleService } from "../../services/api"; 

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

const Stack = styled.div`
  display: flex;
  gap: 8px;
  margin: 12px 0 24px 0;
  flex-wrap: wrap;
`;

const Chip = styled.div`
  background: #e6f0ff;
  color: #0057ff;
  padding: 6px 16px;
  border-radius: 16px;
  font-weight: 500;
  font-size: 15px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  border-radius: 25px;
  border: none;
  background: ${props => props.active ? '#0057ff' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  white-space: nowrap;
`;

const SymptomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const SymptomCard = styled.button<{ selected: boolean }>`
  padding: 16px;
  border-radius: 12px;
  border: 2px solid ${props => props.selected ? '#0057ff' : '#ccc'};
  background: ${props => props.selected ? '#e6f0ff' : 'white'};
  color: ${props => props.selected ? '#0057ff' : '#333'};
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    border-color: #0057ff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' ? '#0057ff' : '#f0f0f0'};
  color: ${props => props.variant === 'primary' ? 'white' : '#333'};
  padding: 12px 24px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-weight: 500;
`;

interface Symptom {
  id: string;
  name: string;
  category: string;
}

const symptoms: Symptom[] = [
  // Mood
  { id: 'mood1', name: 'Happy', category: 'Mood' },
  { id: 'mood2', name: 'Sad', category: 'Mood' },
  { id: 'mood3', name: 'Anxious', category: 'Mood' },
  { id: 'mood4', name: 'Irritable', category: 'Mood' },
  // Physical
  { id: 'physical1', name: 'Cramps', category: 'Physical' },
  { id: 'physical2', name: 'Headache', category: 'Physical' },
  { id: 'physical3', name: 'Bloating', category: 'Physical' },
  { id: 'physical4', name: 'Breast tenderness', category: 'Physical' },
  // Energy
  { id: 'energy1', name: 'Energetic', category: 'Energy' },
  { id: 'energy2', name: 'Tired', category: 'Energy' },
  { id: 'energy3', name: 'Insomnia', category: 'Energy' },
  // Other
  { id: 'other1', name: 'Acne', category: 'Other' },
  { id: 'other2', name: 'Cravings', category: 'Other' },
  { id: 'other3', name: 'Nausea', category: 'Other' },
];

const AddSymptoms: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Mood');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [todaysSymptoms, setTodaysSymptoms] = useState<string[]>([]);
  const [fetching, setFetching] = useState(true);
  const [canLogToday, setCanLogToday] = useState<boolean>(false);

  const categories = ['Mood', 'Physical', 'Energy', 'Other'];

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const data = await cycleService.getCycleData();
        const today = new Date().toISOString().split("T")[0];
        const todays = (data.symptoms || []).filter(
          (s: any) => s.date && s.date.startsWith(today)
        );
        setTodaysSymptoms(todays.map((s: any) => s.type));
        // Check if today is within any period log
        const isWithinPeriod = (data.periodLogs || []).some(
          (log: any) =>
            today >= log.startDate.slice(0, 10) && today <= log.endDate.slice(0, 10)
        );
        setCanLogToday(isWithinPeriod);
      } catch (e) {
        setTodaysSymptoms([]);
        setCanLogToday(false);
      } finally {
        setFetching(false);
      }
    };
    fetchSymptoms();
  }, []);

  const toggleSymptom = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      if (!canLogToday) {
        setError("You can only log symptoms for days within a period.");
        setLoading(false);
        return;
      }
      for (const symptomId of selectedSymptoms) {
        const symptom = symptoms.find(s => s.id === symptomId);
        if (symptom) {
          await cycleService.logSymptoms({
            date: today,
            type: symptom.name,
            severity: 3 // You can add a UI for severity if needed
          });
        }
      }
      navigate('/tracker');
    } catch (err) {
      setError("Failed to save symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <h2>Add Symptoms</h2>
      </Header>

      <div>
  <strong>Today's Symptoms:</strong>
  {fetching ? (
    <div>Loading...</div>
  ) : todaysSymptoms.length > 0 ? (
    <Stack>
      {todaysSymptoms.map((symptom, idx) => (
        <Chip key={idx}>{symptom}</Chip>
      ))}
    </Stack>
  ) : null}
</div>

      <TabContainer>
        {categories.map(category => (
          <Tab
            key={category}
            active={activeTab === category}
            onClick={() => setActiveTab(category)}
          >
            {category}
          </Tab>
        ))}
      </TabContainer>

      <SymptomGrid>
        {symptoms
          .filter(symptom => symptom.category === activeTab)
          .map(symptom => (
            <SymptomCard
              key={symptom.id}
              selected={selectedSymptoms.includes(symptom.id)}
              onClick={() => toggleSymptom(symptom.id)}
            >
              {symptom.name}
            </SymptomCard>
          ))}
      </SymptomGrid>

      <ButtonGroup>
        <Button variant="secondary" onClick={() => navigate('/tracker')}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={loading || !canLogToday}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </ButtonGroup>
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
    </Container>
  );
};

export default AddSymptoms;