import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fs from 'node:fs';
import path from 'node:path';
import App from '../../src/App';
import { emailDesigns, navItems, partners, profile, projects } from '../../src/content/site';

const EXPECTED_ORDER = ['home', 'about', 'services', 'klaviyo', 'shopify', 'process', 'experience', 'projects', 'emails', 'testimonials', 'contact'];

function sectionIds(container: HTMLElement) {
  return Array.from(container.querySelectorAll('main > section')).map((s) => s.id);
}

describe('page structure', () => {
  it('renders every section in menu order', () => {
    const { container } = render(<App />);
    expect(sectionIds(container)).toEqual(EXPECTED_ORDER);
  });

  it('gives every section an accessible heading and the page a single h1', () => {
    const { container } = render(<App />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    for (const section of container.querySelectorAll('main > section')) {
      const labelledBy = section.getAttribute('aria-labelledby');
      expect(labelledBy, `section #${section.id} needs aria-labelledby`).toBeTruthy();
      const heading = container.querySelector(`#${labelledBy}`);
      expect(heading?.textContent?.trim().length, `#${section.id} heading text`).toBeGreaterThan(3);
    }
  });

  it('does not contain the excluded reference sections', () => {
    const { container } = render(<App />);
    for (const id of ['demo', 'pricing', 'portal', 'faq', 'affiliate']) {
      expect(container.querySelector(`#${id}`)).toBeNull();
    }
    const headings = screen.getAllByRole('heading').map((h) => h.textContent ?? '');
    for (const word of [/pricing/i, /\bfaq\b/i, /affiliate/i, /\bdemo\b/i, /questions,? answered/i]) {
      expect(headings.some((h) => word.test(h)), `heading matching ${word}`).toBe(false);
    }
  });

  it('carries no branding or identity from the reference sites', () => {
    const { container } = render(<App />);
    const text = container.textContent ?? '';
    for (const banned of ['HireJPS', 'Jerick', 'JPS', 'Carlo', 'Del Rosario', 'carl.delrosario']) {
      expect(text).not.toContain(banned);
    }
  });
});

describe('content', () => {
  it('shows the hero promise and Bobby’s identity', () => {
    render(<App />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent(/first orders/i);
    expect(h1).toHaveTextContent(/repeat\s+customers/i);
    expect(screen.getByRole('heading', { name: profile.name })).toBeInTheDocument();
  });

  it('lists only the e-commerce résumé roles as experience tabs', () => {
    render(<App />);
    const tabs = within(screen.getByRole('tablist', { name: 'Roles' })).getAllByRole('tab');
    expect(tabs).toHaveLength(6);
    expect(tabs[0]).toHaveTextContent('The Infused');
    expect(tabs[5]).toHaveTextContent('IMTC-Ecom');
    for (const t of tabs) expect(t).not.toHaveTextContent(/Amply Supply|GoHighLevel|Realtor/);
  });

  it('stays on Shopify and Klaviyo: no CRM or AI-automation pitch', () => {
    const { container } = render(<App />);
    const text = container.textContent ?? '';
    for (const off of ['GoHighLevel', 'n8n', 'AI Agent', 'AI Automation']) expect(text).not.toContain(off);
    for (const on of ['Liquid', 'GemPages', 'PageFly', 'Shogun', 'Replo', 'A/B', 'Segments', 'Rewards', 'Email Design']) {
      expect(text, on).toContain(on);
    }
  });

  it('ships every project screenshot to /public with descriptive alt text', () => {
    const shots = projects.samples.flatMap((s) => (s.visual.kind === 'shots' ? s.visual.shots : []));
    expect(shots.length).toBeGreaterThanOrEqual(5);
    for (const shot of shots) {
      expect(shot.src).toMatch(/^\/projects\/.+\.webp$/);
      expect(fs.existsSync(path.join(process.cwd(), 'public', shot.src)), shot.src).toBe(true);
      expect(shot.alt.length).toBeGreaterThan(20);
    }
  });

  it('shows the ten previous-partner logos, each shipped in /public', () => {
    render(<App />);
    const strip = screen.getByRole('region', { name: partners.label });
    const logos = within(strip).getAllByRole('img');
    expect(logos.map((l) => l.getAttribute('alt'))).toEqual(['Infuse', 'CreaPrime', 'Primal Krisp', 'Confident Health', 'Geelong Colourworld', 'Stone Systems', 'Elevation Health', 'Mortgage Marketplace', 'Assist', 'Remodel Engine']);
    for (const p of partners.items) {
      for (const f of [p.logo, p.colour]) expect(fs.existsSync(path.join(process.cwd(), 'public', f)), f).toBe(true);
    }
  });

  it('ships every email design (full size and thumbnail)', () => {
    expect(emailDesigns.items).toHaveLength(7);
    for (const e of emailDesigns.items) {
      for (const f of [e.src, e.thumb]) expect(fs.existsSync(path.join(process.cwd(), 'public', f)), f).toBe(true);
    }
  });

  it('links contact actions to real destinations', () => {
    render(<App />);
    // Contact tile + footer link both open the "write an email" menu
    expect(screen.getAllByRole('button', { name: `Email me at ${profile.email}` })).toHaveLength(2);
    expect(screen.getByRole('link', { name: /call \+63 951 879 8280/i })).toHaveAttribute('href', 'tel:+639518798280');
    expect(screen.getByRole('link', { name: /whatsapp \+63 951 879 8280/i })).toHaveAttribute('href', 'https://wa.me/639518798280');
    expect(screen.getByRole('button', { name: `Copy Discord username ${profile.discord}` })).toBeInTheDocument();
  });

  it('opens a new email to Bobby in Gmail, Outlook or the visitor’s mail app, with subject and brief filled in', async () => {
    const user = userEvent.setup();
    render(<App />);
    const trigger = within(document.getElementById('contact')!).getByRole('button', { name: `Email me at ${profile.email}` });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByTestId('email-menu');
    const gmail = within(menu).getByRole('link', { name: 'Gmail' });
    expect(gmail.getAttribute('href')).toMatch(/^https:\/\/mail\.google\.com\/mail\/\?view=cm&fs=1&to=claridadbobbyjr@gmail\.com&su=Project%20enquiry/);
    expect(gmail.getAttribute('href')).toContain('&body=Hi%20Bobby');
    expect(gmail).toHaveAttribute('target', '_blank');
    const outlook = within(menu).getByRole('link', { name: 'Outlook' });
    expect(outlook.getAttribute('href')).toMatch(/^https:\/\/outlook\.live\.com\/mail\/0\/deeplink\/compose\?to=claridadbobbyjr@gmail\.com&subject=Project%20enquiry/);
    const app = within(menu).getByRole('link', { name: 'My mail app' });
    expect(app.getAttribute('href')).toMatch(/^mailto:claridadbobbyjr@gmail\.com\?subject=Project%20enquiry.*&body=Hi%20Bobby/);
    expect(document.activeElement).toBe(gmail); // focus moves into the list
    await user.keyboard('{Escape}');
    expect(screen.queryByTestId('email-menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    await user.click(trigger);
    await user.click(document.body);
    expect(screen.queryByTestId('email-menu')).toBeNull();
  });

  it('sends every hire / start-a-project button to the Calendly booking page in a new tab', () => {
    render(<App />);
    const booking = screen.getAllByRole('link').filter((a) => a.getAttribute('href') === 'https://calendly.com/claridadbobbyjr/30min');
    // navbar (desktop + mobile menu), hero, Klaviyo chip, Shopify CTA, Projects card, Services footnote, Contact
    expect(booking.length).toBeGreaterThanOrEqual(7);
    for (const a of booking) {
      expect(a).toHaveAttribute('target', '_blank');
      expect(a.getAttribute('rel')).toContain('noopener');
    }
    for (const name of ['Hire Me', 'Book a Call', /book a 30-min call/i]) expect(screen.getAllByRole('link', { name })[0]).toHaveAttribute('href', profile.calendly);
  });

  it('shows Bobby’s headshot in About, shipped in /public', () => {
    render(<App />);
    const img = within(document.getElementById('about')!).getByRole('img', { name: `Portrait of ${profile.name}` });
    const src = img.getAttribute('src')!;
    expect(src).toBe('/bobby-claridad.webp');
    expect(fs.existsSync(path.join(process.cwd(), 'public', src))).toBe(true);
  });

  it('ships the résumé file that the download links point to', () => {
    render(<App />);
    const resumeLinks = screen.getAllByRole('link').filter((a) => a.getAttribute('href') === profile.resume);
    expect(resumeLinks.length).toBeGreaterThanOrEqual(2);
    expect(fs.existsSync(path.join(process.cwd(), 'public', profile.resume))).toBe(true);
  });

  it('has no dead in-page links', () => {
    const { container } = render(<App />);
    const hashes = Array.from(container.ownerDocument.querySelectorAll('a[href^="#"]'))
      .map((a) => a.getAttribute('href')!)
      .filter((h) => h.length > 1);
    expect(hashes.length).toBeGreaterThan(5);
    for (const h of hashes) expect(container.ownerDocument.querySelector(h), h).not.toBeNull();
  });
});

describe('navigation', () => {
  it('has exactly the six requested menu links', () => {
    render(<App />);
    expect(navItems.map((n) => n.label)).toEqual(['About', 'Services', 'Experience', 'Projects', 'Testimonials', 'Contact']);
    const desktopLinks = within(screen.getByRole('navigation', { name: 'Primary' }))
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href')?.startsWith('#') && a.getAttribute('href') !== '#home');
    expect(desktopLinks.map((a) => a.textContent)).toEqual(navItems.map((n) => n.label));
  });

  it('has a nav link for every nav item, each targeting an existing section', () => {
    const { container } = render(<App />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    for (const item of navItems) {
      const link = within(nav).getAllByRole('link', { name: item.label })[0];
      expect(link).toHaveAttribute('href', `#${item.id}`);
      expect(container.querySelector(`#${item.id}`)).not.toBeNull();
    }
  });

  it('scrolls to the section, updates the URL hash and moves focus on click', async () => {
    const user = userEvent.setup();
    const scrollSpy = vi.spyOn(window, 'scrollTo');
    render(<App />);
    // Smooth scrolling goes through Lenis when it is active, otherwise native scrollTo.
    const lenisSpy = window.__lenis ? vi.spyOn(window.__lenis, 'scrollTo') : null;
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    await user.click(within(nav).getAllByRole('link', { name: 'Projects' })[0]);
    if (lenisSpy) expect(lenisSpy).toHaveBeenCalledWith(document.getElementById('projects'), { offset: -90 });
    else expect(scrollSpy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));
    expect(window.location.hash).toBe('#projects');
    expect(document.activeElement?.id).toBe('projects');
    scrollSpy.mockRestore();
  });

  it('opens, operates and closes the mobile menu', async () => {
    const user = userEvent.setup();
    render(<App />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('mobile-menu')).toBeNull();

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const menu = document.getElementById('mobile-menu')!;
    expect(within(menu).getAllByRole('link')).toHaveLength(navItems.length + 1); // + email

    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open menu' }));

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(within(document.getElementById('mobile-menu')!).getByRole('link', { name: 'Testimonials' }));
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});
