// Shared test helpers for the client. Import from here instead of
// "@testing-library/react" directly when a component or hook needs app context.
//
//   import { renderWithProviders, screen, fireEvent } from "../../test/test-utils";
//
// `renderWithProviders` wraps the UI in the full provider stack (every app
// context + the sprite-editor contexts), so deeply-nested components and hooks
// that call useContext won't throw "must be inside <Provider>".
import { render, renderHook, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import GlobalProviders from "../providers/GlobalProviders";
import SpriteEditorProvider from "../features/SpriteEditor/provider/SpriteEditorProviders";

/** Every global + sprite-editor provider, composed. Use as a renderHook/render
 *  wrapper. GlobalProviders sits above the router, so no Router is needed here. */
export const AllProviders = ({ children }: { children: ReactNode }) => (
  <GlobalProviders>
    <SpriteEditorProvider>{children}</SpriteEditorProvider>
  </GlobalProviders>
);

/** RTL `render`, with the full provider stack injected as the wrapper. */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllProviders, ...options });

/** RTL `renderHook`, with the full provider stack injected as the wrapper. */
export const renderHookWithProviders = <Result, Props>(
  cb: (props: Props) => Result,
  options?: Omit<Parameters<typeof renderHook<Result, Props>>[1], "wrapper">,
) => renderHook(cb, { wrapper: AllProviders, ...options });

// Re-export the rest of RTL (screen, fireEvent, waitFor, act, renderHook, ...).
export * from "@testing-library/react";
