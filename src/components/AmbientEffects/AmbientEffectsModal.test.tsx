import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AmbientEffectsModal from './AmbientEffectsModal';
import { AMBIENT_EFFECTS } from '../../data/ambientEffects';

describe('AmbientEffectsModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    effects: AMBIENT_EFFECTS,
    activeEffectId: null,
    isLoading: false,
    onToggleEffect: vi.fn(),
    onVolumeChange: vi.fn(),
    getVolume: vi.fn(() => 50),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when open', () => {
      render(<AmbientEffectsModal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Sonidos ambiente')).toBeInTheDocument();
    });

    it('should have aria-hidden when closed', () => {
      render(<AmbientEffectsModal {...defaultProps} isOpen={false} />);

      const modal = screen.getByRole('dialog', { hidden: true });
      expect(modal).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render all effects', () => {
      render(<AmbientEffectsModal {...defaultProps} />);

      AMBIENT_EFFECTS.forEach((effect) => {
        expect(screen.getByText(effect.name)).toBeInTheDocument();
      });
    });

    it('should render close button', () => {
      render(<AmbientEffectsModal {...defaultProps} />);

      expect(screen.getByLabelText('Cerrar')).toBeInTheDocument();
    });

    it('should render description text', () => {
      render(<AmbientEffectsModal {...defaultProps} />);

      expect(screen.getByText(/selecciona un sonido ambiente/i)).toBeInTheDocument();
    });
  });

  describe('Effect Toggle', () => {
    it('should call onToggleEffect when effect clicked', async () => {
      const user = userEvent.setup();
      render(<AmbientEffectsModal {...defaultProps} />);

      await user.click(screen.getByLabelText(/lluvia desactivado/i));

      expect(defaultProps.onToggleEffect).toHaveBeenCalledWith('rain');
    });

    it('should show active indicator when effect is active', () => {
      render(<AmbientEffectsModal {...defaultProps} activeEffectId="rain" />);

      expect(screen.getByText(/efecto activo: lluvia/i)).toBeInTheDocument();
    });

    it('should not show active indicator when no effect active', () => {
      render(<AmbientEffectsModal {...defaultProps} activeEffectId={null} />);

      expect(screen.queryByText(/efecto activo/i)).not.toBeInTheDocument();
    });
  });

  describe('Volume Control', () => {
    it('should call onVolumeChange when slider changes', async () => {
      render(<AmbientEffectsModal {...defaultProps} activeEffectId="rain" />);

      const slider = screen.getByLabelText(/volumen de lluvia/i);
      fireEvent.change(slider, { target: { value: '75' } });

      expect(defaultProps.onVolumeChange).toHaveBeenCalledWith('rain', 75);
    });

    it('should disable volume slider when effect not active', () => {
      render(<AmbientEffectsModal {...defaultProps} activeEffectId={null} />);

      const sliders = screen.getAllByRole('slider');
      sliders.forEach((slider) => {
        expect(slider).toBeDisabled();
      });
    });
  });

  describe('Close Behavior', () => {
    it('should call onClose when close button clicked', async () => {
      const user = userEvent.setup();
      render(<AmbientEffectsModal {...defaultProps} />);

      await user.click(screen.getByLabelText('Cerrar'));

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should call onClose when overlay clicked', async () => {
      const user = userEvent.setup();
      render(<AmbientEffectsModal {...defaultProps} />);

      const overlay = document.querySelector('.ambient-effects-modal__overlay');
      if (overlay) {
        await user.click(overlay);
      }

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should call onClose when ESC pressed', () => {
      render(<AmbientEffectsModal {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should not call onClose on ESC when modal closed', () => {
      render(<AmbientEffectsModal {...defaultProps} isOpen={false} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should disable toggle when loading', () => {
      render(<AmbientEffectsModal {...defaultProps} isLoading={true} activeEffectId="rain" />);

      const toggleButton = screen.getByLabelText(/lluvia activado/i);
      expect(toggleButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have correct aria attributes', () => {
      render(<AmbientEffectsModal {...defaultProps} />);

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'ambient-effects-title');
    });

    it('should have aria-hidden false when open', () => {
      render(<AmbientEffectsModal {...defaultProps} isOpen={true} />);

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-hidden', 'false');
    });

    it('should have aria-pressed on toggle buttons', () => {
      render(<AmbientEffectsModal {...defaultProps} activeEffectId="rain" />);

      const activeToggle = screen.getByLabelText(/lluvia activado/i);
      expect(activeToggle).toHaveAttribute('aria-pressed', 'true');

      const inactiveToggle = screen.getByLabelText(/tormenta desactivado/i);
      expect(inactiveToggle).toHaveAttribute('aria-pressed', 'false');
    });
  });
});
