import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, initSmoothScroll, prefersReduced } from './lib/motion';
import Nav from './components/Nav';
import Hero from './components/Hero';
import LogoStrip from './components/LogoStrip';
import Features from './components/Features';
import Metrics from './components/Metrics';
import Product from './components/Product';
import Tiers from './components/Tiers';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function App() {
  useLayoutEffect(() => {
    const cleanupScroll = initSmoothScroll();
    if (prefersReduced) return cleanupScroll;

    // generic reveals: fade + rise + blur-to-focus
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 44, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 58%',
              scrub: 0.8,
            },
          }
        );
      });
    });

    // fonts/pins settle after first paint
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      clearTimeout(refresh);
      ctx.revert();
      cleanupScroll();
    };
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoStrip />
        <Features />
        <Metrics />
        <Product />
        <Tiers />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
