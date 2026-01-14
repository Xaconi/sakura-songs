import './SceneIndicator.css';

function SceneIndicator({ scenes, currentIndex, onSelect }) {
  return (
    <div className="scene-indicator">
      {scenes.map((scene, index) => (
        <button
          key={scene.id}
          className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
          onClick={() => onSelect(index)}
          aria-label={`Ir a escena ${scene.name}`}
          aria-current={index === currentIndex ? 'true' : 'false'}
        />
      ))}
    </div>
  );
}

export default SceneIndicator;
