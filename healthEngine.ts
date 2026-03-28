/**
 * HormoFit Health Engine
 * Logic for simulating hormonal health and predicting future trends.
 */

export interface HealthMetrics {
  weight: number;
  height: number; // in cm
  sugarIntake: 'low' | 'medium' | 'high';
  exerciseLevel: 'none' | 'low' | 'moderate' | 'high';
  stressLevel: number; // 1-10
  cycleDeviation: number; // days from average
  sleepHours: number;
  symptoms: string[];
}

export interface HealthState {
  bmi: number;
  insulinResistanceScore: number;
  cycleRegularityScore: number;
  stressScore: number;
  inflammationIndex: number;
  adherenceScore: number;
  hormonalStabilityScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const updateHealthState = (metrics: HealthMetrics): HealthState => {
  const bmi = calculateBMI(metrics.weight, metrics.height);
  
  // Insulin Resistance Approximation
  let insulinScore = 0;
  if (bmi > 25) insulinScore += 2;
  if (metrics.sugarIntake === 'high') insulinScore += 3;
  if (metrics.sugarIntake === 'medium') insulinScore += 1;
  if (metrics.exerciseLevel === 'none') insulinScore += 2;
  if (metrics.exerciseLevel === 'low') insulinScore += 1;
  
  // Cycle Regularity Score (0-10, 10 is best)
  let cycleScore = 10;
  if (Math.abs(metrics.cycleDeviation) > 5) cycleScore -= 3;
  if (Math.abs(metrics.cycleDeviation) > 10) cycleScore -= 4;
  
  // Stress Score (0-10, 0 is best)
  const stressScore = metrics.stressLevel;
  
  // Inflammation Index (0-10)
  let inflammation = 0;
  if (bmi > 30) inflammation += 3;
  if (metrics.sugarIntake === 'high') inflammation += 2;
  if (metrics.sleepHours < 6) inflammation += 2;
  if (metrics.symptoms.length > 3) inflammation += 2;
  
  // Adherence Score (0-100)
  let adherence = 0;
  if (metrics.exerciseLevel !== 'none') adherence += 40;
  if (metrics.sugarIntake !== 'high') adherence += 40;
  if (metrics.sleepHours >= 7) adherence += 20;
  
  // Hormonal Stability Score (0-100)
  const stability = Math.max(0, 100 - (insulinScore * 5 + (10 - cycleScore) * 5 + stressScore * 2 + inflammation * 2));
  
  // Risk Level
  let risk: 'Low' | 'Medium' | 'High' = 'Low';
  if (stability < 40 || insulinScore > 7) risk = 'High';
  else if (stability < 70 || insulinScore > 4) risk = 'Medium';
  
  return {
    bmi,
    insulinResistanceScore: Math.min(10, insulinScore),
    cycleRegularityScore: Math.max(0, cycleScore),
    stressScore,
    inflammationIndex: Math.min(10, inflammation),
    adherenceScore: adherence,
    hormonalStabilityScore: stability,
    riskLevel: risk,
  };
};

export const simulateFutureTrends = (currentState: HealthState, days: number = 30) => {
  // Simple linear prediction based on adherence
  const weightChange = (currentState.adherenceScore > 70 ? -0.5 : currentState.adherenceScore < 40 ? 0.3 : 0) * (days / 7);
  const stabilityChange = (currentState.adherenceScore - 50) / 10;
  
  return {
    predictedWeight: currentState.bmi * (1.7 * 1.7) + weightChange, // rough estimate
    predictedStability: Math.min(100, Math.max(0, currentState.hormonalStabilityScore + stabilityChange)),
  };
};
