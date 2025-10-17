const getOS = (): "mac" | "windows" | "other" => {
  const platform = navigator.platform.toLowerCase();
  if (platform.includes("mac")) return "mac";
  if (platform.includes("win")) return "windows";
  return "other";
};

export const OS = getOS();
