import { theme } from "./theme";

export const getValueFromTheme = (themeKey: any, property: string): any => {
  return Object.values<any>(theme[themeKey]).find(
    (obj: any) => obj.token === property
  )?.value;
};

export const STORAGE_URL = "http://localhost:8000";

export const CATEGORIES = [
  "Animals",
  "Art",
  "Comics",
  "Crafts",
  "Dance",
  "Design",
  "Fashion",
  "Film/Video",
  "Food",
  "Games",
  "Humanitarian",
  "Journalism",
  "Music",
  "Photography",
  "Publishing",
  "Technology",
  "Theater",
  "Other",
];
