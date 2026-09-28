import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import Lenis from 'lenis';
import { lazy, Suspense, useEffect, useRef, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header, MobileNav } from './components/Navigation';
import { Footer } from './components/Footer';
import { SearchOverlay } from './components/SearchOverlay';
import { PrefsProvider, UIProvider, useUI } from './lib/app-state';
import { useDocumentMeta } from './lib/use-document-meta';
import Home from './pages/Home';

const Menu = lazy(() => import('./pages/Menu'));
const Product = lazy(() => import('./pages/Product'));
const Cakes = lazy(() => import('./pages/Cakes'));
const Visit = lazy(() => import('./pages/Visit'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Buttery wheel scrolling on desktop; native momentum scrolling stays on touch devices. */
function useSmoothScroll(paused: boolean) {
  const lenis = useRef<Lenis | null>(null);
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    lenis.current = new Lenis({ autoRaf: true, lerp: 0.11 });
    return () => { lenis.current?.destroy(); lenis.current = null; };
  }, []);
  useEffect(() => {
    if (paused) lenis.current?.stop();
    else lenis.current?.start();
  }, [paused]);
}

function Page({ children }: { children: ReactNode }) {
  return (
    <motion.main
      id="main"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}

function Shell() {
  const location = useLocation();
  const { searchOpen } = useUI();

  useSmoothScroll(searchOpen);
  useDocumentMeta(location.pathname);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg">
        Skip to content
      </a>
      <Header />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <Page key={location.pathname}>
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:category" element={<Menu />} />
              <Route path="/producto/:id" element={<Product />} />
              <Route path="/pasteles" element={<Cakes />} />
              <Route path="/visitanos" element={<Visit />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </Page>
      </AnimatePresence>

      <MobileNav />
      <SearchOverlay />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <PrefsProvider>
        <UIProvider>
          <Shell />
        </UIProvider>
      </PrefsProvider>
    </MotionConfig>
  );
}
