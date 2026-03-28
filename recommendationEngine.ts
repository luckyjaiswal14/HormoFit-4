/**
 * HormoFit Recommendation Engine
 * Rules for generating personalized lifestyle, nutrition, and mental health advice.
 */

import { HealthState, HealthMetrics } from './healthEngine';

export interface Recommendation {
  category: 'Nutrition' | 'Lifestyle' | 'Mental Health' | 'Medical';
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
}

export const getRecommendations = (state: HealthState, metrics: HealthMetrics): Recommendation[] => {
  const recommendations: Recommendation[] = [];

  // Nutrition Rules
  if (state.insulinResistanceScore > 6 || metrics.sugarIntake === 'high') {
    recommendations.push({
      category: 'Nutrition',
      title: 'Low GI Diet',
      description: 'Switch to low glycemic index foods to stabilize insulin levels. Focus on whole grains, legumes, and non-starchy vegetables.',
      priority: 'High',
    });
  }

  if (state.inflammationIndex > 5) {
    recommendations.push({
      category: 'Nutrition',
      title: 'Anti-Inflammatory Foods',
      description: 'Increase intake of omega-3 fatty acids (flaxseeds, walnuts) and antioxidants (berries, turmeric) to reduce systemic inflammation.',
      priority: 'Medium',
    });
  }

  // Lifestyle Rules
  if (metrics.exerciseLevel === 'none' || metrics.exerciseLevel === 'low') {
    recommendations.push({
      category: 'Lifestyle',
      title: 'Strength Training',
      description: 'Incorporate at least 30 minutes of strength training 3 times a week to improve insulin sensitivity and metabolic health.',
      priority: 'High',
    });
  }

  if (metrics.sleepHours < 7) {
    recommendations.push({
      category: 'Lifestyle',
      title: 'Sleep Hygiene',
      description: 'Aim for 7-9 hours of quality sleep. Poor sleep disrupts hormonal balance and increases cravings for sugary foods.',
      priority: 'Medium',
    });
  }

  // Mental Health Rules
  if (state.stressScore > 7) {
    recommendations.push({
      category: 'Mental Health',
      title: 'Daily Mindfulness',
      description: 'Practice 10-15 minutes of meditation or deep breathing exercises daily to lower cortisol levels, which can exacerbate PCOD symptoms.',
      priority: 'High',
    });
  }

  // Medical Rules
  if (state.riskLevel === 'High' || Math.abs(metrics.cycleDeviation) > 15) {
    recommendations.push({
      category: 'Medical',
      title: 'Consult a Specialist',
      description: 'Your current hormonal stability score is low. We recommend consulting an endocrinologist or gynecologist for a detailed evaluation.',
      priority: 'High',
    });
  }

  return recommendations;
};
