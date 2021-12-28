"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalizationSettingsContext = void 0;
exports.LocalizationSettingsProvider = LocalizationSettingsProvider;
exports.useLocalizationSettings = exports.USER_LOCALIZATION_SETTINGS_STORAGE_KEY = void 0;

var _react = _interopRequireDefault(require("react"));

var _expoLocalization = require("expo-localization");

var _expoLocation = require("expo-location");

var _asyncStorage = _interopRequireDefault(require("@react-native-async-storage/async-storage"));

var _axios = _interopRequireDefault(require("axios"));

var _getDateFormatPatternForLocale = require("./getDateFormatPatternForLocale");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LocalizationSettingsContext = /*#__PURE__*/_react.default.createContext({
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

exports.LocalizationSettingsContext = LocalizationSettingsContext;

const useLocalizationSettings = () => _react.default.useContext(LocalizationSettingsContext);

exports.useLocalizationSettings = useLocalizationSettings;
const USER_LOCALIZATION_SETTINGS_STORAGE_KEY = '@localization-settings';
exports.USER_LOCALIZATION_SETTINGS_STORAGE_KEY = USER_LOCALIZATION_SETTINGS_STORAGE_KEY;

function LocalizationSettingsProvider(_ref) {
  let {
    i18n,
    shouldUseLocation = false,
    children
  } = _ref;
  const userLocale = i18n !== null && i18n !== void 0 ? i18n : _expoLocalization.locale;

  const defaultSettings = _react.default.useMemo(() => ({
    coordinates: null,
    region: _expoLocalization.region,
    timezone: _expoLocalization.timezone,
    measurementSystem: _expoLocalization.isMetric ? 'metric' : 'imperial',
    distanceUnit: _expoLocalization.isMetric ? 'kilometer' : 'mile',
    temperatureUnit: _expoLocalization.isMetric ? 'celsius' : 'fahrenheit',
    timeFormat: _expoLocalization.isMetric ? '24hr' : '12hr',
    dateFormat: (0, _getDateFormatPatternForLocale.getDateFormatPatternForLocale)(userLocale),
    weekStartDay: _expoLocalization.isMetric ? 'monday' : 'sunday',
    currency: _expoLocalization.currency
  }), [userLocale]);

  const [isFetchingLocalizationSettings, setIsFetchingLocalizationSettings] = _react.default.useState(true);

  const [localizationSettingsError, setLocalizationSettingsError] = _react.default.useState(null);

  const [localizationSettings, setLocalizationSettings] = _react.default.useState(defaultSettings);

  const getLocation = _react.default.useCallback(async () => {
    try {
      const value = await _asyncStorage.default.getItem(USER_LOCALIZATION_SETTINGS_STORAGE_KEY);
      const storedSettings = typeof value === 'string' && JSON.parse(value);

      if (typeof storedSettings === 'object' && 'measurementSystem' in storedSettings) {
        setLocalizationSettings(defaultSettings);
      } else {
        let isoCountryCode;

        if (shouldUseLocation) {
          isoCountryCode = await (0, _expoLocation.requestForegroundPermissionsAsync)().then( /// @ts-ignore
          // TODO: typing broken in expo-location lib
          _ref2 => {
            let {
              granted
            } = _ref2;
            if (!granted) return;
            return (0, _expoLocation.getCurrentPositionAsync)({}).then(_ref3 => {
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
              return (0, _expoLocation.reverseGeocodeAsync)(coords).then(geocode => {
                var _geocode$0$isoCountry, _geocode$;

                return geocode ? (_geocode$0$isoCountry = (_geocode$ = geocode[0]) === null || _geocode$ === void 0 ? void 0 : _geocode$.isoCountryCode) !== null && _geocode$0$isoCountry !== void 0 ? _geocode$0$isoCountry : _expoLocalization.region : _expoLocalization.region;
              });
            });
          });
        }

        const countryData = await _axios.default.get(`https://iso-locale.vercel.app/api/v1/countries`).then(_ref4 => {
          let {
            data: {
              countries
            }
          } = _ref4;
          return countries.find(country => {
            var _ref5;

            return (_ref5 = country.cca2 === isoCountryCode) !== null && _ref5 !== void 0 ? _ref5 : _expoLocalization.region;
          });
        });

        if (countryData) {
          setLocalizationSettings(settings => {
            var _settings$coordinates, _isoCountryCode, _countryData$dateForm;

            return { ...settings,
              coordinates: (_settings$coordinates = settings.coordinates) !== null && _settings$coordinates !== void 0 ? _settings$coordinates : countryData.coordinates,
              region: (_isoCountryCode = isoCountryCode) !== null && _isoCountryCode !== void 0 ? _isoCountryCode : _expoLocalization.region,
              distanceUnit: countryData.distanceUnit,
              temperatureUnit: countryData.temperatureUnit,
              timeFormat: countryData.hourClock,
              dateFormat: (_countryData$dateForm = countryData.dateFormats[userLocale]) !== null && _countryData$dateForm !== void 0 ? _countryData$dateForm : (0, _getDateFormatPatternForLocale.getDateFormatPatternForLocale)(userLocale),
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

  _react.default.useEffect(() => {
    getLocation();
  }, [getLocation]);

  _react.default.useEffect(() => {
    (async () => {
      await _asyncStorage.default.setItem(USER_LOCALIZATION_SETTINGS_STORAGE_KEY, JSON.stringify(localizationSettings));
    })();
  }, [localizationSettings]);

  return /*#__PURE__*/_react.default.createElement(LocalizationSettingsContext.Provider, {
    value: {
      localizationSettings,
      isFetchingLocalizationSettings,
      localizationSettingsError,
      setLocalizationSettings
    }
  }, children);
}
//# sourceMappingURL=index.js.map