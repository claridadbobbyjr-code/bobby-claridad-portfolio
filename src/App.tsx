import { MotionConfig, useReducedMotion } from 'framer-motion';
import { BackToTop } from './components/BackToTop';
import { Backdrop } from './components/Backdrop';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ScrollProgress } from './components/ScrollProgress';
import { useLenis } from './hooks/useLenis';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { EmailDesigns } from './sections/EmailDesigns';
import { Experience } from './sections/Experience';
import { Hero } from './sections/Hero';
import { Klaviyo } from './sections/Klaviyo';
import { Partners } from './sections/Partners';
import { Process } from './sections/Process';
import { Projects } from './sections/Projects';
import { Services } from './sections/Services';
import { Storefront } from './sections/Storefront';
import { Testimonials } from './sections/Testimonials';

/**
 * Page order follows the six menu links (About → Services → Experience → Projects →
 * Testimonials → Contact). Klaviyo, Shopify and Process sit inside the Services stretch,
 * so the "Services" link stays highlighted while they are on screen.
 */
export default function App() {
  const reduced = useReducedMotion();
  useLenis(!reduced);
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Backdrop />
      <Navbar />
      <main id="main" className="relative z-10">
        <Hero />
        <Partners />
        <About />
        <Services />
        <Klaviyo />
        <Storefront />
        <Process />
        <Experience />
        <Projects />
        <EmailDesigns />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </MotionConfig>
  );
}
