import { getAudioUrl } from '../config/cloudinary';

export const globalPlaylist = [
  { id: 'song-01', title: 'Sleep All Night', artist: 'Calmly', filename: 'sakura_song_01_frapx2.mp3' },
  { id: 'song-02', title: 'Rest', artist: 'Calmly', filename: 'sakura_song_02_ui5gxp.mp3' },
  { id: 'song-03', title: 'Lakes', artist: 'Calmly', filename: 'sakura_song_03_px9thy.mp3' },
  { id: 'song-04', title: 'Presence', artist: 'Calmly', filename: 'sakura_song_04_zgpb0k.mp3' },
  { id: 'song-05', title: 'Deep Sleeping', artist: 'Calmly', filename: 'sakura_song_05_ijxhqi.mp3' },
  { id: 'song-06', title: 'Escape', artist: 'Calmly', filename: 'sakura_song_06_ldimpr.mp3' },
  { id: 'song-07', title: 'Wind Down', artist: 'Calmly', filename: 'sakura_song_07_ebbyoa.mp3' },
];

const tracksWithUrls = globalPlaylist.map(track => ({
  ...track,
  src: getAudioUrl(track.filename),
}));

const scenePlaylists = {
  day: null,
  sunset: null,
  night: null,
};

function getSceneTracks(sceneId) {
  const playlistIds = scenePlaylists[sceneId];
  if (!playlistIds) return tracksWithUrls;
  return tracksWithUrls.filter(t => playlistIds.includes(t.id));
}

const sceneTracksCache = {
  day: getSceneTracks('day'),
  sunset: getSceneTracks('sunset'),
  night: getSceneTracks('night'),
};

export const scenes = [
  {
    id: 'day',
    name: 'Amanecer',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1080&q=80',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tracks: sceneTracksCache.day,
  },
  {
    id: 'sunset',
    name: 'Atardecer',
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1080&q=80',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    tracks: sceneTracksCache.sunset,
  },
  {
    id: 'night',
    name: 'Noche',
    image: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1080&q=80',
    gradient: 'linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 100%)',
    tracks: sceneTracksCache.night,
  }
];

export function getScenePlaylist(sceneId) {
  return sceneTracksCache[sceneId] || tracksWithUrls;
}
