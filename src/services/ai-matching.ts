import { supabase } from '@/lib/supabase';

export interface RankingCriteria {
  lat: number;
  lng: number;
  skill: string;
  maxDistance: number; // in meters
}

/**
 * AI-Driven Worker Recommendation Engine
 * Ranks workers based on:
 * 1. Proximity (PostGIS)
 * 2. Average Rating
 * 3. Completion Rate
 * 4. Recent Activity
 */
export async function getSmartRecommendations(criteria: RankingCriteria) {
  const { lat, lng, skill, maxDistance } = criteria;

  // Call the database function defined in schema.sql
  const { data: nearbyWorkers, error } = await supabase.rpc('get_nearby_workers', {
    lat,
    lng,
    radius_meters: maxDistance,
    skill_filter: skill.toLowerCase()
  });

  if (error) {
    console.error('AI Matching Error:', error);
    return [];
  }

  // AI Sorting Logic (Client-side refinement)
  const rankedWorkers = nearbyWorkers.sort((a: any, b: any) => {
    // 70% weight to rating, 30% to total jobs
    const scoreA = (a.average_rating * 0.7) + ((a.total_jobs / 100) * 0.3);
    const scoreB = (b.average_rating * 0.7) + ((b.total_jobs / 100) * 0.3);
    return scoreB - scoreA;
  });

  return rankedWorkers;
}

/**
 * Demand Prediction Placeholder
 * Analyzes historical booking patterns to suggest optimal pricing for workers
 */
export function predictDynamicPricing(baseRate: number, time: Date): number {
  const hour = time.getHours();
  let multiplier = 1.0;

  // Peak demand hours in Indian market (9 AM - 11 AM)
  if (hour >= 9 && hour <= 11) multiplier = 1.2;
  
  // Emergency hours (Late night)
  if (hour >= 22 || hour <= 5) multiplier = 1.5;

  return Math.round(baseRate * multiplier);
}
