const first = require("lodash/fp/first");
const sumBy = require("lodash/fp/sumBy");
const favoriteAlbums = require("./favoriteAlbums.json");

/**
 * @typedef {import('../types/typedefs').Album} Album
 */

const getReleaseYear = (album) => {
  const release = new Date(album.release_date);
  return release.getFullYear();
};

const getDurationInMinutes = (album) => {
  const tracks = album.tracks.items;
  const durationSum = sumBy((t) => t.duration_ms, tracks);
  const durationInMinutes = durationSum / 60000;
  return durationInMinutes;
};

const getCoverUrl = (album) => {
  const isAround300 = (image) => Math.abs(image.width - 300) < 25;
  const optimalImage = album.images.find(isAround300);
  const image = optimalImage || first(album.images);
  return image?.url;
};

/**
 * Maps a spotify album type to our album type
 * @param {any} item Spotify album object
 * @returns {Album}
 */
const toAlbum = (item) => ({
  id: item.album.id,
  name: item.album.name,
  releaseYear: getReleaseYear(item.album),
  durationMinutes: getDurationInMinutes(item.album),
  artistName: item.album.artists[0].name,
  coverUrl: getCoverUrl(item.album),
});

/**
 * @returns {Album[]}
 */
module.exports = function () {
  // @ts-ignore
  return favoriteAlbums.data.map(toAlbum);
};
