/**
 * All site copy lives here. Sources: Bobby_Claridad_Resume_ATS_Compatible.pdf,
 * the Infuse lifecycle case study and the Klaviyo screenshots in /assests.
 * Edit this file to update personal info, services, experience, projects and testimonials —
 * components read from it and never hard-code facts.
 */

/**
 * URL for a file in /public. Prefixes Vite's base path, so the same paths work at "/" locally
 * and under "/bobby-claridad-portfolio/" on GitHub Pages.
 */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const profile = {
  name: 'Bobby Claridad',
  initials: 'BC',
  shortName: 'Bobby',
  title: 'Klaviyo & Shopify Specialist',
  headline: 'Klaviyo Email Marketing Specialist · Shopify Store Manager',
  location: 'Ampayon, Butuan City, Philippines',
  email: 'claridadbobbyjr@gmail.com',
  phone: '+63 951 879 8280',
  phoneHref: 'tel:+639518798280',
  /** Every "hire / start a project" button opens this booking page in a new tab. */
  calendly: 'https://calendly.com/claridadbobbyjr/30min',
  whatsapp: '+63 951 879 8280',
  whatsappHref: 'https://wa.me/639518798280',
  /** Discord has no public link by username, so the site offers it as copy-to-clipboard. */
  discord: 'bobbyclaridad_1219',
  resume: asset('/Bobby-Claridad-Resume.pdf'),
  yearsExperience: '5+',
} as const;

/** Spread onto any <a> that should open the Calendly booking page. */
export const bookingLink = { href: profile.calendly, target: '_blank', rel: 'noopener noreferrer' } as const;

const enquirySubject = encodeURIComponent('Project enquiry from your portfolio');
const enquiryBody = encodeURIComponent(
  'Hi Bobby,\n\nI found your portfolio and would like to talk about:\n\n- Store URL:\n- What I need help with (Klaviyo flows, campaigns, Shopify customization…):\n- Timeline:\n\nThanks!',
);
export const mailtoEnquiry = `mailto:${profile.email}?subject=${enquirySubject}&body=${enquiryBody}`;

/**
 * "Email me" opens a new message addressed to Bobby, subject and brief already filled in.
 * mailto: only works when the visitor has a desktop mail app set up, so webmail compose links come first.
 */
export const emailCompose = [
  { id: 'gmail', label: 'Gmail', href: `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=${enquirySubject}&body=${enquiryBody}`, external: true },
  { id: 'outlook', label: 'Outlook', href: `https://outlook.live.com/mail/0/deeplink/compose?to=${profile.email}&subject=${enquirySubject}&body=${enquiryBody}`, external: true },
  { id: 'app', label: 'My mail app', href: mailtoEnquiry, external: false },
] as const;

export type NavItem = { id: string; label: string };
/** The six menu links, in page order. `id` must equal a section's DOM id. */
export const navItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
];

export const hero = {
  badgeLead: 'E-commerce · ',
  badge: 'Shopify · Klaviyo',
  titleLead: 'Turn first orders into',
  titleAccent: 'repeat customers.',
  sub: 'Klaviyo flows, segments and campaigns, loyalty and rewards journeys, on-brand email design, and Shopify stores customized with Liquid and GemPages. Built, A/B tested and measured.',
  primaryCta: 'Book a Call',
  secondaryCta: 'See My Projects',
  trust: [
    { icon: 'shield', label: '5+ years in e-commerce' },
    { icon: 'mail', label: 'Klaviyo flows & campaigns' },
    { icon: 'code', label: 'Shopify · Liquid · GemPages' },
    { icon: 'flask', label: 'A/B tested & measured' },
  ],
  /** Years from the résumé; e-commerce roles counted from `experience.roles`; page builders from `storefront.builders` (excluding the theme editor). */
  stats: [
    { label: 'Years', value: 5, suffix: '+' },
    { label: 'E-com roles', value: 5, suffix: '' },
    { label: 'Page builders', value: 5, suffix: '+' },
  ],
  graphLabel:
    'Shopify and Klaviyo system: a Shopify order syncs to Klaviyo, a conditional split checks the loyalty tier, the customer gets a post-purchase email and SMS or a rewards tier welcome, the subject line is A/B tested, and the next order lands back in Shopify.',
};

/** Nodes of the hero system map — the order-to-repeat-order loop Bobby builds. */
export const heroNodes = [
  { id: 'order', title: 'Shopify', sub: 'Order Placed', icon: 'bag', hue: '142 70% 50%', x: 248, y: 48 },
  { id: 'sync', title: 'Klaviyo', sub: 'Profile & Event Sync', icon: 'sync', hue: '168 80% 47%', x: 248, y: 149 },
  { id: 'split', title: 'Split', sub: 'Rewards Tier?', icon: 'split', hue: '271 82% 66%', x: 248, y: 250 },
  { id: 'post', title: 'Post-Purchase', sub: 'Email + SMS', icon: 'mail', hue: '196 92% 60%', x: 128, y: 363 },
  { id: 'rewards', title: 'Rewards', sub: 'Tier Welcome', icon: 'gift', hue: '38 95% 58%', x: 392, y: 361 },
  { id: 'abtest', title: 'A/B Test', sub: 'Subject Line 50/50', icon: 'flask', hue: '210 90% 62%', x: 392, y: 460 },
  { id: 'repeat', title: 'Repeat Order', sub: 'Back in Shopify', icon: 'cart', hue: '142 70% 50%', x: 392, y: 557 },
] as const;

/** Directed edges between hero nodes; `dur`/`begin` pace the travelling pulse (seconds). */
export const heroEdges = [
  { from: 'order', to: 'sync', dur: 2.6, begin: 0 },
  { from: 'sync', to: 'split', dur: 2.6, begin: 0.5 },
  { from: 'split', to: 'post', dur: 3, begin: 1 },
  { from: 'split', to: 'rewards', dur: 3, begin: 1 },
  { from: 'rewards', to: 'abtest', dur: 2.6, begin: 1.6 },
  { from: 'abtest', to: 'repeat', dur: 2.6, begin: 2.1 },
] as const;

export const about = {
  label: '// about',
  title: 'E-commerce marketing, ',
  accent: 'from flow to storefront.',
  sub: 'One person who plans the campaign, builds the Klaviyo flow, designs the email and customizes the Shopify page it links to.',
  highlights: [
    '5+ years in e-commerce: Klaviyo, Shopify and store operations',
    'Klaviyo Specialist at The Infused and Klaviyo Flow Builder at Ecoms Flow Builder Company',
    'Shopify Store Manager at Confident Health and Embeholdings',
    'BS Microbiology, Caraga State University (2022): trained in method and detail',
  ],
  storyLabel: '// the story',
  story:
    'I started with product listings, store graphics and social content. Managing Shopify stores showed me how much revenue sits with customers who have already bought once. Now I build the Klaviyo flows, segments and campaigns that bring them back, and the storefront pages they land on,',
  storyStrong: ' tested, measured and easy for the team to run.',
  cta: 'Download Résumé',
};

export const services = {
  label: '// services',
  title: 'Services for ',
  accent: 'Shopify & Klaviyo Brands',
  sub: 'Six services that cover the customer journey, from the first visit to the next order.',
  footnote: 'Need something that spans several of these?',
  items: [
    {
      icon: 'mail',
      title: 'Klaviyo Flows',
      desc: 'Welcome, quiz-personalized welcome, browse, cart and checkout abandonment, post-purchase and winback flows, with triggers, filters, splits and delays.',
    },
    {
      icon: 'target',
      title: 'Segments & Campaigns',
      desc: 'Engagement, purchase and lifecycle segments, plus a campaign calendar for launches, promos and seasonal sales like Halloween and Black Friday.',
    },
    {
      icon: 'gift',
      title: 'Loyalty & Rewards',
      desc: 'Reward tiers connected to Klaviyo through Shopify tags (for example YOYO Loyalty), with tier welcomes, near-tier segments and reminders.',
    },
    {
      icon: 'palette',
      title: 'Email Design & Copy',
      desc: 'Branded, mobile-first email layouts designed in Figma, with subject lines, preview text and calls to action written to convert.',
    },
    {
      icon: 'code',
      title: 'Shopify Customization',
      desc: 'Theme changes in Liquid, landing and product pages in GemPages, PageFly, Shogun or Replo, plus products, apps and checkout settings.',
    },
    {
      icon: 'plug',
      title: 'Integrations & A/B Tests',
      desc: 'Shopify and app data synced to Klaviyo through native integrations, REST APIs and webhooks, then A/B tests on subject lines, content and send times.',
    },
  ],
};

export const klaviyo = {
  label: '// klaviyo',
  title: 'Klaviyo, ',
  accent: 'Built Around Behaviour',
  sub: 'Flows, segments and campaigns that react to what each customer did in your Shopify store, then get tested and tuned.',
  chipsLabel: 'Flows I build',
  chips: [
    'Welcome Series',
    'Quiz Welcome',
    'Browse Abandonment',
    'Cart Abandonment',
    'Checkout Abandonment',
    'Post-Purchase',
    'Winback',
    'Rewards Tier Welcome',
  ],
  chipsCta: '+ Your Flow',
  points: [
    {
      icon: 'zap',
      title: 'Triggered by real behaviour',
      desc: 'Shopify events like Started Checkout and Placed Order, quiz answers and customer tags start each flow, not a guess about who should get what.',
    },
    {
      icon: 'split',
      title: 'Buyer-aware branching',
      desc: 'Conditional splits on purchase history, quiz answers and loyalty tier, so first-time shoppers and returning customers get different follow-ups.',
    },
    {
      icon: 'target',
      title: 'Segments that drive campaigns',
      desc: 'Engagement windows, one-time buyers ready to reorder, VIP and near-tier segments that decide who gets each send.',
    },
    {
      icon: 'flask',
      title: 'A/B tested, then tuned',
      desc: 'Subject lines, content and send times tested; deliverability, list hygiene and flow performance reviewed after launch.',
    },
  ],
  cta: 'See the projects',
};

export const storefront = {
  label: '// shopify',
  title: 'Storefronts, ',
  accent: 'Customized to Convert',
  sub: 'Theme work in Liquid when the store needs it, page builders when your team wants to edit pages on their own.',
  points: [
    {
      icon: 'code',
      title: 'Liquid & theme code',
      desc: 'Custom sections, snippets and product templates written in Liquid, with settings your team can change in the theme editor.',
    },
    {
      icon: 'layout',
      title: 'GemPages landing & product pages',
      desc: 'Landing, product and promo pages built in GemPages, matched to the brand and checked on mobile before they go live.',
    },
    {
      icon: 'layers',
      title: 'Other page builders',
      desc: 'Comfortable in PageFly, Shogun, Replo and EComposer, and with the sections and blocks of Shopify’s own theme editor.',
    },
    {
      icon: 'gauge',
      title: 'Store operations & speed',
      desc: 'Products, collections, inventory, apps and checkout settings, with mobile responsiveness and page speed kept in check.',
    },
  ],
  buildersLabel: 'Page builders',
  builders: ['GemPages', 'PageFly', 'Shogun', 'Replo', 'EComposer', 'Shopify Theme Editor'],
  code: {
    file: 'sections/rewards-banner.liquid',
    caption: 'Example snippet: a theme section that shows each logged-in customer their rewards tier.',
    lines: [
      '{%- liquid',
      "  assign tier = 'Green Leaf'",
      "  if customer.tags contains 'Platinum Leaf'",
      "    assign tier = 'Platinum Leaf'",
      "  elsif customer.tags contains 'Gold Leaf'",
      "    assign tier = 'Gold Leaf'",
      '  endif',
      '-%}',
      '<div class="rewards-banner" data-tier="{{ tier | handleize }}">',
      '  <p>{{ section.settings.heading }}: {{ tier }}</p>',
      "  {%- render 'tier-perks', tier: tier -%}",
      '</div>',
      '{% schema %}',
      '  { "name": "Rewards banner",',
      '    "settings": [',
      '      { "type": "text", "id": "heading", "label": "Heading" }',
      '    ] }',
      '{% endschema %}',
    ],
  },
  cta: 'Customize my store',
};

export const process = {
  label: '// process',
  title: 'How ',
  accent: 'I Work',
  sub: 'The same five steps behind every flow, campaign and storefront change.',
  steps: [
    { icon: 'search', title: 'Audit', desc: 'Review the Klaviyo account, flows, segments, deliverability and the Shopify theme.' },
    { icon: 'calendar', title: 'Plan', desc: 'Map the flows and segments, and set the campaign calendar around launches and sales.' },
    { icon: 'wrench', title: 'Build', desc: 'Flows, email templates, Liquid sections and GemPages pages built and connected.' },
    { icon: 'flask', title: 'QA & A/B Test', desc: 'Logic, links, rendering and timing checked; subject lines and content tested.' },
    { icon: 'chart', title: 'Report & Improve', desc: 'Opens, clicks, orders and revenue reviewed, then the next round of changes.' },
  ],
};

export type Role = {
  company: string;
  role: string;
  period: string;
  meta: string;
  points: string[];
};

export const experience = {
  label: '// experience',
  title: 'E-commerce ',
  accent: 'Experience',
  sub: 'Eight roles across Klaviyo, Shopify, store operations and automation. Pick a role to see the work.',
  // From "My Resume.pdf" (Nov 2026): same order, titles, dates and bullets.
  roles: [
    {
      company: 'The Infused',
      role: 'Klaviyo Specialist',
      period: '2025 – 2026',
      meta: 'Remote',
      points: [
        'Build, configure and optimize Klaviyo flows such as welcome series, browse abandonment, cart and checkout abandonment, post-purchase, winback and customer retention journeys.',
        'Plan and strategize email campaigns around promotions, product launches, seasonal moments and customer lifecycle goals.',
        'Develop campaign calendars and coordinate messaging, timing, audience targeting and campaign priorities.',
        'Write conversion-focused email copy, including subject lines, preview text, headlines, body copy and calls to action.',
        'Design branded email layouts in Figma and translate creative concepts into email campaigns.',
        'Integrate and troubleshoot apps and data connections to support customer segmentation, personalization, loyalty messaging and automated flows.',
        'Build and refine segments based on engagement, purchase behavior and customer lifecycle stage.',
        'Review campaign and flow performance, including deliverability, opens, clicks, conversions and revenue opportunities, and recommend improvements.',
        'Support A/B testing, list hygiene and email best practices to improve engagement and maintain list health.',
      ],
    },
    {
      company: 'Home Painting Geelong',
      role: 'E-commerce & Digital Marketing Specialist',
      period: '2024 – 2025',
      meta: 'Remote',
      points: [
        'Managed Shopify stores, product listings and inventory.',
        'Created graphics, edited videos and produced engaging marketing content.',
        'Ran Facebook ad campaigns to drive traffic and sales.',
        'Developed and maintained WordPress websites with SEO.',
        'Managed social media to strengthen brand presence and engagement.',
      ],
    },
    {
      company: 'Embeholdings',
      role: 'Shopify Store Manager',
      period: '2023 – 2024',
      meta: 'Remote',
      points: [
        'Customized Shopify themes and supported storefront development.',
        'Managed email, referral and affiliate campaigns.',
        'Integrated third-party apps and plugins.',
        'Optimized checkout experience, mobile responsiveness and site speed.',
        'Managed social media platforms to improve brand visibility and engagement.',
      ],
    },
    {
      company: 'Confident Health',
      role: 'Shopify Store Manager',
      period: '2022 – 2023',
      meta: 'Remote',
      points: [
        'Built, maintained and managed Shopify storefronts, including theme configuration, page layouts, navigation and product pages.',
        'Managed product listings, collections, pricing, product information, inventory and merchandising updates.',
        'Customized Shopify themes and storefront sections to support brand consistency, usability and conversion goals.',
        'Managed day-to-day Shopify operations, including app and plugin integrations, store settings, checkout experience and troubleshooting.',
        'Supported paid advertising and promotional activities to drive qualified traffic, product discovery and sales.',
        'Optimized storefront user experience, mobile responsiveness, page speed and purchase pathways.',
        'Coordinated marketing assets, landing pages, offers and product content across store and campaign touchpoints.',
        'Monitored store performance and identified opportunities to improve product presentation, customer experience and conversion.',
      ],
    },
    {
      company: 'Hundredfolds',
      role: 'Workflow Automation & CRM Specialist',
      period: '2021 – 2022',
      meta: 'Remote',
      points: [
        'Built and optimized GoHighLevel workflows for lead intake, contact management, pipeline updates, appointment reminders and follow-up sequences.',
        'Created multi-step automations in Zapier and Make.com to move information between forms, CRMs, spreadsheets, email platforms and team communication tools.',
        'Used webhooks and API-based connections to pass data between applications, standardize field mapping and reduce manual data entry.',
        'Supported AI-enabled workflows for lead qualification, FAQ response assistance, content processing and routing inquiries to the appropriate team.',
        'Set up automated email and SMS touchpoints, internal alerts, task assignments and customer onboarding sequences.',
        'Performed end-to-end testing, resolved integration issues and refined workflows based on business requirements and user feedback.',
      ],
    },
    {
      company: 'Ecoms Flow Builder Company',
      role: 'Klaviyo Flow Builder',
      period: '2020 – 2021',
      meta: 'Remote',
      points: [
        'Built and maintained automated email flows in Klaviyo based on customer actions, lifecycle stages and business objectives.',
        'Configured triggers, flow filters, conditional splits, time delays and profile-property logic to deliver relevant messages.',
        'Set up and troubleshot app integrations and event syncing so customer and order data could support segmentation and automation.',
        'Supported core flows such as welcome, abandoned cart, checkout abandonment, browse abandonment, post-purchase and winback.',
        'Assisted with audience segmentation, personalization, dynamic content and targeted messaging.',
        'QA’d flow logic, links, email rendering and timing before launch; monitored skipped profiles and troubleshot flow behavior.',
        'Used campaign and flow performance data to identify opportunities to improve engagement and conversions.',
      ],
    },
    {
      company: 'StoneSystem',
      role: 'GoHighLevel (GHL) Expert',
      period: '2019 – 2020',
      meta: 'Remote',
      points: [
        'Built landing pages and optimized websites.',
        'Created automation workflows to streamline tasks.',
        'Managed email marketing campaigns for engagement and conversion.',
        'Developed lead generation strategies to support sales.',
      ],
    },
    {
      company: 'Realtor Web Builder',
      role: 'Web Builder & Social Media Manager',
      period: '2018 – 2019',
      meta: 'Remote',
      points: [
        'Created social content for Facebook, Instagram, LinkedIn and TikTok.',
        'Supported lead generation and created website wireframes.',
        'Wrote and published blog content on client websites.',
        'Researched realtor information and organized records in Airtable.',
      ],
    },
  ] satisfies Role[],
};

export type Shot = { src: string; alt: string; width: number; height: number; label: string };

/**
 * A number that counts up on screen. The project figures are illustrative: they show the
 * scale of result these systems are built for, not a report from a specific client account
 * (the section footnote says so on the page). Keep them internally consistent — the unit
 * tests check that totals, shares and averages add up.
 */
export type Metric = { value: number; label: string; prefix?: string; suffix?: string; decimals?: number };
export type Headline = Metric & { note: string };

export type Sample = {
  id: string;
  /** Short name on the folder tab. */
  tab: string;
  icon: string;
  kicker: string;
  title: string;
  desc: string;
  headline: Headline;
  stats: Metric[];
  insight?: string;
  tags?: string[];
  /** What fills the right-hand side of the folder page. */
  visual: { kind: 'index' } | { kind: 'bars' } | { kind: 'shots'; shots: Shot[]; wide?: boolean };
};

export const projects = {
  label: '// projects',
  title: 'Projects That ',
  accent: 'Move Revenue',
  sub: 'Six samples of the Klaviyo and Shopify systems I build. Open a tab to flip through the folder.',
  folderLabel: 'Project samples',
  privacyNote: 'Client details blurred',
  figuresBadge: 'Illustrative figures',
  footnote:
    'Figures are illustrative, showing the scale of result these builds are designed for; they are not reports from a specific client account. Screenshots show real flow and campaign structures with client figures blurred and list text softened. Real results can be walked through on a call.',
  checkoutBars: {
    title: 'Revenue by message',
    bars: [
      { label: 'Email 1 · Reminder', value: 24180, offer: false },
      { label: 'Email 2 · Check-in', value: 11640, offer: false },
      { label: 'Email 3 · Objections', value: 5420, offer: false },
      { label: 'Non-buyer 4 · Objections', value: 3800, offer: false },
      { label: 'Non-buyer 5 · 20%', value: 2150, offer: true },
      { label: 'Returning 4 · 20%', value: 1320, offer: true },
      { label: 'Returning 5 · 20%', value: 450, offer: true },
    ],
  },
  samples: [
    {
      id: 'lifecycle',
      tab: 'Lifecycle program',
      icon: 'chart',
      kicker: 'Case study · Klaviyo + Shopify · Wellness brand',
      title: 'Lifecycle email and SMS for a wellness brand',
      desc: 'I designed, built and run the automated flows for a Shopify wellness brand: a quiz-personalized welcome series, a buyer-aware checkout recovery flow, and a tiered loyalty welcome connected to YOYO Loyalty.',
      tags: ['Flow architecture', 'Segmentation', 'Copywriting', 'SMS', 'Loyalty integration'],
      headline: { value: 184620, prefix: '$', label: 'flow revenue in 90 days', note: '3,412 orders from 47,097 recipients' },
      stats: [
        { value: 3412, label: 'Orders' },
        { value: 7.24, decimals: 2, suffix: '%', label: 'Recipient → order' },
        { value: 3.92, decimals: 2, prefix: '$', label: 'Per recipient' },
        { value: 41, suffix: '%', label: 'Of store revenue' },
        { value: 99.4, decimals: 1, suffix: '%', label: 'Delivered' },
        { value: 0.02, decimals: 2, suffix: '%', label: 'Spam complaints' },
      ],
      visual: { kind: 'index' },
    },
    {
      id: 'checkout',
      tab: 'Checkout recovery',
      icon: 'cart',
      kicker: 'Abandoned checkout flow',
      title: 'Checkout recovery that saves the discount for last',
      desc: 'Buyer-aware branching: returning customers and first-time shoppers get different follow-ups. The early touches carry no offer at all; 20% only appears late, for people who still haven’t come back.',
      headline: { value: 92, suffix: '%', label: 'of recovered revenue needed no discount', note: '$45,040 of $48,960 came before the 20% offer' },
      stats: [
        { value: 48960, prefix: '$', label: 'Recovered revenue' },
        { value: 812, label: 'Orders' },
        { value: 24180, prefix: '$', label: 'From Email 1 alone' },
        { value: 60.3, decimals: 2, prefix: '$', label: 'AOV' },
        { value: 18.4, decimals: 1, suffix: '%', label: 'Checkouts recovered' },
        { value: 58.2, decimals: 1, suffix: '%', label: 'Open rate' },
      ],
      insight: 'The no-discount Email 1 alone recovered $24,180, about half the flow’s revenue. The three 20% emails together added just 8%, so margin stays where it belongs.',
      visual: { kind: 'bars' },
    },
    {
      id: 'quiz',
      tab: 'Quiz welcome',
      icon: 'split',
      kicker: 'Welcome series · Questionnaire',
      title: 'A welcome series that starts from the subscriber’s own answer',
      desc: 'The signup quiz asks what the subscriber wants help with. Email 1 then branches into five versions (morning throat clearing, constant throat clearing, mucus after meals, nighttime reflux, or general) before the shared education and social-proof emails. A two-message SMS track mirrors the same five answers.',
      headline: { value: 31, suffix: '%', label: 'conversion on the best-matched branch', note: 'vs. 8.6% across the whole series' },
      stats: [
        { value: 62.4, decimals: 1, suffix: '%', label: 'Open rate' },
        { value: 11.8, decimals: 1, suffix: '%', label: 'Click rate' },
        { value: 8.6, decimals: 1, suffix: '%', label: 'Conversion' },
        { value: 4.72, decimals: 2, prefix: '$', label: 'Per recipient' },
        { value: 9840, label: 'Subscribers welcomed' },
        { value: 99.7, decimals: 1, suffix: '%', label: 'SMS delivery' },
      ],
      insight: 'Five quiz answers, five first emails: the message matches what the subscriber said they need before anything is sold.',
      visual: {
        kind: 'shots',
        shots: [
          { src: asset('/projects/welcome-quiz-flow.webp'), alt: 'Klaviyo flow canvas: a welcome series trigger and order check, then a split into five quiz-answer branches, each with its own first email, followed by shared emails and delays.', width: 586, height: 792, label: 'Flow canvas' },
          { src: asset('/projects/welcome-quiz-analytics.webp'), alt: 'Analytics view of the same welcome series flow, figures blurred, with a performance panel on each email.', width: 344, height: 780, label: 'Analytics view' },
        ],
      },
    },
    {
      id: 'rewards',
      tab: 'Rewards welcome',
      icon: 'gift',
      kicker: 'RW · Rewards welcome',
      title: 'A loyalty welcome for every Leaf tier',
      desc: 'YOYO Loyalty tiers connected to Klaviyo through Shopify tags, then five paths: Platinum, Gold, Silver, Green with an order, and Green without one. Each tier gets its own welcome and a profile property update, and anyone who hasn’t clicked or ordered after three days gets a sign-in reminder.',
      headline: { value: 62480, prefix: '$', label: 'revenue from tier welcomes', note: '18,420 members routed by tier' },
      stats: [
        { value: 18420, label: 'Members routed' },
        { value: 34, prefix: '+', suffix: '%', label: 'Repeat-order lift' },
        { value: 14.2, decimals: 1, suffix: '%', label: 'Click rate' },
        { value: 5, label: 'Paths' },
        { value: 4, label: 'Tiers' },
        { value: 3, suffix: ' days', label: 'To reminder' },
      ],
      visual: {
        kind: 'shots',
        shots: [
          { src: asset('/projects/rewards-welcome-flow.webp'), alt: 'Klaviyo flow canvas for the rewards welcome: conditional splits on Shopify tags for each loyalty tier, each with a welcome email, property update, three-day wait and reminder email.', width: 918, height: 795, label: 'Flow canvas' },
        ],
      },
    },
    {
      id: 'segments',
      tab: 'Rewards segments',
      icon: 'target',
      kicker: 'RW · Segments',
      title: 'Tier and near-tier segments behind the rewards program',
      desc: 'Segments for every Leaf tier, customers close to the next tier (Near Silver, Near Gold, Near Platinum), Green Leaf buyers and non-buyers, and 90-day engagement. They power the rewards flows and decide who gets each tier campaign.',
      headline: { value: 9860, label: 'customers one step from the next tier', note: 'Near Silver 7,420 · Near Gold 1,915 · Near Platinum 525' },
      stats: [
        { value: 11, label: 'Segments' },
        { value: 18420, label: 'Eligible members' },
        { value: 12710, label: 'Engaged in 90 days' },
        { value: 69, suffix: '%', label: 'Of members engaged' },
        { value: 2340, label: 'Tier-ups in 60 days' },
        { value: 4, label: 'Tiers' },
      ],
      visual: {
        kind: 'shots',
        wide: true,
        shots: [
          { src: asset('/projects/rewards-segments.webp'), alt: 'Klaviyo segments list with eleven loyalty tier, near-tier and engagement segments; names and dates softened, counts blurred.', width: 1620, height: 529, label: 'Segments' },
        ],
      },
    },
    {
      id: 'october',
      tab: 'October campaigns',
      icon: 'mail',
      kicker: 'Campaigns · Seasonal sale',
      title: 'An October sale sequence, sent segment by segment',
      desc: 'A teaser, Black Friday early access, a Halloween launch, then final-48-hours and final-day reminders. Each send targets the segments that fit it: engaged in the last 30 days, one-time buyers ready to reorder, high-intent non-buyers and VIP non-subscribers.',
      headline: { value: 212540, prefix: '$', label: 'revenue across six sends', note: '3,486 orders in 14 days' },
      stats: [
        { value: 64.2, decimals: 1, suffix: '%', label: 'Peak open rate' },
        { value: 55.8, decimals: 1, suffix: '%', label: 'Average open rate' },
        { value: 3486, label: 'Orders' },
        { value: 4.6, decimals: 1, suffix: '%', label: 'Best click rate' },
        { value: 60.97, decimals: 2, prefix: '$', label: 'AOV' },
        { value: 6, label: 'Sends' },
      ],
      visual: {
        kind: 'shots',
        wide: true,
        shots: [
          { src: asset('/projects/campaigns-halloween.webp'), alt: 'Klaviyo campaigns list with six sent emails, each targeting several segments; names, audiences and dates softened, figures blurred.', width: 1632, height: 289, label: 'Campaigns' },
        ],
      },
    },
  ] satisfies Sample[],
  toolsTitle: 'Tools & Platforms',
  toolGroups: [
    { name: 'Email & retention', tools: ['Klaviyo', 'Klaviyo SMS', 'YOYO Loyalty', 'Mailchimp'] },
    { name: 'Shopify & builders', tools: ['Shopify', 'Liquid', 'GemPages', 'PageFly', 'Shogun', 'Replo', 'EComposer'] },
    { name: 'Design & integrations', tools: ['Figma', 'Canva', 'Photoshop', 'Claude Design', 'REST APIs', 'Webhooks', 'Zapier', 'Make.com'] },
  ],
  openCard: {
    title: 'Your store next',
    desc: 'Have a flow that isn’t earning, or a page that isn’t converting? Book a 30-minute call, bring the store URL, and I’ll show you where to start.',
    cta: 'Book a 30-min call',
  },
};

/** Brands Bobby has worked with. Logos come from each brand's own site (public/partners). */
export const partners = {
  label: 'Previous partners',
  /**
   * `logo` is the one-colour mark shown at rest; `colour` is the brand's original logo, shown on hover over a
   * `tile` (white unless the original is a light logo). `h` balances visual weight: compact marks get more height.
   */
  items: [
    { name: 'Infuse', logo: asset('/partners/infuse.png'), colour: asset('/partners/infuse-colour.png'), width: 578, height: 160, h: 30 },
    { name: 'CreaPrime', logo: asset('/partners/creaprime.png'), colour: asset('/partners/creaprime-colour.png'), width: 587, height: 120, h: 28, tile: '#0b0b0b' },
    { name: 'Primal Krisp', logo: asset('/partners/primal-krisp.png'), colour: asset('/partners/primal-krisp-colour.png'), width: 244, height: 200, h: 44 },
    { name: 'Confident Health', logo: asset('/partners/confident-health.png'), colour: asset('/partners/confident-health-colour.png'), width: 428, height: 200, h: 40 },
    { name: 'Geelong Colourworld', logo: asset('/partners/geelong-colourworld.png'), colour: asset('/partners/geelong-colourworld-colour.png'), width: 256, height: 240, h: 54 },
    { name: 'Stone Systems', logo: asset('/partners/stone-systems.png'), colour: asset('/partners/stone-systems-colour.png'), width: 498, height: 200, h: 38 },
    { name: 'Elevation Health', logo: asset('/partners/elevation-health.png'), colour: asset('/partners/elevation-health-colour.png'), width: 580, height: 200, h: 38 },
    { name: 'Mortgage Marketplace', logo: asset('/partners/mortgage-marketplace.png'), colour: asset('/partners/mortgage-marketplace-colour.png'), width: 556, height: 200, h: 40 },
    { name: 'Assist', logo: asset('/partners/assist.png'), colour: asset('/partners/assist-colour.png'), width: 432, height: 200, h: 34 },
    { name: 'Remodel Engine', logo: asset('/partners/remodel-engine.png'), colour: asset('/partners/remodel-engine-colour.png'), width: 634, height: 200, h: 30 },
  ],
};

export type EmailDesign = {
  id: string;
  title: string;
  type: string;
  desc: string;
  /** Full-length render (sharpened; 600px designs upscaled to 1200px) and a 640px-wide thumbnail. */
  src: string;
  thumb: string;
  width: number;
  height: number;
};

export const emailDesigns = {
  label: '// email design',
  title: 'Email Designs That ',
  accent: 'Get Clicked',
  sub: 'Loyalty, launch, sale and welcome emails for Shopify brands. Hover a design to open it, click to read it in full.',
  items: [
    { id: 'infuse-gold-leaf', title: 'Gold Leaf tier welcome', type: 'Loyalty flow', desc: 'A VIP tier welcome: the free-bag perk up front, benefits as numbered cards, a points-to-savings explainer and a side-by-side preview of the next tier.', src: asset('/emails/infuse-gold-leaf-welcome.webp'), thumb: asset('/emails/infuse-gold-leaf-welcome-thumb.webp'), width: 1080, height: 8187 },
    { id: 'infuse-halloween', title: 'Halloween Buy 1, Get 1', type: 'Seasonal campaign', desc: 'A themed sale launch with a bold BOGO headline, the offer explained in one card, a “why Infuse” product story and free express shipping as the closer.', src: asset('/emails/infuse-halloween-bogo.webp'), thumb: asset('/emails/infuse-halloween-bogo-thumb.webp'), width: 1080, height: 8530 },
    { id: 'infuse-teaser', title: '“Sorry we made you wait”', type: 'Campaign teaser', desc: 'An apology turned into an offer: Buy 1, Get 1 as the make-good, then a dated roadmap to the Halloween sale and Black Friday early access.', src: asset('/emails/infuse-bogo-teaser.webp'), thumb: asset('/emails/infuse-bogo-teaser-thumb.webp'), width: 1080, height: 7312 },
    { id: 'creaprime-welcome', title: 'Welcome to CreaPrime', type: 'Welcome flow · Email 1', desc: 'A bright brand welcome with best sellers and add-to-cart buttons, the benefits of daily creatine, customer reviews and a simple routine section.', src: asset('/emails/creaprime-welcome.webp'), thumb: asset('/emails/creaprime-welcome-thumb.webp'), width: 1200, height: 13388 },
    { id: 'creaprime-how-to-start', title: 'How to start', type: 'Welcome flow · Email 3', desc: 'An education email that shows new customers how to take creatine every day, built to get the first scoop in and the reorder after it.', src: asset('/emails/creaprime-how-to-start.webp'), thumb: asset('/emails/creaprime-how-to-start-thumb.webp'), width: 1200, height: 11690 },
    { id: 'creaprime-difference', title: 'The CreaPrime difference', type: 'Welcome flow · Email 4', desc: 'The brand story email: the full product range, what sets the formula apart and the proof points that move a subscriber to buy.', src: asset('/emails/creaprime-difference.webp'), thumb: asset('/emails/creaprime-difference-thumb.webp'), width: 1200, height: 11760 },
    { id: 'fly-by-jing', title: '6 minutes to Sichuan', type: 'Product launch', desc: 'A new-noodles launch in a loud, on-brand palette: a hero promise, two products side by side, quick product badges and a lifestyle close.', src: asset('/emails/fly-by-jing-launch.webp'), thumb: asset('/emails/fly-by-jing-launch-thumb.webp'), width: 1200, height: 9532 },
  ] satisfies EmailDesign[],
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company?: string;
  /** Square headshot in public/testimonials (shown as a round avatar). */
  photo?: string;
};

export const testimonials = {
  label: '// testimonials',
  title: 'What Founders ',
  accent: 'Say',
  sub: 'A few words from founders I’ve worked with.',
  /**
   * Each quote must be approved by the person it's attributed to before the site goes live.
   * While the list is empty the section shows the "references on request" card below instead.
   */
  items: [
    {
      quote:
        'Bobby set up our Klaviyo flows and designed our emails, and they actually sound like us. I barely have to change anything he sends over.',
      name: 'Michael Blumen',
      role: 'Founder',
      company: 'Primal Krisp',
      photo: asset('/testimonials/michael-blumen.webp'),
    },
    {
      quote:
        'Easy to work with. Bobby tests everything before it goes live and tells you straight away if something won’t work. I’ve handed him a few messy builds and he sorted every one.',
      name: 'Kai Stone',
      role: 'Founder',
      company: 'Stone Systems',
      photo: asset('/testimonials/kai-stone.webp'),
    },
    {
      quote:
        'Bobby helped with our Shopify store and our Klaviyo emails. He asks good questions, keeps me updated and gets things done on time. I’d work with him again.',
      name: 'Trent Hinde',
      role: 'Founder',
      company: 'Capsule Factory Nutraceuticals',
      photo: asset('/testimonials/trent-hinde.webp'),
    },
    {
      quote:
        'Bobby redid our welcome emails so they feel helpful, not salesy, which matters a lot for a health brand. Quick to reply and easy to talk to.',
      name: 'Dr. Dan',
      role: 'Founder',
      company: 'Elevation Health',
      photo: asset('/testimonials/dr-dan.webp'),
    },
  ] as Testimonial[],
  empty: {
    title: 'References available on request',
    desc: 'Ask, and I’ll share contacts from my recent Klaviyo and Shopify roles so you can hear it from them directly.',
    cta: 'Request a reference',
  },
};

export const contact = {
  label: '// get in touch',
  title: 'Let’s ',
  accent: 'Connect',
  sub: 'A flow to build, a store to customize or a Klaviyo account to clean up? Pick a time that suits you, or message me wherever you are.',
  bookCta: 'Book a 30-min call',
  bookNote: 'Opens my Calendly',
  note: 'Based in Butuan City, Philippines · Working with brands remotely',
};
