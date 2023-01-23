export function xml2json(xml: string) {
  const json = {};
  const re =
    /(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm;
  // @ts-ignore
  for (const res of xml.matchAll(re)) {
    const key = res[1] || res[3];
    const value = res[2] && xml2json(res[2]);
    // @ts-ignore
    json[key] = (value && Object.keys(value).length ? value : res[2]) || null;
  }
  return json;
}

export const getRandomInt = (max: number) =>
  Math.floor(Math.random() * Math.floor(max));
