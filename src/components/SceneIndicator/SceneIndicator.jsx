import './SceneIndicator.css';

function SceneIndicator({ total, current, onSelect }) {
  return (
    <div className="scene-indicator">
      {Array.from({ length: total }, (_, index) => (
        <button
          key={index}
          className={`indicator-dot ${index === current ? 'active' : ''}`}
          onClick={() => onSelect(index)}
          aria-label={`Ir a escena ${index + 1}`}
          aria-current={index === current ? 'true' : 'false'}
        />
      ))}
    </div>
  );
}

export default SceneIndicator;
