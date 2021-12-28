# user-localization-settings

User localization settings for React Native.

## Installation

```sh
// with expo
expo install user-localization-settings
// with yarn
yarn add user-localization-settings
// with npm
npm install --save user-localization-settings
```

## Usage

This library uses the [ISO locale api](hhttps://iso-locale.vercel.app/api/v1/countries) along with [expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/) under the hood for default settings, and [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) for getting hyper-local settings (optional).

```tsx
import {
  useLocalizationSettings,
  LocalizationSettingsProvider,
} from 'user-localization-settings';

function Component() {
  const {
    isFetchingLocalizationSettings,
    localizationSettingsError,
    localizationSettings,
    setLocalizationSettings,
  } = useLocalizationSettings();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isFetchingLocalizationSettings ? (
        <ActivityIndicator />
      ) : localizationError : (
        <Text>Something went wrong.</Text>
      ) : (
        <Button
          onPress={() =>
            setLocalizationSettings({
              ...localizationSettings,
              temperatureUnit:
                localizationSettings.temperatureUnit === 'celsius'
                  ? 'fahrenheit'
                  : 'celsius',
            })
          }
        >
          <Text>Temperature Unit: {localizationSettings.temperatureUnit}</Text>
        </Button>
      )}
    </View>
  );
}

function App() {
  return (
    <LocalizationSettingsProvider>
      <Component />
    </LocalizationSettingsProvider>
  );
}
```

Settings are automatically persisted to [AsyncStorage](https://github.com/react-native-async-storage/async-storage) under the exported storage key `USER_LOCALIZATION_SETTINGS_STORAGE_KEY`.

### `<LocalizationSettingsProvider />`

The context provider that handles user settings.

| Parameter           | Type      | Description                                                                                                                                          | Default |
| ------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| i18n                | `string`  | An i18n locale code to pass (if using react-i18next, etc.) Used to look up different formats based on locale.                                        | `null`  |
| `shouldUseLocation` | `boolean` | Whether or not to use the user's location to get hyper-local localization defaults. This will prompt the user for permission if not already granted. | `false` |

### `useLocalizationSettings()`

A hook that provides the context values.

```tsx
export type LocalizationSettingsContext = {
  isFetchingLocalizationSettings: boolean;
  localizationSettingsError: Error | null;
  localizationSettings: LocalizationSettings;
  setLocalizationSettings: (e: LocalizationSettings) => void;
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

export type TimeFormat = '12hr' | '24hr' | 'mixed';

export type WeekStartDay = 'friday' | 'saturday' | 'sunday' | 'monday';

export type MeasurementSystem = 'metric' | 'imperial';

export type DistanceUnit = 'kilometer' | 'mile';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

[MIT](./LICENSE)
