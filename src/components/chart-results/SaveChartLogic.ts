import { BirthChartResult } from "../../utils/astro/types";
import { supabase } from "../../integrations/supabase/client";
import { User } from "@supabase/auth-helpers-react";
import { logger } from "../../lib/logger";
import { Interpretation } from "../../integrations/supabase/types/interpretations";

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ChartCache {
  private static generateKey(userId: string, data: BirthData): string {
    return `chart-${userId}-${data.birthDate}-${data.birthTime}-${data.birthPlace}`;
  }

  static get<T>(userId: string, data: BirthData): T | null {
    try {
      const key = this.generateKey(userId, data);
      const cached = localStorage.getItem(key);
      if (cached) {
        const { data: cachedData, timestamp }: CacheEntry<T> = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return cachedData;
        }
        localStorage.removeItem(key);
      }
    } catch (error) {
      logger.error("Cache read error", error);
    }
    return null;
  }

  static set<T>(userId: string, data: BirthData, value: T): void {
    try {
      const key = this.generateKey(userId, data);
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      logger.error("Cache write error", error);
    }
  }

  static invalidate(userId: string, data: BirthData): void {
    try {
      const key = this.generateKey(userId, data);
      localStorage.removeItem(key);
    } catch (error) {
      logger.error("Cache invalidation error", error);
    }
  }
}

class ValidationError extends Error {
  constructor(message: string, public readonly field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

async function getClientIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    logger.error("Failed to get client IP", error);
    return 'unknown';
  }
}

async function checkForDuplicateChart(
  userId: string | null, 
  ipAddress: string | null, 
  birthData: BirthData
): Promise<boolean> {
  const { data, error } = await supabase
    .from('birth_charts')
    .select('id')
    .match({
      birth_date: birthData.birthDate,
      birth_time: birthData.birthTime,
      birth_place: birthData.birthPlace,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      ...(userId ? { user_id: userId } : { ip_address: ipAddress })
    })
    .maybeSingle();

  if (error) {
    logger.error("Error checking for duplicate chart", error);
    return false;
  }

  return !!data;
}

interface BirthData {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
}

function validateBirthData(data: BirthData): void {
  if (!data.birthDate?.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new ValidationError('Invalid birth date format', 'birthDate');
  }
  
  if (!data.birthTime?.match(/^([01]\d|2[0-3]):[0-5]\d$/)) {
    throw new ValidationError('Invalid birth time format', 'birthTime');
  }
  
  if (!data.birthPlace?.trim()) {
    throw new ValidationError('Birth place is required', 'birthPlace');
  }
  
  if (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90) {
    throw new ValidationError('Invalid latitude', 'latitude');
  }
  
  if (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180) {
    throw new ValidationError('Invalid longitude', 'longitude');
  }
}

function validateChartResult(data: BirthChartResult): void {
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  if (!zodiacSigns.includes(data.sunSign)) {
    throw new ValidationError('Invalid sun sign', 'sunSign');
  }
  if (!zodiacSigns.includes(data.moonSign)) {
    throw new ValidationError('Invalid moon sign', 'moonSign');
  }
  if (!zodiacSigns.includes(data.risingSign)) {
    throw new ValidationError('Invalid rising sign', 'risingSign');
  }
  
  const validateDegrees = (deg: number, min: number, field: string) => {
    if (typeof deg !== 'number' || deg < 0 || deg >= 30) {
      throw new ValidationError(`Invalid degrees for ${field}`, field);
    }
    if (typeof min !== 'number' || min < 0 || min >= 60) {
      throw new ValidationError(`Invalid minutes for ${field}`, field);
    }
  };
  
  validateDegrees(data.sunDeg, data.sunMin, 'sun');
  validateDegrees(data.moonDeg, data.moonMin, 'moon');
  validateDegrees(data.risingDeg, data.risingMin, 'rising');
}

export interface ChartSaveResult {
  id?: string;
  chart: BirthChartResult;
  requiresSignup?: boolean;
}

export async function saveBirthChart(
  user: User | null,
  birthData: BirthData,
  mainWestern: BirthChartResult
): Promise<ChartSaveResult> {
  // Validate input data
  validateBirthData(birthData);
  validateChartResult(mainWestern);

  const ipAddress = !user?.id ? await getClientIp() : null;
  
  // Check for duplicate chart
  const isDuplicate = await checkForDuplicateChart(user?.id || null, ipAddress, birthData);
  if (isDuplicate) {
    throw new ValidationError('A birth chart with these exact details already exists', 'duplicate');
  }

  // For authenticated users, check cache first
  if (user?.id) {
    const cachedChart = ChartCache.get<ChartSaveResult>(user.id, birthData);
    if (cachedChart) {
      logger.info("Returning cached birth chart", { userId: user.id });
      return cachedChart;
    }
  }

  logger.info("Starting birth chart save process", { 
    isAuthenticated: !!user?.id,
    userId: user?.id,
    ipAddress: ipAddress
  });

  const { data: birthChartData, error: birthChartError } = await supabase
    .from('birth_charts')
    .insert({
      name: user?.id ? birthData.birthPlace.split(',')[0] : 'Anonymous',
      birth_date: birthData.birthDate,
      birth_time: birthData.birthTime,
      birth_place: birthData.birthPlace,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      sun_sign: mainWestern.sunSign,
      moon_sign: mainWestern.moonSign,
      ascendant_sign: mainWestern.risingSign,
      sun_degrees: mainWestern.sunDeg,
      sun_minutes: mainWestern.sunMin,
      moon_degrees: mainWestern.moonDeg,
      moon_minutes: mainWestern.moonMin,
      ascendant_degrees: mainWestern.risingDeg,
      ascendant_minutes: mainWestern.risingMin,
      user_id: user?.id || null,
      ip_address: ipAddress
    })
    .select('id')
    .single();

  if (birthChartError) {
    logger.error("Error storing birth chart", birthChartError);
    throw birthChartError;
  }

  logger.debug("Birth chart stored successfully", birthChartData);
  
  const result = {
    id: birthChartData.id,
    chart: mainWestern
  };

  // Cache the successful result
  if (user?.id) {
    ChartCache.set(user.id, birthData, result);
  }
  
  return result;
}

export interface InterpretationSaveResult {
  id?: string;
  content: string;
  requiresSignup?: boolean;
}

export async function saveInterpretation(
  birthChartId: string | null,
  userId: string | null,
  interpretation: string
): Promise<InterpretationSaveResult> {
  // Validate interpretation content
  if (!interpretation?.trim()) {
    throw new ValidationError('Interpretation content is required', 'interpretation');
  }
  if (interpretation.length > 10000) {
    throw new ValidationError('Interpretation content is too long (max 10000 chars)', 'interpretation');
  }

  // For unauthenticated users, return the interpretation without saving
  if (!userId || !birthChartId) {
    logger.info("Generating interpretation for unauthenticated user");
    return {
      content: interpretation,
      requiresSignup: true
    };
  }

  // Generate cache key based on chart ID and user ID
  const cacheKey = `interpretation-${userId}-${birthChartId}`;
  
  // Check cache first
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data: cachedData, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        logger.info("Returning cached interpretation", { birthChartId, userId });
        return cachedData;
      }
      localStorage.removeItem(cacheKey);
    }
  } catch (error) {
    logger.error("Cache read error", error);
  }

  logger.info("Starting interpretation save process for authenticated user", { birthChartId, userId });

  // Get the latest version for this birth chart
  const { data: existingData, error: versionError } = await supabase
    .from('interpretations')
    .select('id, version')
    .match({ birth_chart_id: birthChartId })
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle() as { 
      data: Pick<Interpretation, 'id' | 'version'> | null, 
      error: any 
    };

  if (versionError) {
    logger.error("Error fetching interpretation version", versionError);
    throw versionError;
  }

  const newVersion = (existingData?.version || 0) + 1;
  const previousVersionId = existingData?.id || null;

  const { data, error } = await supabase
    .from('interpretations')
    .insert({
      birth_chart_id: birthChartId,
      content: interpretation,
      user_id: userId,
      version: newVersion,
      previous_version_id: previousVersionId
    })
    .select('id')
    .single();

  if (error) {
    logger.error("Error saving interpretation", error);
    throw error;
  }

  logger.debug("Interpretation saved successfully", data);
  
  const result = {
    id: data.id,
    content: interpretation
  };

  // Cache the successful result
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      data: result,
      timestamp: Date.now()
    }));
  } catch (error) {
    logger.error("Cache write error", error);
  }

  return result;
}
