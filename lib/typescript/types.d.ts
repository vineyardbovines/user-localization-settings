export declare type TimeFormat = "12hr" | "24hr" | "mixed";
export declare type WeekStartDay = "friday" | "saturday" | "sunday" | "monday";
export declare type MeasurementSystem = "metric" | "imperial";
export declare type DistanceUnit = "kilometer" | "mile";
export declare type TemperatureUnit = "celsius" | "fahrenheit";
export declare type Country = {
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
export declare type UserLocalizationSettings = {
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
