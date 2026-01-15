import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SleepTimerBadge from './SleepTimerBadge';

describe('SleepTimerBadge', () => {
  const defaultProps = {
    formattedTime: '05:00',
    isFading: false,
    onCancel: vi.fn(),
  };

  describe('Rendering', () => {
    it('should_render_formatted_time', () => {
      render(<SleepTimerBadge {...defaultProps} />);

      expect(screen.getByText('05:00')).toBeInTheDocument();
    });

    it('should_render_cancel_button', () => {
      render(<SleepTimerBadge {...defaultProps} />);

      expect(screen.getByLabelText('Cancelar temporizador')).toBeInTheDocument();
    });

    it('should_render_moon_icon', () => {
      render(<SleepTimerBadge {...defaultProps} />);

      const badge = document.querySelector('.sleep-timer-badge');
      const icon = badge.querySelector('.badge-icon svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Fading State', () => {
    it('should_show_apagando_text_when_fading', () => {
      render(<SleepTimerBadge {...defaultProps} isFading={true} />);

      expect(screen.getByText('Apagando...')).toBeInTheDocument();
      expect(screen.queryByText('05:00')).not.toBeInTheDocument();
    });

    it('should_hide_cancel_button_when_fading', () => {
      render(<SleepTimerBadge {...defaultProps} isFading={true} />);

      expect(screen.queryByLabelText('Cancelar temporizador')).not.toBeInTheDocument();
    });

    it('should_add_fading_class_when_fading', () => {
      render(<SleepTimerBadge {...defaultProps} isFading={true} />);

      const badge = document.querySelector('.sleep-timer-badge');
      expect(badge).toHaveClass('fading');
    });
  });

  describe('Cancel Action', () => {
    it('should_call_onCancel_when_cancel_button_clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();

      render(<SleepTimerBadge {...defaultProps} onCancel={onCancel} />);

      await user.click(screen.getByLabelText('Cancelar temporizador'));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Time Display', () => {
    it('should_display_different_times_correctly', () => {
      const times = ['00:30', '10:00', '59:59', '00:01'];

      times.forEach((time) => {
        const { unmount } = render(
          <SleepTimerBadge {...defaultProps} formattedTime={time} />
        );

        expect(screen.getByText(time)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Accessibility', () => {
    it('should_have_aria_live_on_time_display', () => {
      render(<SleepTimerBadge {...defaultProps} />);

      const timeElement = screen.getByText('05:00');
      expect(timeElement).toHaveAttribute('aria-live', 'polite');
    });

    it('should_have_accessible_cancel_button', () => {
      render(<SleepTimerBadge {...defaultProps} />);

      const cancelBtn = screen.getByLabelText('Cancelar temporizador');
      expect(cancelBtn).toBeInTheDocument();
      expect(cancelBtn.tagName).toBe('BUTTON');
    });
  });
});
