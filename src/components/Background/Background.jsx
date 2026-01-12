import { useState, useEffect } from 'react';
import './Background.css';

function Background({ scene }) {
  const [loadedImage, setLoadedImage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (scene?.image) {
      setIsTransitioning(true);

      // Preload the image
      const img = new Image();
      img.onload = () => {
        setLoadedImage(scene.image);
        // Small delay for smooth transition
        setTimeout(() => setIsTransitioning(false), 50);
      };
      img.onerror = () => {
        // Fallback to gradient if image fails
        setLoadedImage(null);
        setIsTransitioning(false);
      };
      img.src = scene.image;
    }
  }, [scene?.image]);

  return (
    <div className="background">
      {/* Gradient fallback layer */}
      <div
        className="background-gradient"
        style={{ background: scene?.gradient }}
      />

      {/* Image layer with fade transition */}
      <div
        className={`background-image ${isTransitioning ? 'transitioning' : ''}`}
        style={{
          backgroundImage: loadedImage ? `url(${loadedImage})` : 'none'
        }}
      />

      {/* Overlay for better text readability */}
      <div className="background-overlay" />
    </div>
  );
}

export default Background;
