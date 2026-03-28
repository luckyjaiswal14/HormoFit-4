/**
 * HormoFit Prediction Engine
 * Logic for simulating future health trends based on current metrics and adherence.
 */

import { HealthState, HealthMetrics } from './healthEngine';

export interface PredictionPoint {
  day: number;
  weight: number;
  stability: number;
  symptomSeverity: number;
}

export const generatePredictions = (currentState: HealthState, metrics: HealthMetrics, days: number = 30): PredictionPoint[] => {
  const predictions: PredictionPoint[] = [];
  
  // Initial values
  let currentWeight = metrics.weight;
  let currentStability = currentState.hormonalStabilityScore;
  let currentSymptomSeverity = metrics.symptoms.length * 2;
  
  // Daily change rates based on adherence
  const adherenceFactor = (currentState.adherenceScore - 50) / 50; // -1 to 1
  
  // Weight change rate (kg per day)
  const weightChangeRate = adherenceFactor > 0 ? -0.05 * adherenceFactor : -0.02 * adherenceFactor;
  
  // Stability change rate (points per day)
  const stabilityChangeRate = 0.5 * adherenceFactor;
  
  // Symptom severity change rate (points per day)
  const symptomChangeRate = -0.1 * adherenceFactor;
  
  for (let i = 0; i <= days; i += 5) {
    predictions.push({
      day: i,
      weight: Math.max(40, currentWeight + weightChangeRate * i),
      stability: Math.min(100, Math.max(0, currentStability + stabilityChangeRate * i)),
      symptomSeverity: Math.min(20, Math.max(0, currentSymptomSeverity + symptomChangeRate * i)),
    });
  }
  
  return predictions;
};
