export interface BirthChartsTable {
  Row: {
    ascendant_degrees: number | null;
    ascendant_minutes: number | null;
    ascendant_sign: string | null;
    birth_date: string;
    birth_place: string | null;
    birth_time: string;
    created_at: string;
    id: string;
    latitude: number;
    longitude: number;
    moon_degrees: number | null;
    moon_minutes: number | null;
    moon_sign: string | null;
    name: string;
    sun_degrees: number | null;
    sun_minutes: number | null;
    sun_sign: string | null;
    system_used: string | null;
  };
  Insert: {
    ascendant_degrees?: number | null;
    ascendant_minutes?: number | null;
    ascendant_sign?: string | null;
    birth_date: string;
    birth_place?: string | null;
    birth_time: string;
    created_at?: string;
    id?: string;
    latitude: number;
    longitude: number;
    moon_degrees?: number | null;
    moon_minutes?: number | null;
    moon_sign?: string | null;
    name: string;
    sun_degrees?: number | null;
    sun_minutes?: number | null;
    sun_sign?: string | null;
    system_used?: string | null;
  };
  Update: {
    ascendant_degrees?: number | null;
    ascendant_minutes?: number | null;
    ascendant_sign?: string | null;
    birth_date?: string;
    birth_place?: string | null;
    birth_time?: string;
    created_at?: string;
    id?: string;
    latitude?: number;
    longitude?: number;
    moon_degrees?: number | null;
    moon_minutes?: number | null;
    moon_sign?: string | null;
    name?: string;
    sun_degrees?: number | null;
    sun_minutes?: number | null;
    sun_sign?: string | null;
    system_used?: string | null;
  };
  Relationships: [];
}