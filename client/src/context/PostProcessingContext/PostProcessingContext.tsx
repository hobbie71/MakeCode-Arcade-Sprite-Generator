import React, { createContext, useReducer, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { AssetType } from "../../types/export";
import type { PostProcessingSettings } from "../../types/export";
import { getDefaultPostProcessingSettings } from "./getDefaultSettings";

// Action types
type PostProcessingAction =
  | {
      type: "UPDATE_SETTING";
      key: keyof PostProcessingSettings;
      value: PostProcessingSettings[keyof PostProcessingSettings];
    }
  | { type: "RESET_TO_DEFAULTS"; assetType: AssetType };

// Reducer
const postProcessingReducer = (
  state: PostProcessingSettings,
  action: PostProcessingAction
): PostProcessingSettings => {
  switch (action.type) {
    case "UPDATE_SETTING":
      return {
        ...state,
        [action.key]: action.value,
      };
    case "RESET_TO_DEFAULTS":
      return getDefaultPostProcessingSettings(action.assetType);
    default:
      return state;
  }
};

// Context type
type PostProcessingContextType = {
  settings: PostProcessingSettings;
  updateSetting: <K extends keyof PostProcessingSettings>(
    key: K,
    value: PostProcessingSettings[K]
  ) => void;
  resetToDefaults: (assetType: AssetType) => void;
};

const PostProcessingContext = createContext<
  PostProcessingContextType | undefined
>(undefined);

// Provider props
interface PostProcessingProviderProps {
  children: ReactNode;
}

export const PostProcessingProvider: React.FC<PostProcessingProviderProps> = ({
  children,
}) => {
  const [settings, dispatch] = useReducer(postProcessingReducer, {
    removeBackground: true,
    cropEdges: true,
    tolerance: 30,
  });

  const updateSetting = useCallback(
    <K extends keyof PostProcessingSettings>(
      key: K,
      value: PostProcessingSettings[K]
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
    <PostProcessingContext.Provider value={value}>
      {children}
    </PostProcessingContext.Provider>
  );
};

export default PostProcessingContext;
