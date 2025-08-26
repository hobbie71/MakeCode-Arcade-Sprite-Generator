import React, {
  createContext,
  ReactNode,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { ImageExportSettings, AssetType } from "@/types/export";

// Default settings based on asset type
const getDefaultSettings = (assetType: AssetType): ImageExportSettings => {
  switch (assetType) {
    case AssetType.Background:
      return {
        removeBackground: false,
        cropEdges: false,
        tolerance: 30,
      };
    default:
      return {
        removeBackground: true,
        cropEdges: true,
        tolerance: 30,
      };
  }
};

// Action types
type SettingsAction =
  | {
      type: "UPDATE_SETTING";
      key: keyof ImageExportSettings;
      value: ImageExportSettings[keyof ImageExportSettings];
    }
  | { type: "RESET_TO_DEFAULTS"; assetType: AssetType };

// Reducer
const settingsReducer = (
  state: ImageExportSettings,
  action: SettingsAction
): ImageExportSettings => {
  switch (action.type) {
    case "UPDATE_SETTING":
      return {
        ...state,
        [action.key]: action.value,
      };
    case "RESET_TO_DEFAULTS":
      return getDefaultSettings(action.assetType);
    default:
      return state;
  }
};

// Context type
type ImageSettingsContextType = {
  settings: ImageExportSettings;
  updateSetting: <K extends keyof ImageExportSettings>(
    key: K,
    value: ImageExportSettings[K]
  ) => void;
  resetToDefaults: (assetType: AssetType) => void;
};

const ImageSettingsContext = createContext<
  ImageSettingsContextType | undefined
>(undefined);

// Provider props
interface ImageSettingsProviderProps {
  children: ReactNode;
  initialAssetType?: AssetType;
}

export const ImageSettingsProvider: React.FC<ImageSettingsProviderProps> = ({
  children,
  initialAssetType = AssetType.Sprite,
}) => {
  const [settings, dispatch] = useReducer(
    settingsReducer,
    getDefaultSettings(initialAssetType)
  );

  const updateSetting = useCallback(
    <K extends keyof ImageExportSettings>(
      key: K,
      value: ImageExportSettings[K]
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
    <ImageSettingsContext.Provider value={value}>
      {children}
    </ImageSettingsContext.Provider>
  );
};

export default ImageSettingsContext;
