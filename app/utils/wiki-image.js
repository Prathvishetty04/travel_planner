// lib/wiki-image.js
export async function fetchWikipediaImage(title) {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
    title
  )}&prop=pageimages&format=json&pithumbsize=400&origin=*`

  try {
    const res = await fetch(endpoint)
    const data = await res.json()

    const pages = data?.query?.pages
    const firstKey = Object.keys(pages)[0]
    const imageUrl = pages[firstKey]?.thumbnail?.source || null

    return imageUrl
  } catch (err) {
    console.error("Failed to fetch Wikipedia image for:", title, err)
    return null
  }
}
