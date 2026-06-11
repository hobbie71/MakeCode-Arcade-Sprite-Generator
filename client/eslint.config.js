import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

// Files allowed to render a raw <button>: the shared button components
// themselves, plus semantic controls with bespoke ARIA/keyboard behavior.
// Everywhere else must use <Button>/<IconButton>/<Backdrop> from src/components.
const RAW_BUTTON_ALLOWLIST = [
  'src/components/Button.tsx',
  'src/components/IconButton.tsx',
  'src/components/Backdrop.tsx',
  'src/components/Switch.tsx', // role="switch"
  'src/components/SegmentedControl.tsx', // radiogroup + roving tabindex
  'src/components/DefaultDropDown.tsx', // combobox trigger
  'src/features/SpriteEditor/layout/PopoverMenu.tsx', // menu / menuitemradio
  'src/features/SpriteEditor/Sidebar/components/ColorIcon.tsx', // color swatch
]

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Force every clickable button through the shared components. A raw
      // <button> is only allowed in the allowlisted files below.
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXOpeningElement[name.name='button']",
          message:
            'Raw <button> is not allowed outside the shared button components. Use <Button>, <IconButton>, or <Backdrop> from src/components (see FRONTEND_STYLE.md).',
        },
      ],
    },
  },
  {
    // Disables no-restricted-syntax entirely in these files; safe while this is
    // the only no-restricted-syntax rule configured.
    files: RAW_BUTTON_ALLOWLIST,
    rules: { 'no-restricted-syntax': 'off' },
  },
])
