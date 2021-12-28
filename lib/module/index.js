import React from 'react';
import { isMetric, locale, region, timezone, currency } from 'expo-localization';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync, reverseGeocodeAsync } from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getDateFormatPatternForLocale } from './getDateFormatPatternForLocale';
export const LocalizationSettingsContext = /*#__PURE__*/React.createContext({
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
    currency: null
  },
  setLocalizationSettings: () => console.warn('UserLocalizationSettings: Provider not set')
});
export const useLocalizationSettings = () => React.useContext(LocalizationSettingsContext);
export const USER_LOCALIZATION_SETTINGS_STORAGE_KEY = '@localization-settings';
export function LocalizationSettingsProvider(_ref) {
  let {
    i18n,
    shouldUseLocation = false,
    children
  } = _ref;
  const userLocale = i18n !== null && i18n !== void 0 ? i18n : locale;
  const defaultSettings = React.useMemo(() => ({
    coordinates: null,
    region: region,
    timezone: timezone,
    measurementSystem: isMetric ? 'metric' : 'imperial',
    distanceUnit: isMetric ? 'kilometer' : 'mile',
    temperatureUnit: isMetric ? 'celsius' : 'fahrenheit',
    timeFormat: isMetric ? '24hr' : '12hr',
    dateFormat: getDateFormatPatternForLocale(userLocale),
    weekStartDay: isMetric ? 'monday' : 'sunday',
    currency: currency
  }), [userLocale]);
  const [isFetchingLocalizationSettings, setIsFetchingLocalizationSettings] = React.useState(true);
  const [localizationSettingsError, setLocalizationSettingsError] = React.useState(null);
  const [localizationSettings, setLocalizationSettings] = React.useState(defaultSettings);
  const getLocation = React.useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(USER_LOCALIZATION_SETTINGS_STORAGE_KEY);
      const storedSettings = typeof value === 'string' && JSON.parse(value);

      if (typeof storedSettings === 'object' && 'measurementSystem' in storedSettings) {
        setLocalizationSettings(defaultSettings);
      } else {
        let isoCountryCode;

        if (shouldUseLocation) {
          isoCountryCode = await requestForegroundPermissionsAsync().then( /// @ts-ignore
          // TODO: typing broken in expo-location lib
          _ref2 => {
            let {
              granted
            } = _ref2;
            if (!granted) return;
            return getCurrentPositionAsync({}).then(_ref3 => {
              let {
                coords
              } = _ref3;
              if (!coords) return;
              const {
                latitude,
                longitude
              } = coords;
              setLocalizationSettings(settings => ({ ...settings,
                coordinates: {
                  latitude,
                  longitude
                }
              }));
              return reverseGeocodeAsync(coords).then(geocode => {
                var _geocode$0$isoCountry, _geocode$;

                return geocode ? (_geocode$0$isoCountry = (_geocode$ = geocode[0]) === null || _geocode$ === void 0 ? void 0 : _geocode$.isoCountryCode) !== null && _geocode$0$isoCountry !== void 0 ? _geocode$0$isoCountry : region : region;
              });
            });
          });
        }

        const countryData = await axios.get(`https://iso-locale.vercel.app/api/v1/countries`).then(_ref4 => {
          let {
            data: {
              countries
            }
          } = _ref4;
          return countries.find(country => {
            var _ref5;

            return (_ref5 = country.cca2 === isoCountryCode) !== null && _ref5 !== void 0 ? _ref5 : region;
          });
        });

        if (countryData) {
          setLocalizationSettings(settings => {
            var _settings$coordinates, _isoCountryCode, _countryData$dateForm;

            return { ...settings,
              coordinates: (_settings$coordinates = settings.coordinates) !== null && _settings$coordinates !== void 0 ? _settings$coordinates : countryData.coordinates,
              region: (_isoCountryCode = isoCountryCode) !== null && _isoCountryCode !== void 0 ? _isoCountryCode : region,
              distanceUnit: countryData.distanceUnit,
              temperatureUnit: countryData.temperatureUnit,
              timeFormat: countryData.hourClock,
              dateFormat: (_countryData$dateForm = countryData.dateFormats[userLocale]) !== null && _countryData$dateForm !== void 0 ? _countryData$dateForm : getDateFormatPatternForLocale(userLocale),
              weekStartDay: countryData.weekStartDay
            };
          });
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
      await AsyncStorage.setItem(USER_LOCALIZATION_SETTINGS_STORAGE_KEY, JSON.stringify(localizationSettings));
    })();
  }, [localizationSettings]);
  return /*#__PURE__*/React.createElement(LocalizationSettingsContext.Provider, {
    value: {
      localizationSettings,
      isFetchingLocalizationSettings,
      localizationSettingsError,
      setLocalizationSettings
    }
  }, children);
}
//# sourceMappingURL=index.js.map