import { useTextSettings } from "@/context/TextSettingsContext/useTextSettings";

export const useTextToSpriteExportSettings = () => {
  const { settings, updateSetting, resetToDefaults } = useTextSettings();

  return {
    settings,
    changeSetting: updateSetting,
    resetToDefaults,
  };
};
