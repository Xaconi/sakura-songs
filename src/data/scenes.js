// Escenas con imágenes de Unsplash y audio placeholder
export const scenes = [
  {
    id: 'day',
    name: 'Amanecer',
    // Imagen de un paisaje de montaña al amanecer
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1080&q=80',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tracks: [
      { id: 1, title: 'Morning Calm', src: '/audio/day-1.mp3' },
      { id: 2, title: 'Sunrise Meditation', src: '/audio/day-2.mp3' },
    ]
  },
  {
    id: 'sunset',
    name: 'Atardecer',
    // Imagen de un atardecer sobre el mar
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1080&q=80',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    tracks: [
      { id: 1, title: 'Golden Hour', src: '/audio/sunset-1.mp3' },
      { id: 2, title: 'Twilight Peace', src: '/audio/sunset-2.mp3' },
    ]
  },
  {
    id: 'night',
    name: 'Noche',
    // Imagen de un cielo estrellado
    image: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1080&q=80',
    gradient: 'linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 100%)',
    tracks: [
      { id: 1, title: 'Starlight Dreams', src: '/audio/night-1.mp3' },
      { id: 2, title: 'Deep Sleep', src: '/audio/night-2.mp3' },
    ]
  }
];
