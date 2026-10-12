export const DIGRAPHS = ["sh", "ch", "ck", "ee", "oo", "qu", "ph", "wh"],
  DIGRAPH_CARDS = [
    {
      key: "sh",
      ukrSupport: "Ш",
    },
    {
      key: "ch",
      ukrSupport: "Ч",
    },
    {
      key: "ck",
      ukrSupport: "К",
    },
    {
      key: "ee",
      ukrSupport: "І",
    },
    {
      key: "oo",
      ukrSupport: "У",
    },
    {
      key: "qu",
      ukrSupport: "КВ",
    },
    {
      key: "ph",
      ukrSupport: "Ф",
    },
    {
      key: "wh",
      ukrSupport: "В",
    },
  ];
export function splitIntoUnits(e) {
  let t = [],
    n = 0;
  for (; n < e.length; ) {
    let r = e.slice(n, n + 2);
    DIGRAPHS.includes(r) ? (t.push(r), (n += 2)) : (t.push(e[n]), (n += 1));
  }
  return t;
}
