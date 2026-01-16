import type { Scene } from '../../data/types';
import './SceneIndicator.css';

interface SceneIndicatorProps {
  scenes: Scene[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export default function SceneIndicator({
  scenes,
  currentIndex,
  onSelect,
}: SceneIndicatorProps) {
  return (
    <div className="scene-indicator">
      {scenes.map((scene, index) => (
        <button
          key={scene.id}
          className={`scene-indicator__dot ${
            index === currentIndex ? 'scene-indicator__dot--active' : ''
          }`}
          onClick={() => onSelect(index)}
          aria-label={`Ir a escena ${scene.name}`}
          aria-current={index === currentIndex ? 'true' : 'false'}
        />
      ))}
    </div>
  );
}
