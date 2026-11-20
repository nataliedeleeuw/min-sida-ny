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
  aboutDetail: "/images/about-workspace.png",
  portrait: "/images/about-portrait.webp",
  closing: "/images/closing-ink.png",
  weather: "/images/project-weather.png",
  todo: "/images/project-todo.png",
  oldPortfolio: "/images/project-original-portfolio.png",
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

function Photo({
  src,
  label,
  className = "",
  alt = "",
}) {
  const [loadedSrc, setLoadedSrc] = useState(null);
const loaded = Boolean(src) && loadedSrc === src;

  return (
    <div
      className={`editorial-photo ${className} ${
        loaded ? "has-image" : "no-image"
      }`}
    >
      <img
        src={src}
        alt={alt}
        loading={
  className.includes("hero") || className.includes("tile-photo")
    ? "eager"
    : "lazy"
}
        onLoad={() => setLoadedSrc(src)}
onError={() => setLoadedSrc(null)}
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

  const closeMenu = () => setMenuOpen(false);

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
          <NavLink
            to="/"
            end
            className={classFor}
            onClick={closeMenu}
          >
            Hem
          </NavLink>

          <NavLink
            to="/projekt"
            className={classFor}
            onClick={closeMenu}
          >
            Projekt
          </NavLink>
        </div>

        <Link
          to="/"
          className="brand"
          aria-label={`${NAMN}, till startsidan`}
          onClick={closeMenu}
        >
          <span className="brand-name">{NAMN}</span>

          <span className="brand-subtitle">
            <i />
            Tech Trainee
            <i />
          </span>
        </Link>

        <div className="nav-side nav-side-right">
          <NavLink
            to="/om-mig"
            className={classFor}
            onClick={closeMenu}
          >
            Om mig
          </NavLink>

          <NavLink
            to="/kontakt"
            className={classFor}
            onClick={closeMenu}
          >
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
  rel="noopener noreferrer"
  aria-label="GitHub-profil"
>
  GitHub
</a>


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


function ProjectTile({ project, shortTitle = false }) {
  const isExternal = Boolean(project.live);

  const TileLink = isExternal ? "a" : Link;

  const linkProps = isExternal
    ? {
        href: project.live,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {
        to: `/projekt/${project.id}`,
      };

  return (
    <TileLink className="project-tile" {...linkProps}>
      <Photo
        src={project.bild}
        label={`Projektbild: ${project.titel}`}
        className="tile-photo"
      />

      <div className="tile-caption">
        <div>
          <h3>
            {shortTitle && project.id === "1"
              ? "Min första portfolio"
              : project.titel}
          </h3>

          <p>{project.text}</p>
        </div>

        <span className="tile-arrow" aria-hidden="true">
          ⟶
        </span>
      </div>
    </TileLink>
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

  const featured = [
    PROJEKT.find((p) => p.id === "1"),
    PROJEKT.find((p) => p.id === "3"),
  ].filter(Boolean);

  return (
    <main className="home-personal">
      <style>{STARTSIDA_STIL}</style>

      <section className="home-hero" aria-labelledby="home-heading">
        <Photo
         src={HERO_OPTIONS[0]}
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
      Det här har jag <em>byggt.</em>
    </h2>
  </div>

  <div className="featured-grid">
    {featured.map((project) => (
      <ProjectTile
  key={project.id}
  project={project}
  shortTitle
/>
    ))}
  </div>

  <Link
    className="subtle-link subtle-link-dark featured-more"
    to="/projekt"
  >
    Se alla projekt
    <span aria-hidden="true">↗</span>
  </Link>
</section>


      <section className="closing-statement">
        <Photo
          src={BILDER.closing}
          label="Abstrakt avslutande bild"
          className="closing-backdrop"
        />
      </section>
    </main>
  );
}



function About() {
  return (
    <main className="interior-page about-page about-editorial">
      <header className="about-editorial-hero">
        <Eyebrow>Om mig</Eyebrow>

        <h1>Hej, jag heter Natalie.</h1>

        <p className="about-editorial-lead">
          Jag skriver berättelser, pluggar psykologi och
          har nyligen gett mig på programmering.
        </p>
      </header>

      <section
        className="about-editorial-story"
        aria-label="Lite mer om mig"
      >
        <div className="about-editorial-side">
          <img
            src="/images/natalie-svartvit.png"
            alt="Svartvitt porträtt av Natalie"
            className="about-small-portrait"
            loading="lazy"
          />
        </div>

        <div className="about-editorial-copy">
          <p>
            Jag har alltid tyckt om att skriva berättelser.
            Psykologi är ett annat stort intresse, särskilt
            hur människor tänker och fungerar. Det är två
            områden där jag lätt kan fastna i detaljer
            i flera timmar.
          </p>

          <p>
            Nu studerar jag programmering inom Tech Trainee.
            Jag gillar att få bygga något eget och förstå
            hur det fungerar. Även om jag ibland får lägga
            orimligt mycket tid på att förstå varför
            något plötsligt slutat fungera.
          </p>

          <p>
            Jag är fortfarande i början och har mycket
            kvar att lära mig. Projekten här är sådant
            jag har byggt och experimenterat med
            under utbildningen.
          </p>
        </div>
      </section>

      <div className="about-editorial-bottom">
        <div className="about-editorial-tools">
          <Eyebrow>Det jag arbetar med just nu</Eyebrow>

          <p>
            React <span>·</span> JavaScript
            <span> · </span> CSS
            <span> · </span> Git &amp; GitHub
          </p>
        </div>

        <Link
          to="/kontakt"
          className="subtle-link subtle-link-dark"
        >
          Hör av dig
          <span aria-hidden="true">↗</span>
        </Link>
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

<h1>Mina projekt.</h1>

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
          <section className="demo-section statistics-wrapper projects-statistics">
  <Eyebrow>Projektstatistik</Eyebrow>

  <h2>Teknikerna i mina projekt</h2>

  <p>
    En sammanställning av vilka tekniker
    jag har använt i projekten hittills.
  </p>

  <Statistik />
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
      <div className="contact-panel">

        <div className="contact-intro">
          <Eyebrow>Kontakt</Eyebrow>

          <h1>Skriv till mig.</h1>

          <p>
            Du kan använda formuläret nedan eller mejla mig
            direkt på{" "}
            <a href={`mailto:${EPOST}`}>{EPOST}</a>.
          </p>
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

              <button
                className="editorial-button"
                disabled={sending}
                type="submit"
              >
                {sending ? "Skickar…" : "Skicka meddelande"}
                <span aria-hidden="true">↗</span>
              </button>
            </form>
          )}
        </div>

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