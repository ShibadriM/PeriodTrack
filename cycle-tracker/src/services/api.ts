const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/cycle-data';

export const cycleService = {
  async getCycleData() {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) throw new Error('Failed to fetch cycle data');
    return response.json();
  },

  async updateCycleLength({ cycleLength }: { cycleLength: number }) {
    const response = await fetch(`${API_BASE_URL}/update-cycle-length`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cycleLength }),
    });
    if (!response.ok) throw new Error("Failed to update cycle length");
    return response.json();
  },

  async logPeriod(data: { startDate: string; endDate: string; flow: string }) {
    const response = await fetch(`${API_BASE_URL}/log-period`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to log period');
    return response.json();
  },

  async logSymptoms(data: { date: string; type: string; severity: number }) {
    const response = await fetch(`${API_BASE_URL}/log-symptoms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to log symptoms');
    return response.json();
  },

  async getCycleAnalysis() {
    const response = await fetch(`${API_BASE_URL}/analysis`);
    if (!response.ok) throw new Error('Failed to fetch analysis');
    return response.json();
  },

  async getCycleHistory() {
    const response = await fetch(`${API_BASE_URL}/history`);
    if (!response.ok) throw new Error('Failed to fetch cycle history');
    return response.json();
  }
};
