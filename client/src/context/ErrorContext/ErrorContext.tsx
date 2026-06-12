import { createStateContext } from "../createStateContext";

const { Context: ErrorContext, Provider: ErrorProvider } = createStateContext<
  string | null
>(null);

export { ErrorContext, ErrorProvider };
