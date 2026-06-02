// Test preload (registered via [test].preload in bunfig.toml). Installs
// happy-dom's globals — window, document, navigator, etc. — before any test
// module loads, so React Testing Library can render components into a real DOM
// under Bun's test runner. The production build never imports this file.
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

// React 19 testing flag: marks this as an "act" environment so React Testing
// Library's render/act helpers behave and warnings are accurate.
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
