import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { routes } from './routes';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

export const AnimatedRoutes = () => {
  const location = useLocation();
  
  const scrollToTop = (type: "smooth" | "instant") => {
    const scrollContainer = document.querySelector(".overflow-y-scroll");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: type });
    }
  };

  useEffect(() => {
    // Scroll to top after half the animation duration (0.075s)
    const timeout = setTimeout(() => {
      scrollToTop("instant");
    }, 150);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <route.component />
              </motion.div>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
};