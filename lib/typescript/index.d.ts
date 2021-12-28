import React from "react";
import type { UserLocalizationSettings } from "./types";
export declare type UserLocalizationSettingsContextType = {
    isFetchingLocalizationSettings: boolean;
    localizationSettingsError: unknown | Error | null;
    localizationSettings: UserLocalizationSettings;
    setLocalizationSettings: (e: UserLocalizationSettings) => void;
};
export declare const UserLocalizationSettingsContext: React.Context<UserLocalizationSettingsContextType>;
export declare const useUserLocalizationSettings: () => UserLocalizationSettingsContextType;
export declare type UserLocalizationSettingsProviderProps = {
    i18n?: string | null;
    shouldUseLocation?: boolean;
    children: React.ReactNode;
};
export declare const USER_LOCALIZATION_SETTINGS_STORAGE_KEY = "@user-localization-settings";
export declare function UserLocalizationSettingsProvider({ i18n, shouldUseLocation, children, }: UserLocalizationSettingsProviderProps): React.ReactElement;
