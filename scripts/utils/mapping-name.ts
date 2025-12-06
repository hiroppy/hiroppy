export function convertName(str: string | undefined) {
  if (!str) {
    return str;
  }

  const items = [
    ["PR TIMES", "PR TIMES"],
    ["abouthiroppy's slides", "hiroppy's slides"],
    ["バクラク", "LayerX"],
    ["mercan", "Mercari"],
    ["Findy", "Findy"],
    ["note（ノート）", "Note"],
    ["ROUTE06", "ROUTE06"],
    ["yuimedi", "Yuimedi"],
    // Mercari Engineering blog
  ];

  for (const [key, value] of items) {
    if (str.includes(key)) {
      return value;
    }
  }

  return str;
}
