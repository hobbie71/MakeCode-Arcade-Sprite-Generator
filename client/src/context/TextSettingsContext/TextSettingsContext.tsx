import React, {
  createContext,
  ReactNode,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import {
  TextExportSettings,
  GenerationView,
  GenerationDirection,
  GenerationOutline,
} from "@/types/export";

// Default settings
const getDefaultSettings = (): TextExportSettings => {
  return {
    removeBackground: false,
    cropEdges: false,
    addBackground: true,
    fitFullCanvasSize: true,
    view: GenerationView.Side,
    direction: GenerationDirection.North,
    outline: GenerationOutline.SelectiveOutline,
  };
};

// Action types
type SettingsAction =
  | {
      type: "UPDATE_SETTING";
      key: keyof TextExportSettings;
      value: TextExportSettings[keyof TextExportSettings];
    }
  | { type: "RESET_TO_DEFAULTS" };

// Reducer
const settingsReducer = (
  state: TextExportSettings,
  action: SettingsAction
): TextExportSettings => {
  switch (action.type) {
    case "UPDATE_SETTING":
      return {
        ...state,
        [action.key]: action.value,
      };
    case "RESET_TO_DEFAULTS":
      return getDefaultSettings();
    default:
      return state;
  }
};

// Context type
type TextSettingsContextType = {
  settings: TextExportSettings;
  updateSetting: <K extends keyof TextExportSettings>(
    key: K,
    value: TextExportSettings[K]
  ) => void;
  resetToDefaults: () => void;
};

const TextSettingsContext = createContext<TextSettingsContextType | undefined>(
  undefined
);

// Provider props
interface TextSettingsProviderProps {
  children: ReactNode;
}

export const TextSettingsProvider: React.FC<TextSettingsProviderProps> = ({
  children,
}) => {
  const [settings, dispatch] = useReducer(
    settingsReducer,
    getDefaultSettings()
  );

  const updateSetting = useCallback(
    <K extends keyof TextExportSettings>(
      key: K,
      value: TextExportSettings[K]
    ) => {
      dispatch({ type: "UPDATE_SETTING", key, value });
    },
    []
  );

  const resetToDefaults = useCallback(() => {
    dispatch({ type: "RESET_TO_DEFAULTS" });
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
    <TextSettingsContext.Provider value={value}>
      {children}
    </TextSettingsContext.Provider>
  );
};

export default TextSettingsContext;
