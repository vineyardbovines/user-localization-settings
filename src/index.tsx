import React from 'react';
import {
  isMetric,
  locale,
  region,
  timezone,
  currency,
} from 'expo-localization';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  reverseGeocodeAsync,
} from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';
import { getDateFormatPatternForLocale } from './getDateFormatPatternForLocale';
import type { Country, LocalizationSettings } from './types';

export type LocalizationSettingsContextType = {
  isFetchingLocalizationSettings: boolean;
  localizationSettingsError: unknown | Error | null;
  localizationSettings: LocalizationSettings;
  setLocalizationSettings: (e: LocalizationSettings) => void;
};

export const LocalizationSettingsContext =
  React.createContext<LocalizationSettingsContextType>({
    isFetchingLocalizationSettings: false,
    localizationSettingsError: null,
    localizationSettings: {
      coordinates: null,
      timezone: null,
      region: null,
      measurementSystem: null,
      distanceUnit: null,
      temperatureUnit: null,
      timeFormat: null,
      dateFormat: null,
      weekStartDay: null,
      currency: null,
    },
    setLocalizationSettings: () =>
      console.warn('UserLocalizationSettings: Provider not set'),
  });

export const useLocalizationSettings = (): LocalizationSettingsContextType =>
  React.useContext(LocalizationSettingsContext);

export type LocalizationSettingsProviderProps = {
  i18n?: string | null;
  shouldUseLocation?: boolean;
  children: React.ReactNode;
};

export const USER_LOCALIZATION_SETTINGS_STORAGE_KEY = '@localization-settings';

export function LocalizationSettingsProvider({
  i18n,
  shouldUseLocation = false,
  children,
}: LocalizationSettingsProviderProps): React.ReactElement {
  const userLocale: string = i18n ?? locale;

  const defaultSettings = React.useMemo(
    (): LocalizationSettings => ({
      coordinates: null,
      region: region,
      timezone: timezone,
      measurementSystem: isMetric ? 'metric' : 'imperial',
      distanceUnit: isMetric ? 'kilometer' : 'mile',
      temperatureUnit: isMetric ? 'celsius' : 'fahrenheit',
      timeFormat: isMetric ? '24hr' : '12hr',
      dateFormat: getDateFormatPatternForLocale(userLocale),
      weekStartDay: isMetric ? 'monday' : 'sunday',
      currency: currency,
    }),
    [userLocale]
  );

  const [isFetchingLocalizationSettings, setIsFetchingLocalizationSettings] =
    React.useState<boolean>(true);
  const [localizationSettingsError, setLocalizationSettingsError] =
    React.useState<unknown | null>(null);
  const [localizationSettings, setLocalizationSettings] =
    React.useState<LocalizationSettings>(defaultSettings);

  const getLocation = React.useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(
        USER_LOCALIZATION_SETTINGS_STORAGE_KEY
      );

      const storedSettings = typeof value === 'string' && JSON.parse(value);

      if (
        typeof storedSettings === 'object' &&
        'measurementSystem' in storedSettings
      ) {
        setLocalizationSettings(defaultSettings);
      } else {
        let isoCountryCode: string | null | undefined;

        if (shouldUseLocation) {
          isoCountryCode = await requestForegroundPermissionsAsync().then(
            /// @ts-ignore
            // TODO: typing broken in expo-location lib
            ({ granted }) => {
              if (!granted) return;

              return getCurrentPositionAsync({}).then(({ coords }) => {
                if (!coords) return;

                const { latitude, longitude } = coords;

                setLocalizationSettings((settings) => ({
                  ...settings,
                  coordinates: {
                    latitude,
                    longitude,
                  },
                }));

                return reverseGeocodeAsync(coords).then((geocode) =>
                  geocode ? geocode[0]?.isoCountryCode ?? region : region
                );
              });
            }
          );
        }

        const countryData = await axios
          .get(`https://iso-locale.vercel.app/api/v1/countries`)
          .then(
            ({
              data: { countries },
            }: AxiosResponse<{ countries: Country[] }>): Country | undefined =>
              countries.find(
                (country: Country) => country.cca2 === isoCountryCode ?? region
              )
          );

        if (countryData) {
          setLocalizationSettings((settings) => ({
            ...settings,
            coordinates: settings.coordinates ?? countryData.coordinates,
            region: isoCountryCode ?? region,
            distanceUnit: countryData.distanceUnit,
            temperatureUnit: countryData.temperatureUnit,
            timeFormat: countryData.hourClock,
            dateFormat:
              countryData.dateFormats[userLocale] ??
              getDateFormatPatternForLocale(userLocale),
            weekStartDay: countryData.weekStartDay,
          }));
        }
      }
    } catch (err) {
      setLocalizationSettingsError(err);
      if (__DEV__) {
        console.error(err);
      }
    } finally {
      setIsFetchingLocalizationSettings(false);
    }
  }, [shouldUseLocation, userLocale, defaultSettings]);

  React.useEffect(() => {
    getLocation();
  }, [getLocation]);

  React.useEffect(() => {
    (async () => {
      await AsyncStorage.setItem(
        USER_LOCALIZATION_SETTINGS_STORAGE_KEY,
        JSON.stringify(localizationSettings)
      );
    })();
  }, [localizationSettings]);

  return (
    <LocalizationSettingsContext.Provider
      value={{
        localizationSettings,
        isFetchingLocalizationSettings,
        localizationSettingsError,
        setLocalizationSettings,
      }}
    >
      {children}
    </LocalizationSettingsContext.Provider>
  );
}
