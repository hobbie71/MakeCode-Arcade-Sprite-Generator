import { useState } from "react";

// Component imports
import CheckBox from "../../../../../features/InputSection/components/CheckBox";
import AiPromptInput from "../components/AiPromptInput";
import DefaultDropDown from "../../../../../components/DefaultDropDown";
import AdvanceDropDownButton from "./AdvanceDropDownButton";

// Hooks imports
import { usePixelLabSettings } from "../../../../../context/PixelLabSettingsContext/usePixelLabSettings";
import { useAssetType } from "../../../../../context/AssetTypeContext/useAssetType";
import { useLoading } from "../../../../../context/LoadingContext/useLoading";

// Type imports
import {
  ALL_STYLES,
  ALL_GENERATION_VIEWS,
  ALL_GENERATION_DIRECTIONS,
  ALL_GENERATION_OUTLINES,
  ALL_PIXELLAB_QUALITYS,
} from "../../../../../types/export";
import { useCallback, useEffect } from "react";

const PixelLabSettingsSection = () => {
  const { selectedAsset } = useAssetType();
  const { settings, updateSetting, resetToDefaults } = usePixelLabSettings();
  const { isGenerating } = useLoading();
  const [isAdvanceTabOpen, setIsAdvanceTabOpen] = useState<boolean>(false);

  // Reset settings when asset type changes
  useEffect(() => {
    resetToDefaults(selectedAsset);
  }, [selectedAsset, resetToDefaults]);

  const changeSetting = useCallback(
    <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
      updateSetting(key, value);
    },
    [updateSetting]
  );

  return (
    <div className="form-group">
      {/* Style */}
      <DefaultDropDown
        onChange={(index: number) =>
          changeSetting("style", ALL_STYLES[index].style)
        }
        options={ALL_STYLES}
        value={ALL_STYLES.findIndex((style) => settings.style === style.style)}
        disabled={isGenerating}>
        Style
      </DefaultDropDown>

      <AiPromptInput
        onSubmit={(prompt) => changeSetting("prompt", prompt)}
        disabled={isGenerating}
      />

      <AdvanceDropDownButton
        isAdvanceTabOpen={isAdvanceTabOpen}
        setIsAdvanceTabOpen={setIsAdvanceTabOpen}
        isGenerating={isGenerating}
      />

      {isAdvanceTabOpen && (
        <>
          {/* Quality */}
          <DefaultDropDown
            onChange={(index: number) =>
              changeSetting("quality", ALL_PIXELLAB_QUALITYS[index].quality)
            }
            options={ALL_PIXELLAB_QUALITYS}
            value={ALL_PIXELLAB_QUALITYS.findIndex(
              (quality) => settings.quality === quality.quality
            )}
            disabled={isGenerating}>
            Quality
          </DefaultDropDown>

          <div className="">
            {/* Add Background */}
            <CheckBox
              onChange={(bool: boolean) => changeSetting("addBackground", bool)}
              checked={settings.addBackground}
              disabled={isGenerating}>
              Add Background
            </CheckBox>

            {/* Fit Full Canvas Size */}
            <CheckBox
              onChange={(bool: boolean) =>
                changeSetting("fitFullCanvasSize", bool)
              }
              checked={settings.fitFullCanvasSize}
              disabled={isGenerating}>
              Fit Full Canvas Size
            </CheckBox>
          </div>

          {/* Point of View */}
          <DefaultDropDown
            onChange={(index: number) =>
              changeSetting("view", ALL_GENERATION_VIEWS[index].view)
            }
            options={ALL_GENERATION_VIEWS}
            value={ALL_GENERATION_VIEWS.findIndex(
              (view) => settings.view === view.view
            )}
            disabled={isGenerating}>
            Point of View
          </DefaultDropDown>

          {/* Sprite Facing */}
          <DefaultDropDown
            onChange={(index: number) =>
              changeSetting(
                "direction",
                ALL_GENERATION_DIRECTIONS[index].direction
              )
            }
            options={ALL_GENERATION_DIRECTIONS}
            value={ALL_GENERATION_DIRECTIONS.findIndex(
              (direction) => settings.direction === direction.direction
            )}
            disabled={isGenerating}>
            Sprite Facing
          </DefaultDropDown>

          {/* Outline */}
          <DefaultDropDown
            onChange={(index: number) =>
              changeSetting("outline", ALL_GENERATION_OUTLINES[index].outline)
            }
            options={ALL_GENERATION_OUTLINES}
            value={ALL_GENERATION_OUTLINES.findIndex(
              (outline) => settings.outline === outline.outline
            )}
            disabled={isGenerating}>
            Outline
          </DefaultDropDown>
        </>
      )}
    </div>
  );
};

export default PixelLabSettingsSection;
