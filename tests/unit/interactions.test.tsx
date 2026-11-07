import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fs from 'node:fs';
import path from 'node:path';
import { Navbar } from '../../src/components/Navbar';
import { emailDesigns, experience, profile, projects, storefront, testimonials } from '../../src/content/site';
import { Contact, copyText } from '../../src/sections/Contact';
import { EmailDesigns } from '../../src/sections/EmailDesigns';
import { Experience } from '../../src/sections/Experience';
import { Projects } from '../../src/sections/Projects';
import { Storefront } from '../../src/sections/Storefront';
import { Testimonials } from '../../src/sections/Testimonials';

describe('experience viewer (tabs pattern)', () => {
  it('switches the panel on click', async () => {
    const user = userEvent.setup();
    render(<Experience />);
    const panel = screen.getByRole('tabpanel');
    expect(within(panel).getByRole('heading')).toHaveTextContent(experience.roles[0].role);
    await user.click(screen.getByRole('tab', { name: /The Infused/ }));
    await waitFor(() => expect(within(screen.getByRole('tabpanel')).getByRole('heading')).toHaveTextContent('Klaviyo Specialist'));
    expect(screen.getByRole('tab', { name: /The Infused/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('supports arrow, Home and End keys with roving tabindex', async () => {
    const user = userEvent.setup();
    render(<Experience />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.filter((t) => t.tabIndex === 0)).toHaveLength(1);

    tabs[0].focus();
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{End}');
    expect(document.activeElement).toBe(tabs[tabs.length - 1]);
    await user.keyboard('{ArrowDown}'); // wraps
    expect(document.activeElement).toBe(tabs[0]);
    await user.keyboard('{ArrowUp}'); // wraps back
    expect(document.activeElement).toBe(tabs[tabs.length - 1]);
    await user.keyboard('{Home}');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });
});

describe('projects folder', () => {
  const panelTitle = () => within(screen.getByRole('tabpanel', { name: /./ })).getAllByRole('heading')[0];

  it('has one folder tab per sample, the first one open', () => {
    render(<Projects />);
    const tabs = within(screen.getByRole('tablist', { name: projects.folderLabel })).getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(projects.samples.map((s, i) => `${String(i + 1).padStart(2, '0')}${s.tab}`));
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs.filter((t) => t.tabIndex === 0)).toHaveLength(1);
    expect(panelTitle()).toHaveTextContent(projects.samples[0].title);
  });

  it('flips to the sample a visitor picks', async () => {
    const user = userEvent.setup();
    render(<Projects />);
    const october = projects.samples.find((s) => s.id === 'october')!;
    await user.click(screen.getByRole('tab', { name: new RegExp(october.tab) }));
    await waitFor(() => expect(panelTitle()).toHaveTextContent(october.title));
    expect(screen.getByRole('tab', { name: new RegExp(october.tab) })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('headline-stat')).toHaveTextContent(october.headline.label);
  });

  it('supports arrow keys, Home/End and the previous/next buttons', async () => {
    const user = userEvent.setup();
    render(<Projects />);
    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(tabs[1]);
    await waitFor(() => expect(panelTitle()).toHaveTextContent(projects.samples[1].title));
    await user.keyboard('{End}');
    expect(tabs[tabs.length - 1]).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}'); // wraps
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('button', { name: 'Previous sample' }));
    expect(tabs[tabs.length - 1]).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('button', { name: 'Next sample' }));
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('opens a sample from the case-study index', async () => {
    const user = userEvent.setup();
    render(<Projects />);
    const index = screen.getByRole('navigation', { name: 'Samples in this folder' });
    const rewards = projects.samples.find((s) => s.id === 'rewards')!;
    await user.click(within(index).getByRole('button', { name: new RegExp(rewards.tab) }));
    await waitFor(() => expect(panelTitle()).toHaveTextContent(rewards.title));
  });

  it('switches between the flow canvas and analytics views', async () => {
    const user = userEvent.setup();
    render(<Projects />);
    const quiz = projects.samples.find((s) => s.id === 'quiz')!;
    if (quiz.visual.kind !== 'shots') throw new Error('quiz sample should have screenshots');
    await user.click(screen.getByRole('tab', { name: new RegExp(quiz.tab) }));
    const group = await screen.findByRole('group', { name: 'Screenshot view' });
    const [canvas, analytics] = within(group).getAllByRole('button');
    expect(canvas).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByAltText(quiz.visual.shots[0].alt)).toBeInTheDocument();
    await user.click(analytics);
    expect(screen.getByAltText(quiz.visual.shots[1].alt)).toBeInTheDocument();
    expect(screen.queryByAltText(quiz.visual.shots[0].alt)).toBeNull();
  });

  it('shows the checkout revenue-by-message bars', async () => {
    const user = userEvent.setup();
    render(<Projects />);
    await user.click(screen.getByRole('tab', { name: /Checkout recovery/ }));
    const bars = await screen.findByTestId('checkout-bars');
    expect(within(bars).getAllByRole('listitem')).toHaveLength(projects.checkoutBars.bars.length);
    expect(bars).toHaveTextContent('$24,180');
  });

  it('keeps the illustrative figures internally consistent', () => {
    const find = (id: string) => projects.samples.find((s) => s.id === id)!;
    const stat = (id: string, label: string) => find(id).stats.find((m) => m.label === label)!.value;

    const bars = projects.checkoutBars.bars;
    const total = bars.reduce((a, b) => a + b.value, 0);
    const noDiscount = bars.filter((b) => !b.offer).reduce((a, b) => a + b.value, 0);
    expect(total).toBe(stat('checkout', 'Recovered revenue'));
    expect(Math.round((noDiscount / total) * 100)).toBe(find('checkout').headline.value);
    expect(stat('checkout', 'From Email 1 alone')).toBe(bars[0].value);
    expect(stat('checkout', 'AOV')).toBeCloseTo(total / stat('checkout', 'Orders'), 1);

    const life = find('lifecycle');
    expect(stat('lifecycle', 'Per recipient')).toBeCloseTo(life.headline.value / 47097, 2);
    expect(stat('lifecycle', 'Recipient → order')).toBeCloseTo((stat('lifecycle', 'Orders') / 47097) * 100, 1);

    expect(7420 + 1915 + 525).toBe(find('segments').headline.value);
    expect(Math.round((stat('segments', 'Engaged in 90 days') / stat('segments', 'Eligible members')) * 100)).toBe(stat('segments', 'Of members engaged'));
    expect(stat('rewards', 'Members routed')).toBe(stat('segments', 'Eligible members'));
    expect(stat('october', 'AOV')).toBeCloseTo(find('october').headline.value / stat('october', 'Orders'), 1);
  });

  it('labels the figures as illustrative on the page', () => {
    render(<Projects />);
    expect(screen.getByText(projects.figuresBadge)).toBeInTheDocument();
    expect(screen.getByText(/Figures are illustrative/)).toBeInTheDocument();
  });
});

describe('email design gallery', () => {
  it('shows one panel per email, the first one open, with no brand filter', () => {
    render(<EmailDesigns />);
    const panels = within(screen.getByTestId('email-grid')).getAllByRole('button');
    expect(panels).toHaveLength(emailDesigns.items.length);
    expect(panels.map((p) => p.getAttribute('aria-expanded'))).toEqual(emailDesigns.items.map((_, i) => String(i === 0)));
    expect(screen.queryByRole('group', { name: /brand/i })).toBeNull();
  });

  it('mouse: hovering opens a panel and a click opens the reader', async () => {
    const user = userEvent.setup();
    render(<EmailDesigns />);
    const third = emailDesigns.items[2];
    const panel = screen.getByRole('button', { name: `Show email 3: ${third.title}` });
    await user.hover(panel);
    expect(panel).toHaveAttribute('aria-expanded', 'true');
    expect(panel).toHaveAccessibleName(`Read the full email: ${third.title}`);
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(panel);
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading')).toHaveTextContent(third.title);
  });

  it('touch: the first tap opens a panel, the second tap opens the reader', async () => {
    render(<EmailDesigns />);
    const panel = screen.getByRole('button', { name: /^Show email 5:/ });
    fireEvent.click(panel);
    expect(panel).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(panel);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('opens the full email, steps through and closes with Escape', async () => {
    const user = userEvent.setup();
    render(<EmailDesigns />);
    const [first, second] = emailDesigns.items;
    const opener = screen.getByRole('button', { name: `Read the full email: ${first.title}` });
    await user.click(opener);
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('heading')).toHaveTextContent(first.title);
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', first.src);
    expect(document.activeElement).toBe(within(dialog).getByRole('button', { name: 'Close email viewer' }));
    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(within(dialog).getByRole('heading')).toHaveTextContent(second.title));
    await user.click(within(dialog).getAllByRole('button', { name: 'Previous email' })[0]);
    await waitFor(() => expect(within(dialog).getByRole('heading')).toHaveTextContent(first.title));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(opener);
  });
});

describe('navbar', () => {
  const scrollTo = (y: number) => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true });
    window.dispatchEvent(new Event('scroll'));
  };
  afterEach(() => scrollTo(0));

  it('hides while scrolling down and comes back on scroll up', () => {
    render(<Navbar />);
    const header = document.querySelector('header')!;
    expect(header).toHaveAttribute('data-hidden', 'false');
    act(() => scrollTo(600));
    expect(header).toHaveAttribute('data-hidden', 'true');
    act(() => scrollTo(1200));
    expect(header).toHaveAttribute('data-hidden', 'true');
    act(() => scrollTo(1100));
    expect(header).toHaveAttribute('data-hidden', 'false');
    act(() => scrollTo(1700));
    expect(header).toHaveAttribute('data-hidden', 'true');
    act(() => scrollTo(20));
    expect(header).toHaveAttribute('data-hidden', 'false');
  });

  it('switches between night and day and remembers the choice', async () => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => store.set(k, v) });
    const user = userEvent.setup();
    render(<Navbar />);
    const [toggle] = screen.getAllByRole('button', { name: 'Switch to day mode' });
    await user.click(toggle);
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    // every toggle (desktop and mobile) follows along
    expect(screen.getAllByRole('button', { name: 'Switch to night mode' })).toHaveLength(2);
    await user.click(screen.getAllByRole('button', { name: 'Switch to night mode' })[0]);
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem('theme')).toBe('dark');
    vi.unstubAllGlobals();
  });
});

describe('testimonials', () => {
  it('shows one card per founder with their photo, company and quote', () => {
    const { container } = render(<Testimonials />);
    expect(screen.queryByTestId('testimonials-empty')).toBeNull();
    expect(container.querySelectorAll('blockquote')).toHaveLength(testimonials.items.length);
    expect(testimonials.items.map((t) => t.name)).toEqual(['Michael Blumen', 'Kai Stone', 'Trent Hinde', 'Dr. Dan']);
    for (const t of testimonials.items) {
      expect(screen.getByText(t.name)).toBeInTheDocument();
      expect(screen.getByText(`${t.role}, ${t.company}`)).toBeInTheDocument();
      expect(screen.getByText(`“${t.quote}”`)).toBeInTheDocument();
      expect(container.querySelector(`img[src="${t.photo}"]`)).not.toBeNull();
      expect(fs.existsSync(path.join(process.cwd(), 'public', t.photo!)), t.photo).toBe(true);
    }
  });

  it('falls back to the references-on-request card if the list is emptied', () => {
    const saved = testimonials.items.splice(0);
    try {
      render(<Testimonials />);
      expect(screen.getByTestId('testimonials-empty')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /request a reference/i }).getAttribute('href')).toMatch(/^mailto:claridadbobbyjr@gmail\.com\?subject=Reference/);
      expect(document.querySelector('blockquote')).toBeNull();
    } finally {
      testimonials.items.push(...saved);
    }
  });
});

describe('storefront code panel', () => {
  it('renders every line of the Liquid example', () => {
    render(<Storefront />);
    const code = screen.getByTestId('liquid-code');
    for (const line of storefront.code.lines) expect(code.textContent).toContain(line.trim());
    expect(screen.getByText(storefront.code.file)).toBeInTheDocument();
  });
});

describe('contact copy-email', () => {
  afterEach(() => vi.restoreAllMocks());

  it('copies the address and confirms it', async () => {
    const user = userEvent.setup(); // installs its own clipboard stub, so override after
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Contact />);
    await user.click(screen.getByRole('button', { name: `Email me at ${profile.email}` }));
    await user.click(screen.getByRole('button', { name: `Copy email address ${profile.email}` }));
    expect(writeText).toHaveBeenCalledWith(profile.email);
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
    expect(within(screen.getByTestId('email-menu')).getByRole('status')).toHaveTextContent(/copied/i);
  });

  it('copies the Discord username and confirms it', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Contact />);
    await user.click(screen.getByRole('button', { name: `Copy Discord username ${profile.discord}` }));
    expect(writeText).toHaveBeenCalledWith('bobbyclaridad_1219');
    expect(await screen.findByText('Username copied!')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/discord username copied/i);
  });

  it('puts the Calendly booking first in the contact actions', () => {
    render(<Contact />);
    const first = within(screen.getByTestId('contact-actions')).getAllByRole('link')[0];
    expect(first).toHaveAttribute('href', 'https://calendly.com/claridadbobbyjr/30min');
    expect(first).toHaveAttribute('target', '_blank');
  });

  it('reports failure when the clipboard is unavailable or denied', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    await expect(copyText('x')).resolves.toBe(false);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) }, configurable: true });
    await expect(copyText('x')).resolves.toBe(false);
  });
});

describe('copy reset', () => {
  it('returns the button label to the address after a moment', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockResolvedValue(undefined) }, configurable: true });
    render(<Contact />);
    await user.click(screen.getByRole('button', { name: /email me at/i }));
    await user.click(screen.getByRole('button', { name: /copy email/i }));
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(2600);
    });
    expect(screen.queryByText('Copied!')).toBeNull();
    expect(screen.getByText('claridadbobbyjr@gmail.com')).toBeInTheDocument();
    vi.useRealTimers();
  });
});
