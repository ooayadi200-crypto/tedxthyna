import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useCallback, useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { Cursor } from "./components/site/Cursor";
import { IntroContext } from "./components/site/intro";
import { Nav } from "./components/site/Nav";
import { Preloader } from "./components/site/Preloader";
import { SmoothScroll } from "./components/site/SmoothScroll";
import Home from "./pages/Home";
import { EVENT } from "./data/site";
import { useEffect } from "react";

function RegisterRedirect() {
  useEffect(() => {
    window.location.replace(EVENT.registerUrl);
  }, []);
  return <div className="page-fallback" />;
}

const Mission = lazy(() => import("./pages/Mission"));
const Speakers = lazy(() => import("./pages/Speakers"));
const Organization = lazy(() => import("./pages/Organization"));
const Scene = lazy(() => import("./pages/Scene"));
const Agenda = lazy(() => import("./pages/Agenda"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const INTRO_KEY = "tedx-thyna-intro-seen";

function shouldPlayIntro() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return window.location.pathname === "/" && !sessionStorage.getItem(INTRO_KEY);
  } catch {
    return window.location.pathname === "/";
  }
}

function Routes() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<div className="page-fallback" />} key={location}>
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/mission" component={Mission} />
          <Route path="/speakers" component={Speakers} />
          <Route path="/minds" component={Speakers} />
          <Route path="/voices" component={Speakers} />
          <Route path="/organization" component={Organization} />
          <Route path="/scene" component={Scene} />
          <Route path="/agenda" component={Agenda} />
          <Route path="/register" component={RegisterRedirect} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  const [intro, setIntro] = useState(shouldPlayIntro);
  const [revealed, setRevealed] = useState(() => !intro);
  const reveal = useCallback(() => setRevealed(true), []);
  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    setIntro(false);
  }, []);

  return (
    <ErrorBoundary>
      <SmoothScroll>
        <IntroContext.Provider value={revealed}>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          {intro && <Preloader onReveal={reveal} onDone={finish} />}
          <Cursor />
          <div className="grain" aria-hidden />
          <Nav />
          <div id="main">
            <Routes />
          </div>
        </IntroContext.Provider>
      </SmoothScroll>
    </ErrorBoundary>
  );
}
