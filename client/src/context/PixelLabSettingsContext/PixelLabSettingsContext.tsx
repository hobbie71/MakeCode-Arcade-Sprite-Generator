import React, {
  createContext,
  ReactNode,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { AssetType, PixelLabGenerationSettings } from "@/types/export";
import { getDefaultPixelLabSettings } from "./getDefaultSettings";

// Action types
type PixelLabSettingsAction =
  | {
      type: "UPDATE_SETTING";
      key: keyof PixelLabGenerationSettings;
      value: PixelLabGenerationSettings[keyof PixelLabGenerationSettings];
    }
  | { type: "RESET_TO_DEFAULTS"; assetType: AssetType };

// Reducer
const pixelLabSettingsReducer = (
  state: PixelLabGenerationSettings,
  action: PixelLabSettingsAction
): PixelLabGenerationSettings => {
  switch (action.type) {
    case "UPDATE_SETTING":
      return {
        ...state,
        [action.key]: action.value,
      };
    case "RESET_TO_DEFAULTS":
      // Preserve the current prompt when resetting to defaults
      return getDefaultPixelLabSettings(action.assetType, state.prompt);
    default:
      return state;
  }
};

// Context type
type PixelLabSettingsContextType = {
  settings: PixelLabGenerationSettings;
  updateSetting: <K extends keyof PixelLabGenerationSettings>(
    key: K,
    value: PixelLabGenerationSettings[K]
  ) => void;
  resetToDefaults: (assetType: AssetType) => void;
};

const PixelLabSettingsContext = createContext<
  PixelLabSettingsContextType | undefined
>(undefined);

// Provider props
interface PixelLabSettingsProviderProps {
  children: ReactNode;
  initialAssetType?: AssetType;
}

export const PixelLabSettingsProvider: React.FC<
  PixelLabSettingsProviderProps
> = ({ children, initialAssetType = AssetType.Sprite }) => {
  const [settings, dispatch] = useReducer(
    pixelLabSettingsReducer,
    getDefaultPixelLabSettings(initialAssetType)
  );

  const updateSetting = useCallback(
    <K extends keyof PixelLabGenerationSettings>(
      key: K,
      value: PixelLabGenerationSettings[K]
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
    <PixelLabSettingsContext.Provider value={value}>
      {children}
    </PixelLabSettingsContext.Provider>
  );
};

export default PixelLabSettingsContext;
