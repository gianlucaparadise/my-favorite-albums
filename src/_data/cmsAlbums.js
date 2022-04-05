const fetch = require("node-fetch");

const cmsHost = process.env.CMS_HOST;
const cmsApiKey = process.env.CMS_API_KEY;

/**
 * @typedef {import('../types/typedefs').Album} Album
 */

const fetchAlbumsFromCms = async function () {
  const url = new URL("/api/albums", cmsHost);
  url.search = new URLSearchParams({
    "populate[0]": "artist",
    "populate[1]": "cover",
    "sort[0]": "releaseYear",
  }).toString();

  const opts = {
    headers: {
      Authorization: `bearer ${cmsApiKey}`,
    },
  };

  console.info("fetchAlbumsFromCms - Fetching from:", url, "with opts:", opts);

  const response = await fetch(url, opts);

  const data = await response.json();

  if (data.error) {
    console.error("Error while fetching cmsAlbums:", data.error);
    throw new Error("Error while fetching cmsAlbums");
  }

  console.info("fetchAlbumsFromCms - Fetched:", data);

  return data;
};

/**
 * Maps a CMS album type to our album type
 * @param {any} item CMS album object
 * @returns {Album}
 */
const toAlbum = (item) => ({
  id: item.id,
  name: item.name,
  releaseYear: item.releaseYear,
  durationMinutes: item.durationMinutes,
  artistName: item.artist.name,
  coverUrl: item.cover?.url,
});

module.exports = async function () {
  try {
    const cmsAlbums = await fetchAlbumsFromCms();
    if (!cmsAlbums?.data) {
      console.info("cmsAlbums - Empty album list", cmsAlbums);
      return [];
    }

    return cmsAlbums.data.map(toAlbum);
  } catch (e) {
    console.error("Error while building cmsAlbums", e);
    throw e;
  }
};
