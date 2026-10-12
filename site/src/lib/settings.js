export const SETTINGS_KEY = "phonics4all_settings";
export const DEFAULT_SETTINGS = {
  digraphsEnabled: false,
};
export function loadSettings() {
  try {
    let e = localStorage.getItem(SETTINGS_KEY);
    return e
      ? {
          ...DEFAULT_SETTINGS,
          ...JSON.parse(e),
        }
      : {
          ...DEFAULT_SETTINGS,
        };
  } catch {
    return {
      ...DEFAULT_SETTINGS,
    };
  }
}
export function saveSettings(e) {
  (localStorage.setItem(SETTINGS_KEY, JSON.stringify(e)),
    window.dispatchEvent(new Event("phonics4all_settings_updated")));
}
