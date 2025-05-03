interface CycleValidation {
  isValid: boolean;
  message?: string;
}

export const validateCycleLength = (length: number): CycleValidation => {
  if (length < 21) {
    return {
      isValid: false,
      message: "Cycles shorter than 21 days may indicate irregular periods. Consider consulting a healthcare provider."
    };
  }
  if (length > 35) {
    return {
      isValid: false,
      message: "Cycles longer than 35 days may indicate irregular periods. Consider consulting a healthcare provider."
    };
  }
  return { isValid: true };
};

export const calculateCyclePhases = (cycleLength: number, lastPeriodStart: Date) => {
  // Validate cycle length
  const validation = validateCycleLength(cycleLength);
  
  // Constants based on medical research
  const LUTEAL_PHASE_LENGTH = 14; // days
  const MIN_PERIOD_LENGTH = 3;
  const MAX_PERIOD_LENGTH = 7;

  // Calculate phases
  const follicularPhaseLength = cycleLength - LUTEAL_PHASE_LENGTH;
  
  return {
    validation,
    phases: {
      menstrual: {
        start: 1,
        end: MAX_PERIOD_LENGTH,
        adjustable: true // User can adjust actual period length
      },
      follicular: {
        start: MAX_PERIOD_LENGTH + 1,
        end: follicularPhaseLength,
        adjustable: false
      },
      ovulation: {
        start: follicularPhaseLength,
        end: follicularPhaseLength + 2,
        adjustable: false
      },
      luteal: {
        start: follicularPhaseLength + 3,
        end: cycleLength,
        adjustable: false
      }
    },
    fertile: {
      start: follicularPhaseLength - 3, // 3 days before ovulation
      end: follicularPhaseLength + 2    // 2 days after ovulation
    }
  };
};
