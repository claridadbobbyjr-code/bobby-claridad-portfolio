import { act, render, screen } from '@testing-library/react';

/**
 * Animation components depend on framer-motion's in-view and reduced-motion hooks.
 * We control both so the tests are deterministic in jsdom.
 */
const state = vi.hoisted(() => ({ inView: true, reduced: false }));
vi.mock('framer-motion', async (orig) => {
  const actual = await orig<typeof import('framer-motion')>();
  return { ...actual, useInView: () => state.inView, useReducedMotion: () => state.reduced };
});

import { CountUp } from '../../src/components/CountUp';
import { RevealHeading } from '../../src/components/RevealHeading';
import { ScrambleText } from '../../src/components/ScrambleText';

beforeEach(() => {
  state.inView = true;
  state.reduced = false;
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe('ScrambleText', () => {
  it('scrambles, then settles on the exact label within the reference timing', () => {
    const text = '// what you get';
    render(<ScrambleText text={text} />);
    const display = screen.getByTestId('scramble-display');
    act(() => vi.advanceTimersByTime(32 * 3));
    expect(display.textContent).not.toBe(text); // mid-decode
    expect(display.textContent).toHaveLength(text.length); // never changes width
    act(() => vi.advanceTimersByTime(32 * Math.max(text.length * 2, 16)));
    expect(display.textContent).toBe(text);
  });

  it('keeps the real label available to assistive tech throughout', () => {
    render(<ScrambleText text="// services" />);
    expect(screen.getByText('// services', { selector: '.sr-only' })).toBeInTheDocument();
  });

  it('waits until in view before animating', () => {
    state.inView = false;
    render(<ScrambleText text="// later" />);
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByTestId('scramble-display').textContent?.trim()).toBe('');
  });

  it('shows the final text immediately for reduced motion', () => {
    state.reduced = true;
    render(<ScrambleText text="// calm" />);
    expect(screen.getByTestId('scramble-display').textContent).toBe('// calm');
  });
});

describe('RevealHeading', () => {
  it('splits words into masked spans and exposes the full sentence once', () => {
    render(<RevealHeading lead="How " accent="I Work" />);
    const h = screen.getByRole('heading', { level: 2 });
    expect(h).toHaveAccessibleName('How I Work');
    const masks = h.querySelectorAll('span.overflow-hidden');
    expect(masks).toHaveLength(3);
    expect(h.querySelectorAll('.text-gradient')).toHaveLength(2);
  });

  it('renders a plain heading for reduced motion', () => {
    state.reduced = true;
    render(<RevealHeading lead="Let’s " accent="Connect" />);
    const h = screen.getByRole('heading', { level: 2 });
    expect(h.querySelectorAll('span.overflow-hidden')).toHaveLength(0);
    expect(h).toHaveTextContent('Let’s Connect');
  });
});

describe('CountUp', () => {
  it('jumps straight to the value for reduced motion and always exposes the final value', () => {
    state.reduced = true;
    render(<CountUp value={28} />);
    expect(screen.getByText('28', { selector: '.sr-only' })).toBeInTheDocument();
    expect(screen.getByText('28', { selector: '[aria-hidden="true"]' })).toBeInTheDocument();
  });
});
