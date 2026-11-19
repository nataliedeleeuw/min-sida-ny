import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

import projektLista from "./Data/Projekt.json";
import {
  EPOST,
  NAMN,
  GITHUB_ANVANDARE,
} from "./Data/installningar";

import Todo from "./components/Todo";
import Vader from "./components/Vader";
import CityWeather from "./components/CityWeather";
import Statistik from "./components/Statistik";
import GitHubRepon from "./components/GitHubRepon";
import FizzBuzz from "./pages/FizzBuzz";
import MinServer from "./components/MinServer";
import KontaktBackend from "./components/KontaktBackend";
import AdminMeddelanden from "./components/AdminMeddelanden";

import "./Portfolio.css";

const HERO_OPTIONS = [
  "/images/hero-chalkboard-final.png",
  "/images/hero-option-2.png",
  "/images/hero-option-3.png",
];

const BILDER = {
  aboutDetail: "/images/about-writing.png",
  portrait: "/images/about-portrait.webp",
  closing: "/images/closing-ink.png",
  weather: "/images/project-weather.webp",
  todo: "/images/project-todo.webp",
  oldPortfolio: "/images/project-original-portfolio.webp",
};

const PROJEKT = projektLista
  .filter((projekt) => projekt.id !== 4)
  .map((projekt) => {
    const meta = {
      1: {
        kategori: "Portfolio / React",
        bild: BILDER.oldPortfolio,
        live: "https://min-sida-experiment.vercel.app/",
      },
      2: {
        kategori: "Interaktiv funktion",
        bild: BILDER.todo,
      },
      3: {
        kategori: "Webbapplikation / API",
        bild: BILDER.weather,
      },
    }[projekt.id] || {
      kategori: "Utveckling",
      bild: "",
    };

    return {
      id: String(projekt.id),
      titel: projekt.titel,
      text: projekt.text,
      teknik: projekt.teknik,
      demo: projekt.demo || "",
      lank: projekt.lank?.startsWith("https://")
        ? projekt.lank
        : "",
      ...meta,
    };
  });

function Icon({ name, size = 34 }) {
  const shared = {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "code") {
    return (
      <svg {...shared}>
        <path d="m17 15-9 9 9 9M31 15l9 9-9 9M28 10l-8 28" />
      </svg>
    );
  }

  if (name === "pencil") {
    return (
      <svg {...shared}>
        <path d="M29 8 40 19 17 42 6 43 8 32 29 8ZM25 13l10 10M8 32l9 10M11 37l3 3" />
      </svg>
    );
  }

  if (name === "layers") {
    return (
      <svg {...shared}>
        <path d="m24 7 18 10-18 10L6 17 24 7ZM6 24l18 10 18-10M6 31l18 10 18-10" />
      </svg>
    );
  }

  if (name === "light") {
    return (
      <svg {...shared}>
        <path
          d="M17 31c0-5-7-7-7-16a14 14 0 0 1 28 0c0 9-7 11-7 16M18 36h12M20 41h8M23 4V1M5 14H2M46 14h-3M9 5 6 2M39 5l3-3"
          transform="translate(0 3) scale(.96)"
        />
      </svg>
    );
  }

  return null;
}

function Photo({
  src,
  label,
  className = "",
  alt = "",
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div
      className={`editorial-photo ${className} ${
        loaded ? "has-image" : "no-image"
      }`}
    >
      <img
        src={src}
        alt={alt}
        loading={className.includes("hero") ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />

      {!loaded && (
        <span className="photo-placeholder" aria-hidden="true">
          <span className="photo-placeholder-line" />
          {label}
        </span>
      )}
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const classFor = ({ isActive }) =>
    isActive ? "nav-item is-active" : "nav-item";

  return (
    <header className="site-header">
      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
      >
        {menuOpen ? "Stäng" : "Meny"}
      </button>

      <nav
        id="site-navigation"
        className={`header-nav ${menuOpen ? "mobile-open" : ""}`}
        aria-label="Huvudmeny"
      >
        <div className="nav-side nav-side-left">
          <NavLink to="/" end className={classFor}>
            Hem
          </NavLink>

          <NavLink to="/projekt" className={classFor}>
            Projekt
          </NavLink>
        </div>

        <Link
          to="/"
          className="brand"
          aria-label={`${NAMN}, till startsidan`}
        >
          <span className="brand-name">{NAMN}</span>

          <span className="brand-subtitle">
            <i />
            Tech Trainee
            <i />
          </span>
        </Link>

        <div className="nav-side nav-side-right">
          <NavLink to="/om-mig" className={classFor}>
            Om mig
          </NavLink>

          <NavLink to="/kontakt" className={classFor}>
            Kontakt
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-name">
        <Link to="/">{NAMN}</Link>
        <span>Tech Trainee</span>
      </div>

      <nav className="footer-links" aria-label="Sidfotsmeny">
        <Link to="/">Hem</Link>
        <Link to="/projekt">Projekt</Link>
        <Link to="/om-mig">Om mig</Link>
        <Link to="/kontakt">Kontakt</Link>
      </nav>

      <div className="footer-socials">
        <a
          href={`https://github.com/${GITHUB_ANVANDARE}`}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .8A11.2 11.2 0 0 0 8.46 22.6c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.33-3.76-1.33-.5-1.27-1.22-1.22-1.6-1-.68.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.99 1.7 2.6 1.2 3.23.9.1-.72.39-1.2.71-1.48-2.47-.28-5.07-1.24-5.07-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.14A10.7 10.7 0 0 1 12 6.64c.95 0 1.9.13 2.8.38 2.14-1.44 3.07-1.14 3.07-1.14.61 1.54.23 2.68.12 2.96.72.78 1.14 1.78 1.14 3.01 0 4.3-2.61 5.24-5.1 5.52.4.35.75 1.03.75 2.08v2.6c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
          </svg>
        </a>

        <span
          className="linkedin-placeholder"
          title="LinkedIn-länk kan läggas till senare"
          aria-label="LinkedIn-länk tillkommer"
        >
          in
        </span>
      </div>
    </footer>
  );
}

function Eyebrow({ children, light = false }) {
  return (
    <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>
      {children}
      <span className="eyebrow-rule" />
    </p>
  );
}

function ProjectTile({ project }) {
  return (
    <Link className="project-tile" to={`/projekt/${project.id}`}>
      <Photo
        src={project.bild}
        label={`Projektbild: ${project.titel}`}
        className="tile-photo"
      />

      <div className="tile-caption">
        <div>
          <h3>{project.titel}</h3>
          <p>{project.text}</p>
        </div>

        <span className="tile-arrow" aria-hidden="true">
          ⟶
        </span>
      </div>
    </Link>
  );
}

const STARTSIDA_STIL = `
  .home-personal .home-headline-card {
    background: linear-gradient(142deg, #f5f0eb, #e9e1db);
  }

  .home-personal .home-headline-card h1 {
    max-width: 430px;
  }

  .home-personal .pencil-em {
    font-weight: 400;
    position: relative;
    white-space: nowrap;
    background-image:
      linear-gradient(
        177deg,
        transparent 72%,
        rgba(69, 72, 73, .42) 73%,
        rgba(69, 72, 73, .42) 75%,
        transparent 76%
      ),
      linear-gradient(
        182deg,
        transparent 82%,
        rgba(69, 72, 73, .24) 83%,
        rgba(69, 72, 73, .24) 85%,
        transparent 86%
      );
    background-position: left bottom, left bottom;
    background-repeat: no-repeat;
    background-size: 100% 17px, 100% 11px;
    padding-bottom: 2px;
  }

  .home-personal .draft-signature {
    position: absolute;
    left: 43px;
    bottom: 17px;
    display: flex;
    align-items: center;
    gap: 13px;
    color: rgba(56, 55, 52, .72);
    font: italic 400 18px/1.1 var(--display);
    transform: rotate(-3deg);
    pointer-events: none;
  }

  .home-personal .draft-signature svg {
    width: 61px;
    height: 17px;
    overflow: visible;
  }

  .home-personal .hero-switcher {
    position: absolute;
    left: 0;
    bottom: -58px;
    display: flex;
    gap: 8px;
    z-index: 6;
  }

  .home-personal .hero-switcher button {
    border: 1px solid rgba(244, 239, 232, 0.35);
    background: rgba(23, 28, 34, 0.78);
    color: rgba(244, 239, 232, 0.92);
    padding: 8px 12px;
    font: 500 12px/1 var(--sans);
    letter-spacing: .16em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background .2s ease, border-color .2s ease, color .2s ease;
  }

  .home-personal .hero-switcher button:hover {
    background: rgba(34, 40, 47, 0.94);
  }

  .home-personal .hero-switcher button.active {
    background: rgba(236, 232, 227, 0.92);
    color: #1f2328;
    border-color: rgba(236, 232, 227, 0.92);
  }

  .home-personal .home-about-photo::after {
    content: "";
    position: absolute;
    z-index: 3;
    top: 18px;
    right: 18px;
    width: 35px;
    border-top: 1px solid rgba(233, 226, 216, .48);
    transform: rotate(-8deg);
    pointer-events: none;
  }

  .home-personal .home-about-copy > p {
    max-width: 595px;
  }

  .home-personal .featured-intro h2 em {
    font-weight: 400;
    text-decoration: underline;
    text-decoration-color: rgba(72, 72, 70, .42);
    text-decoration-thickness: 1px;
    text-underline-offset: 7px;
  }

  .home-personal .project-tile .tile-caption h3 {
    display: inline-block;
    position: relative;
  }

  .home-personal .project-tile .tile-caption h3::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    border-bottom: 1px solid currentColor;
    opacity: .55;
    transform: rotate(-1deg) scaleX(0);
    transform-origin: left;
    transition: transform .28s ease;
  }

  .home-personal .project-tile:hover .tile-caption h3::after,
  .home-personal .project-tile:focus-visible .tile-caption h3::after {
    transform: rotate(-1deg) scaleX(1);
  }

  .home-personal .closing-statement blockquote {
    max-width: 490px;
  }

  @media (max-width: 1100px) {
    .home-personal .draft-signature {
      left: 34px;
      bottom: 13px;
    }

    .home-personal .hero-switcher {
      position: static;
      margin-top: 18px;
      flex-wrap: wrap;
    }
  }

  @media (max-width: 560px) {
    .home-personal .draft-signature {
      display: none;
    }

    .home-personal .pencil-em {
      white-space: normal;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .home-personal .project-tile .tile-caption h3::after {
      transition: none;
    }
  }
`;

function Home() {
  const [heroIndex, setHeroIndex] = useState(0);

  const featured = [
    PROJEKT.find((p) => p.id === "1"),
    PROJEKT.find((p) => p.id === "3"),
  ].filter(Boolean);

  return (
    <main className="home-personal">
      <style>{STARTSIDA_STIL}</style>

      <section className="home-hero" aria-labelledby="home-heading">
        <Photo
          src={HERO_OPTIONS[heroIndex]}
          label="Monokrom hero-bild"
          className="hero-backdrop"
        />

        <div className="home-headline-card">
          <Eyebrow>Portfölj</Eyebrow>

          <h1 id="home-heading">
  Ord och kod.
  <br />
  Två sätt att{" "}
  <del className="crossed-thought">bli galen</del>{" "}
  <em className="pencil-em">skapa.</em>
</h1>

          <div className="draft-signature" aria-hidden="true">
            <svg
              viewBox="0 0 90 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            >
              <path d="M2 10 Q19 6 36 11 T68 10 Q78 9 88 10" />
              <path d="M10 15 Q30 13 47 15" opacity=".5" />
            </svg>

            <span>utkast pågår</span>
          </div>

        </div>

        <div className="home-hero-caption">
          <Eyebrow light>Tech Trainee</Eyebrow>

          <p>
            Jag har alltid älskat att skriva. Nu lär jag mig programmera
            också. Båda kräver kreativitet, problemlösning och att ändra sig
            sjutton gånger.
          </p>
        </div>
      </section>

      <section className="home-about" aria-labelledby="about-heading">
        <Photo
          src={BILDER.aboutDetail}
          label="Fotografi: abstrakt bild för om mig"
          className="home-about-photo"
        />

        <div className="home-about-copy">
          <h2 id="about-heading" className="serif-section-title italic-heading">
            Om mig
            <span className="heading-line" />
          </h2>

          <p>
            Jag heter Natalie och gillar att förstå hur saker fungerar. Jag
            skriver berättelser, pluggar programmering och har en tendens att
            bli väldigt engagerad när något fångar mitt intresse.
          </p>

          <div className="strengths" aria-label="Mina intresseområden">
            <div>
              <Icon name="pencil" />
              <span>Skrivande</span>
            </div>

            <div>
              <Icon name="code" />
              <span>Kod</span>
            </div>

            <div>
              <Icon name="layers" />
              <span>Projekt</span>
            </div>

            <div>
              <Icon name="light" />
              <span>Idéer</span>
            </div>
          </div>

          <Link to="/om-mig" className="subtle-link">
            Läs mer om mig
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="home-projects" aria-labelledby="featured-heading">
        <div className="featured-intro">
          <Eyebrow>Utvalda projekt</Eyebrow>

          <h2 id="featured-heading" className="serif-section-title">
            Små idéer som <em>blivit kod.</em>
          </h2>

          <p>
            Här finns några saker jag byggt medan jag lär mig programmera. En
            del började som övningar. Andra började med att jag ville testa en
            idé.
          </p>

          <Link className="subtle-link subtle-link-dark" to="/projekt">
            Se alla projekt
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="featured-grid">
          {featured.map((project) => (
            <ProjectTile key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="closing-statement">
        <Photo
          src={BILDER.closing}
          label="Abstrakt avslutande bild"
          className="closing-backdrop"
        />

        <blockquote>
          Bra lösningar brukar börja med att något skaver lite.
        </blockquote>

        <span className="statement-rule" aria-hidden="true" />
      </section>
    </main>
  );
}

function About() {
  return (
    <main className="interior-page about-page">
      <div className="page-heading">
        <Eyebrow>Bakom skärmen</Eyebrow>

        <h1>
          Nyfiken av naturen.
          <br />
          <em>Utvecklare på väg.</em>
        </h1>
      </div>

      <div className="about-layout">
        <Photo
          src={BILDER.portrait}
          label="Ditt porträtt placeras här, endast på Om mig-sidan"
          className="portrait-photo"
          alt="Porträtt av Natalie de Leeuw"
        />

        <div className="about-body">
          <h2 className="serif-section-title">Hej, jag heter Natalie.</h2>

          <p>
            Jag tycker om att lära mig nya saker och förstå varför de fungerar.
            Mitt intresse rör sig mellan psykologi, skrivande och teknik, och
            just nu läser jag programmering inom Tech Trainee.
          </p>

          <p>
            Jag trivs när jag får kombinera struktur och kreativitet: förstå
            ett problem, utforska olika lösningar och sedan bygga något som
            faktiskt går att använda.
          </p>

          <p>
            För mig handlar bra digitala upplevelser inte bara om att något
            fungerar. Det ska också vara lätt att förstå, behagligt att använda
            och genomtänkt från början till slut.
          </p>

          <div className="about-detail-box">
            <Eyebrow>Verktyg jag arbetar med</Eyebrow>

            <ul className="skill-list">
              <li>React</li>
              <li>JavaScript</li>
              <li>CSS</li>
              <li>Git &amp; GitHub</li>
            </ul>
          </div>

          <Link to="/kontakt" className="editorial-button">
            Kontakta mig
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

function Projects() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Alla");
  const [order, setOrder] = useState("featured");
  const [showGitHub, setShowGitHub] = useState(false);

  const categories = [
    "Alla",
    ...new Set(PROJEKT.flatMap((p) => p.teknik)),
  ];

  const visibleProjects = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("sv");

    const result = PROJEKT.filter(
      (p) =>
        (category === "Alla" || p.teknik.includes(category)) &&
        `${p.titel} ${p.text} ${p.kategori}`
          .toLocaleLowerCase("sv")
          .includes(term)
    );

    if (order === "alphabetical") {
      result.sort((a, b) => a.titel.localeCompare(b.titel, "sv"));
    }

    if (order === "technologies") {
      result.sort((a, b) => b.teknik.length - a.teknik.length);
    }

    return result;
  }, [query, category, order]);

  return (
    <main className="interior-page projects-page">
      <div className="page-heading project-page-heading">
        <Eyebrow>Utvalda arbeten och övningar</Eyebrow>

        <h1>
          Från tanke till <em>fungerande lösning.</em>
        </h1>

        <p>
          Ett urval av det jag bygger, testar och lär mig inom webbutveckling.
        </p>
      </div>

      <section className="all-projects" aria-label="Projektöversikt">
        <div className="projects-toolbar">
          <label>
            Sök projekt
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Projektnamn eller beskrivning"
            />
          </label>

          <label>
            Filtrera efter teknik
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          <label>
            Ordning
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="featured">Utvalda först</option>
              <option value="alphabetical">Namn A–Ö</option>
              <option value="technologies">Flest tekniker först</option>
            </select>
          </label>
        </div>

        <p className="result-count" aria-live="polite">
          Visar {visibleProjects.length} av {PROJEKT.length} projekt
        </p>

        {visibleProjects.length ? (
          <div className="all-projects-grid">
            {visibleProjects.map((p) => (
              <ProjectTile key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <p className="empty-results">
            Inga projekt matchar sökningen. Prova ett annat sökord eller filter.
          </p>
        )}
      </section>

      <section className="github-panel">
        <div>
          <Eyebrow>Bakom kulisserna</Eyebrow>

          <h2>Nyfiken på koden?</h2>

          <p>
            Se mina publika projekt och senaste uppdateringar på GitHub.
          </p>
        </div>

        <button
          className="editorial-button"
          type="button"
          onClick={() => setShowGitHub((s) => !s)}
          aria-expanded={showGitHub}
        >
          {showGitHub ? "Dölj GitHub-aktivitet" : "Visa GitHub-aktivitet"}
          <span aria-hidden="true">↗</span>
        </button>

        {showGitHub && (
          <div className="github-panel-content">
            <GitHubRepon />
          </div>
        )}
      </section>
    </main>
  );
}

function ProjectDetail() {
  const { id } = useParams();
  const project = PROJEKT.find((p) => p.id === id);
  const [weatherMode, setWeatherMode] = useState("cities");

  if (!project) {
    return <NotFound />;
  }

  return (
    <main className="interior-page detail-page">
      <Link to="/projekt" className="back-link">
        ← Tillbaka till projekten
      </Link>

      <Eyebrow>{project.kategori}</Eyebrow>

      <h1>{project.titel}</h1>

      <p className="detail-lead">{project.text}</p>

      <Photo
        src={project.bild}
        label={`Bild för projektet ${project.titel}`}
        className="detail-photo"
      />

      {(project.demo === "todo" || project.demo === "vader") && (
        <section className="demo-section">
          <Eyebrow>Prova själv</Eyebrow>

          {project.demo === "todo" && <Todo />}

          {project.demo === "vader" && (
            <>
              <div
                className="demo-choice"
                role="group"
                aria-label="Välj vädervy"
              >
                <button
                  type="button"
                  className={weatherMode === "cities" ? "chosen" : ""}
                  aria-pressed={weatherMode === "cities"}
                  onClick={() => setWeatherMode("cities")}
                >
                  Jämför städer
                </button>

                <button
                  type="button"
                  className={weatherMode === "single" ? "chosen" : ""}
                  aria-pressed={weatherMode === "single"}
                  onClick={() => setWeatherMode("single")}
                >
                  Välj en stad
                </button>
              </div>

              {weatherMode === "cities" ? <Vader /> : <CityWeather />}
            </>
          )}
        </section>
      )}

      {id === "1" && (
        <section className="demo-section statistics-wrapper">
          <Eyebrow>Bakom kulisserna</Eyebrow>

          <h2>Teknikerna i projekten</h2>

          <p>
            En liten statistikövning som räknar hur många projekt som använder
            olika tekniker.
          </p>

          <Statistik />
        </section>
      )}

      <div
        style={{
          display: "flex",
          gap: "14px",
          flexWrap: "wrap",
          marginTop: "24px",
        }}
      >
        {project.live && (
          <a
            className="editorial-button"
            href={project.live}
            target="_blank"
            rel="noreferrer"
          >
            Besök webbplatsen
            <span aria-hidden="true">↗</span>
          </a>
        )}

        {project.lank && (
          <a
            className="editorial-button"
            href={project.lank}
            target="_blank"
            rel="noreferrer"
          >
            Se projektets kod
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>

      <div className="detail-technologies">
        <Eyebrow>Teknik och arbetssätt</Eyebrow>

        <ul>
          {project.teknik.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}

const FORM_ENDPOINT = "https://formspree.io/f/xzeeggbe";
const MAX_MESSAGE = 500;

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();

    if (sending) return;

    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Fyll i alla fält innan du skickar.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Kontrollera e-postadressen.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          namn: name.trim(),
          email: email.trim(),
          meddelande: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSent(true);
    } catch {
      setError("Meddelandet kunde inte skickas. Försök igen om en stund.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="interior-page contact-page">
      <div className="contact-intro">
        <Eyebrow>Säg hej</Eyebrow>

        <h1>
          Har du en idé?
          <br />
          <em>Hör av dig.</em>
        </h1>

        <p>
          Jag tycker om nya perspektiv, intressanta frågor och människor som
          vill skapa något användbart.
        </p>

        <p>
          Fyll i formuläret eller mejla mig direkt på{" "}
          <a href={`mailto:${EPOST}`}>{EPOST}</a>.
        </p>

        <div className="contact-decor" aria-hidden="true">
          <span>
            Let’s make
            <br />
            <em>something work.</em>
          </span>
        </div>
      </div>

      <div className="contact-card">
        {sent ? (
          <div className="contact-success" role="status">
            <Eyebrow>Meddelandet är skickat</Eyebrow>

            <h2>Tack, {name}!</h2>

            <p>Jag återkommer så snart jag kan.</p>

            <button
              className="editorial-button"
              type="button"
              onClick={() => {
                setSent(false);
                setName("");
                setEmail("");
                setMessage("");
              }}
            >
              Skicka ett nytt meddelande
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <Eyebrow>Kontaktformulär</Eyebrow>

            <h2>Skriv ett meddelande</h2>

            <label htmlFor="contact-name">
              Namn
              <input
                id="contact-name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                placeholder="Ditt namn"
              />
            </label>

            <label htmlFor="contact-email">
              E-post
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={150}
                required
                placeholder="namn@exempel.se"
              />
            </label>

            <label htmlFor="contact-message">
              Meddelande
              <textarea
                id="contact-message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={MAX_MESSAGE}
                required
                placeholder="Vad vill du berätta?"
              />
            </label>

            <p className="characters-left">
              {MAX_MESSAGE - message.length} tecken kvar
            </p>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button className="editorial-button" disabled={sending} type="submit">
              {sending ? "Skickar…" : "Skicka meddelande"}
              <span aria-hidden="true">↗</span>
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="interior-page not-found">
      <Eyebrow>404</Eyebrow>

      <h1>Den här sidan finns inte.</h1>

      <Link className="editorial-button" to="/">
        Till startsidan
        <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <div className="portfolio-shell">
      <ScrollToTop />

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/om-mig" element={<About />} />
        <Route path="/projekt" element={<Projects />} />
        <Route path="/projekt/:id" element={<ProjectDetail />} />
        <Route path="/kontakt" element={<Contact />} />

        <Route
          path="/fizzbuzz"
          element={
            <main className="interior-page legacy-wrapper">
              <FizzBuzz />
            </main>
          }
        />

        {import.meta.env.DEV && (
          <>
            <Route
              path="/server"
              element={
                <main className="interior-page legacy-wrapper">
                  <MinServer />
                </main>
              }
            />

            <Route
              path="/kontakt-backend"
              element={
                <main className="interior-page legacy-wrapper">
                  <KontaktBackend />
                </main>
              }
            />

            <Route
              path="/admin-meddelanden"
              element={
                <main className="interior-page legacy-wrapper">
                  <AdminMeddelanden />
                </main>
              }
            />
          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}