import { useReducer, useCallback, useMemo } from "react";
import { AssetType } from "../types/export";

type SettingsAction<TSettings> =
  | {
      type: "UPDATE_SETTING";
      key: keyof TSettings;
      value: TSettings[keyof TSettings];
    }
  | { type: "RESET_TO_DEFAULTS"; assetType: AssetType };

export type SettingsContextValue<TSettings> = {
  settings: TSettings;
  updateSetting: <K extends keyof TSettings>(
    key: K,
    value: TSettings[K]
  ) => void;
  resetToDefaults: (assetType: AssetType) => void;
};

export const createSettingsReducer =
  <TSettings extends object>(
    getDefaults: (assetType: AssetType, state: TSettings) => TSettings
  ) =>
  (state: TSettings, action: SettingsAction<TSettings>): TSettings => {
    switch (action.type) {
      case "UPDATE_SETTING":
        return {
          ...state,
          [action.key]: action.value,
        };
      case "RESET_TO_DEFAULTS":
        return getDefaults(action.assetType, state);
    }
  };

export const useSettingsContextValue = <TSettings extends object>(
  reducer: (state: TSettings, action: SettingsAction<TSettings>) => TSettings,
  initialSettings: TSettings
): SettingsContextValue<TSettings> => {
  const [settings, dispatch] = useReducer(reducer, initialSettings);

  const updateSetting = useCallback(
    <K extends keyof TSettings>(key: K, value: TSettings[K]) => {
      dispatch({ type: "UPDATE_SETTING", key, value });
    },
    []
  );

  const resetToDefaults = useCallback((assetType: AssetType) => {
    dispatch({ type: "RESET_TO_DEFAULTS", assetType });
  }, []);

  return useMemo(
    () => ({
      settings,
      updateSetting,
      resetToDefaults,
    }),
    [settings, updateSetting, resetToDefaults]
  );
};
