import React from 'react';
import type { LocalizationSettings } from './types';
export declare type LocalizationSettingsContextType = {
    isFetchingLocalizationSettings: boolean;
    localizationSettingsError: unknown | Error | null;
    localizationSettings: LocalizationSettings;
    setLocalizationSettings: (e: LocalizationSettings) => void;
};
export declare const LocalizationSettingsContext: React.Context<LocalizationSettingsContextType>;
export declare const useLocalizationSettings: () => LocalizationSettingsContextType;
export declare type LocalizationSettingsProviderProps = {
    i18n?: string | null;
    shouldUseLocation?: boolean;
    children: React.ReactNode;
};
export declare const USER_LOCALIZATION_SETTINGS_STORAGE_KEY = "@localization-settings";
export declare function LocalizationSettingsProvider({ i18n, shouldUseLocation, children, }: LocalizationSettingsProviderProps): React.ReactElement;
