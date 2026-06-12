import React, { createContext } from "react";
import type { ReactNode } from "react";
import { Crop } from "../../types/export";
import type { PostProcessingSettings } from "../../types/export";
import type { SettingsContextValue } from "../settingsContext";
import {
  createSettingsReducer,
  useSettingsContextValue,
} from "../settingsContext";
import { getDefaultPostProcessingSettings } from "./getDefaultSettings";

const postProcessingReducer = createSettingsReducer<PostProcessingSettings>(
  (assetType) => getDefaultPostProcessingSettings(assetType)
);

const PostProcessingContext = createContext<
  SettingsContextValue<PostProcessingSettings> | undefined
>(undefined);

// Provider props
interface PostProcessingProviderProps {
  children: ReactNode;
}

export const PostProcessingProvider: React.FC<PostProcessingProviderProps> = ({
  children,
}) => {
  const value = useSettingsContextValue(postProcessingReducer, {
    removeBackground: true,
    crop: Crop.Edges,
    tolerance: 30,
  });

  return (
    <PostProcessingContext.Provider value={value}>
      {children}
    </PostProcessingContext.Provider>
  );
};

export default PostProcessingContext;
