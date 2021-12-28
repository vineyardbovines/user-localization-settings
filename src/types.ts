export type TimeFormat = '12hr' | '24hr' | 'mixed';

export type WeekStartDay = 'friday' | 'saturday' | 'sunday' | 'monday';

export type MeasurementSystem = 'metric' | 'imperial';

export type DistanceUnit = 'kilometer' | 'mile';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type Country = {
  cca2: string;
  hourClock: TimeFormat;
  dateFormats: Record<string, string>;
  weekStartDay: WeekStartDay;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  measurementSystem: MeasurementSystem;
  distanceUnit: DistanceUnit;
  temperatureUnit: TemperatureUnit;
};

export type LocalizationSettings = {
  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
  region: string | null;
  timezone: string | null;
  measurementSystem: MeasurementSystem | null;
  distanceUnit: DistanceUnit | null;
  temperatureUnit: TemperatureUnit | null;
  timeFormat: TimeFormat | null;
  dateFormat: string | null;
  weekStartDay: WeekStartDay | null;
  currency: string | null;
};
