export const getMetaValue = (key: string): string | boolean => {
  const env = import.meta.env;

  return env[key] ?? false;
};
