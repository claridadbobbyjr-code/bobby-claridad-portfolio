import { profile } from '../content/site';
import { EmailMenu } from './EmailMenu';
import { scrollToId } from '../lib/scroll';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();
  const link = 'rounded px-1.5 py-1 text-muted-foreground transition-colors hover:text-foreground';
  return (
    <footer className="relative z-10 border-t border-border/40">
      <div className="container-tight flex flex-col items-center justify-between gap-3 px-5 py-6 text-xs sm:flex-row sm:text-sm">
        <div className="flex items-center gap-3">
          <Logo compact />
          <span className="text-muted-foreground">© {year} {profile.name}</span>
        </div>
        <nav aria-label="Footer" className="flex items-center gap-1">
          <EmailMenu className={link} label={`Email me at ${profile.email}`} placement="above" align="center">
            Email
          </EmailMenu>
          <span className="text-muted-foreground/40" aria-hidden="true">·</span>
          <a href={profile.resume} download className={link}>Résumé</a>
          <span className="text-muted-foreground/40" aria-hidden="true">·</span>
          <a
            href="#home"
            className={link}
            onClick={(e) => {
              e.preventDefault();
              scrollToId('home');
            }}
          >
            Back to top
          </a>
        </nav>
      </div>
    </footer>
  );
}
