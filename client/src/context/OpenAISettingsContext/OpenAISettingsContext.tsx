import React, {
  createContext,
  ReactNode,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { AssetType, OpenAIGenerationSettings } from "@/types/export";
import { getDefaultOpenAISettings } from "./getDefaultSettings";

// Action types
type OpenAISettingsAction =
  | {
      type: "UPDATE_SETTING";
      key: keyof OpenAIGenerationSettings;
      value: OpenAIGenerationSettings[keyof OpenAIGenerationSettings];
    }
  | { type: "RESET_TO_DEFAULTS"; assetType: AssetType };

// Reducer
const openAISettingsReducer = (
  state: OpenAIGenerationSettings,
  action: OpenAISettingsAction
): OpenAIGenerationSettings => {
  switch (action.type) {
    case "UPDATE_SETTING":
      return {
        ...state,
        [action.key]: action.value,
      };
    case "RESET_TO_DEFAULTS":
      // Preserve the current prompt when resetting to defaults
      return getDefaultOpenAISettings(action.assetType, state.prompt);
    default:
      return state;
  }
};

// Context type
type OpenAISettingsContextType = {
  settings: OpenAIGenerationSettings;
  updateSetting: <K extends keyof OpenAIGenerationSettings>(
    key: K,
    value: OpenAIGenerationSettings[K]
  ) => void;
  resetToDefaults: (assetType: AssetType) => void;
};

const OpenAISettingsContext = createContext<
  OpenAISettingsContextType | undefined
>(undefined);

// Provider props
interface OpenAISettingsProviderProps {
  children: ReactNode;
  initialAssetType?: AssetType;
}

export const OpenAISettingsProvider: React.FC<OpenAISettingsProviderProps> = ({
  children,
  initialAssetType = AssetType.Sprite,
}) => {
  const [settings, dispatch] = useReducer(
    openAISettingsReducer,
    getDefaultOpenAISettings(initialAssetType)
  );

  const updateSetting = useCallback(
    <K extends keyof OpenAIGenerationSettings>(
      key: K,
      value: OpenAIGenerationSettings[K]
    ) => {
      dispatch({ type: "UPDATE_SETTING", key, value });
    },
    []
  );

  const resetToDefaults = useCallback((assetType: AssetType) => {
    dispatch({ type: "RESET_TO_DEFAULTS", assetType });
  }, []);

  const value = useMemo(
    () => ({
      settings,
      updateSetting,
      resetToDefaults,
    }),
    [settings, updateSetting, resetToDefaults]
  );

  return (
    <OpenAISettingsContext.Provider value={value}>
      {children}
    </OpenAISettingsContext.Provider>
  );
};

export default OpenAISettingsContext;
