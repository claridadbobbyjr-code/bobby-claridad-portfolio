// Build the site for GitHub Pages and publish dist/ to the `gh-pages` branch.
// Usage: npm run deploy   (needs push access to the `origin` remote)
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const REPO = 'bobby-claridad-portfolio';
const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const read = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();

const remote = read('git remote get-url origin');
const source = read('git rev-parse --short HEAD');

run('npm run build', { env: { ...process.env, BASE_PATH: `/${REPO}/` } });
writeFileSync('dist/.nojekyll', ''); // serve files as-is, no Jekyll processing

const git = (args) => run(`git ${args}`, { cwd: 'dist' });
git('init -q -b gh-pages');
git('add -A');
git(`-c user.name="${read('git config user.name')}" -c user.email="${read('git config user.email')}" commit -q -m "Deploy ${source}"`);
git(`push -f "${remote}" gh-pages`);
console.log(`\nPublished ${source} to gh-pages: https://${remote.split('/').at(-2)}.github.io/${REPO}/`);
