// utils/wikipedia.js
export async function fetchWikipediaImage(title) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    const data = await res.json();
    return data.thumbnail?.source || null;
  } catch (error) {
    console.error("Wikipedia fetch failed for:", title, error);
    return null;
  }
}
