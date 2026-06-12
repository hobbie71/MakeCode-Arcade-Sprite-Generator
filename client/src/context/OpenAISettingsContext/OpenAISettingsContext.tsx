import React, { createContext } from "react";
import type { ReactNode } from "react";
import { AssetType } from "../../types/export";
import type { OpenAIGenerationSettings } from "../../types/export";
import type { SettingsContextValue } from "../settingsContext";
import {
  createSettingsReducer,
  useSettingsContextValue,
} from "../settingsContext";
import { getDefaultOpenAISettings } from "./getDefaultSettings";

// Preserve the current prompt when resetting to defaults
const openAISettingsReducer = createSettingsReducer<OpenAIGenerationSettings>(
  (assetType, state) => getDefaultOpenAISettings(assetType, state.prompt)
);

const OpenAISettingsContext = createContext<
  SettingsContextValue<OpenAIGenerationSettings> | undefined
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
  const value = useSettingsContextValue(
    openAISettingsReducer,
    getDefaultOpenAISettings(initialAssetType)
  );

  return (
    <OpenAISettingsContext.Provider value={value}>
      {children}
    </OpenAISettingsContext.Provider>
  );
};

export default OpenAISettingsContext;
