import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SleepTimerModal from './SleepTimerModal';

const PRESETS = [15, 30, 45, 60, 90];

describe('SleepTimerModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onStartTimer: vi.fn(),
    presets: PRESETS,
    validateCustomTime: vi.fn((value) => {
      const num = parseInt(value, 10);
      if (isNaN(num) || num <= 0) {
        return { valid: false, error: 'Tiempo inválido' };
      }
      if (num > 480) {
        return { valid: false, error: 'Máximo 480 minutos' };
      }
      return { valid: true };
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should_render_when_open', () => {
      render(<SleepTimerModal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Temporizador de sueño')).toBeInTheDocument();
    });

    it('should_have_aria_hidden_when_closed', () => {
      render(<SleepTimerModal {...defaultProps} isOpen={false} />);

      const modal = screen.getByRole('dialog', { hidden: true });
      expect(modal).toHaveAttribute('aria-hidden', 'true');
    });

    it('should_render_all_preset_buttons', () => {
      render(<SleepTimerModal {...defaultProps} />);

      PRESETS.forEach((minutes) => {
        expect(screen.getByText(`${minutes} min`)).toBeInTheDocument();
      });
    });

    it('should_render_custom_time_input', () => {
      render(<SleepTimerModal {...defaultProps} />);

      expect(screen.getByLabelText(/tiempo personalizado/i)).toBeInTheDocument();
    });

    it('should_render_close_button', () => {
      render(<SleepTimerModal {...defaultProps} />);

      expect(screen.getByLabelText('Cerrar')).toBeInTheDocument();
    });
  });

  describe('Preset Selection', () => {
    it('should_call_onStartTimer_when_preset_clicked', async () => {
      const user = userEvent.setup();
      render(<SleepTimerModal {...defaultProps} />);

      await user.click(screen.getByText('30 min'));

      expect(defaultProps.onStartTimer).toHaveBeenCalledWith(30);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should_call_onStartTimer_with_correct_value_for_each_preset', async () => {
      const user = userEvent.setup();

      for (const minutes of PRESETS) {
        const onStartTimer = vi.fn();
        const onClose = vi.fn();

        const { unmount } = render(
          <SleepTimerModal
            {...defaultProps}
            onStartTimer={onStartTimer}
            onClose={onClose}
          />
        );

        await user.click(screen.getByText(`${minutes} min`));

        expect(onStartTimer).toHaveBeenCalledWith(minutes);
        unmount();
      }
    });
  });

  describe('Custom Input', () => {
    it('should_allow_typing_in_custom_input', async () => {
      const user = userEvent.setup();
      render(<SleepTimerModal {...defaultProps} />);

      const input = screen.getByLabelText(/tiempo personalizado/i);
      await user.type(input, '25');

      expect(input).toHaveValue(25);
    });

    it('should_call_onStartTimer_with_custom_value', async () => {
      const user = userEvent.setup();
      render(<SleepTimerModal {...defaultProps} />);

      const input = screen.getByLabelText(/tiempo personalizado/i);
      const startBtn = screen.getByText('Iniciar');

      await user.type(input, '25');
      await user.click(startBtn);

      expect(defaultProps.onStartTimer).toHaveBeenCalledWith(25);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should_show_error_for_invalid_input', async () => {
      const user = userEvent.setup();
      render(<SleepTimerModal {...defaultProps} />);

      const input = screen.getByLabelText(/tiempo personalizado/i);
      await user.type(input, '0');

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should_disable_start_button_when_input_empty', () => {
      render(<SleepTimerModal {...defaultProps} />);

      const startBtn = screen.getByText('Iniciar');
      expect(startBtn).toBeDisabled();
    });

    it('should_disable_start_button_for_invalid_input', async () => {
      const user = userEvent.setup();
      render(<SleepTimerModal {...defaultProps} />);

      const input = screen.getByLabelText(/tiempo personalizado/i);
      const startBtn = screen.getByText('Iniciar');

      await user.type(input, '-5');

      expect(startBtn).toBeDisabled();
    });

    it('should_submit_custom_time_on_Enter_key', async () => {
      const user = userEvent.setup();
      render(<SleepTimerModal {...defaultProps} />);

      const input = screen.getByLabelText(/tiempo personalizado/i);

      await user.type(input, '45');
      await user.keyboard('{Enter}');

      expect(defaultProps.onStartTimer).toHaveBeenCalledWith(45);
    });

    it('should_not_submit_on_Enter_if_input_invalid', async () => {
      const user = userEvent.setup();
      render(<SleepTimerModal {...defaultProps} />);

      const input = screen.getByLabelText(/tiempo personalizado/i);

      await user.type(input, '0');
      await user.keyboard('{Enter}');

      expect(defaultProps.onStartTimer).not.toHaveBeenCalled();
    });
  });

  describe('Close Behavior', () => {
    it('should_call_onClose_when_close_button_clicked', async () => {
      const user = userEvent.setup();
      render(<SleepTimerModal {...defaultProps} />);

      await user.click(screen.getByLabelText('Cerrar'));

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should_call_onClose_when_overlay_clicked', async () => {
      const user = userEvent.setup();
      render(<SleepTimerModal {...defaultProps} />);

      const overlay = document.querySelector('.sleep-timer-overlay');
      await user.click(overlay);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should_call_onClose_when_ESC_pressed', () => {
      render(<SleepTimerModal {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should_not_call_onClose_on_ESC_when_modal_closed', () => {
      render(<SleepTimerModal {...defaultProps} isOpen={false} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should_have_correct_aria_attributes', () => {
      render(<SleepTimerModal {...defaultProps} />);

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'sleep-timer-title');
    });

    it('should_have_aria_hidden_false_when_open', () => {
      render(<SleepTimerModal {...defaultProps} isOpen={true} />);

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-hidden', 'false');
    });

    it('should_mark_input_as_invalid_when_error', async () => {
      const user = userEvent.setup();
      render(<SleepTimerModal {...defaultProps} />);

      const input = screen.getByLabelText(/tiempo personalizado/i);
      await user.type(input, '0');

      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('State Reset', () => {
    it('should_clear_custom_input_when_modal_closes', async () => {
      const { rerender } = render(<SleepTimerModal {...defaultProps} />);

      const input = screen.getByLabelText(/tiempo personalizado/i);
      fireEvent.change(input, { target: { value: '25' } });

      expect(input).toHaveValue(25);

      rerender(<SleepTimerModal {...defaultProps} isOpen={false} />);
      rerender(<SleepTimerModal {...defaultProps} isOpen={true} />);

      const newInput = screen.getByLabelText(/tiempo personalizado/i);
      expect(newInput).toHaveValue(null);
    });
  });
});
