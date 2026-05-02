import { describe, it, expect } from 'vitest';
import { theme } from '../theme';

describe('Theme Configuration', () => {
  it('should have Indigo as primary color', () => {
    expect(theme.palette.primary.main).toBe('#4f46e5');
    expect(theme.palette.primary.light).toBe('#818cf8');
    expect(theme.palette.primary.dark).toBe('#4338ca');
  });

  it('should have correct secondary color', () => {
    expect(theme.palette.secondary.main).toBe('#64748b');
  });

  it('should have success, warning, and error colors', () => {
    expect(theme.palette.success.main).toBe('#10b981');
    expect(theme.palette.warning.main).toBe('#f59e0b');
    expect(theme.palette.error.main).toBe('#ef4444');
  });

  it('should have correct background colors', () => {
    expect(theme.palette.background.default).toBe('#f8fafc');
    expect(theme.palette.background.paper).toBe('#ffffff');
  });

  it('should use Inter font family', () => {
    expect(theme.typography.fontFamily).toContain('Inter');
  });

  it('should have border radius of 8', () => {
    expect(theme.shape.borderRadius).toBe(8);
  });

  it('should have proper typography hierarchy', () => {
    expect(theme.typography.h1?.fontSize).toBe('32px');
    expect(theme.typography.h2?.fontSize).toBe('24px');
    expect(theme.typography.h3?.fontSize).toBe('20px');
  });

  it('should have button text transform set to none', () => {
    expect(theme.typography.button?.textTransform).toBe('none');
  });
});