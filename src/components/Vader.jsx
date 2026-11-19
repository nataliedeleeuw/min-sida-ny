
import { useEffect, useState } from "react";
import { STADER } from "../Data/stader";
import "./Vader.css";

const BAS_URL = "https://api.open-meteo.com/v1/forecast";

const formatNummer = (nummer) =>
  Number.isFinite(nummer)
    ? new Intl.NumberFormat("sv-SE", {
        maximumFractionDigits: 1,
      }).format(nummer)
    : "–";

async function hamtaStad(stad) {
  const variabler = [
    "temperature_2m",
    "apparent_temperature",
    "relative_humidity_2m",
    "wind_speed_10m",
    "weather_code",
    "is_day",
  ].join(",");

  const url = `${BAS_URL}?latitude=${stad.lat}&longitude=${stad.lon}&current=${variabler}`;

  const svar = await fetch(url);

  if (!svar.ok) {
    throw new Error("Kunde inte hämta vädret");
  }

  const data = await svar.json();

  return {
    namn: stad.namn,
    temp: data.current.temperature_2m,
    kannsSom: data.current.apparent_temperature,
    fukt: data.current.relative_humidity_2m,
    vind: data.current.wind_speed_10m,
    kod: data.current.weather_code,
    dag: data.current.is_day === 1,
  };
}

function vaderBeskrivning(kod, dag) {
  if (kod === 0) {
    return {
      text: dag ? "Klar himmel" : "Klar natt",
      typ: "klart",
    };
  }

  if ([1, 2].includes(kod)) {
    return { text: "Lätt molnighet", typ: "halvklart" };
  }

  if (kod === 3) {
    return { text: "Mulet", typ: "moln" };
  }

  if ([45, 48].includes(kod)) {
    return { text: "Dimma", typ: "dimma" };
  }

  if ([51, 53, 55, 56, 57].includes(kod)) {
    return { text: "Duggregn", typ: "regn" };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(kod)) {
    return { text: "Regn", typ: "regn" };
  }

  if ([71, 73, 75, 77, 85, 86].includes(kod)) {
    return { text: "Snöfall", typ: "sno" };
  }

  if ([95, 96, 99].includes(kod)) {
    return { text: "Åskväder", typ: "aska" };
  }

  return { text: "Varierande väder", typ: "moln" };
}

function Vadersymbol({ typ, dag }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="weather-symbol"
    >
      {typ === "klart" && (
        dag ? (
          <g>
            <circle cx="60" cy="60" r="22" />
            <path d="M60 15v13M60 92v13M15 60h13M92 60h13" />
            <path d="M28 28l10 10M82 82l10 10M92 28L82 38M38 82L28 92" />
          </g>
        ) : (
          <path d="M79 22a39 39 0 1 0 19 70A42 42 0 0 1 79 22Z" />
        )
      )}

      {typ !== "klart" && (
        <>
          {typ === "halvklart" && (
            dag ? (
              <g>
                <circle cx="43" cy="43" r="17" />
                <path d="M43 15v9M43 62v9M15 43h9M62 43h9M23 23l7 7M56 56l7 7" />
              </g>
            ) : (
              <path d="M51 17a27 27 0 1 0 12 43A30 30 0 0 1 51 17Z" />
            )
          )}

          <path d="M36 84h53a18 18 0 0 0 1-36 29 29 0 0 0-55-5 21 21 0 0 0 1 41Z" />

          {typ === "regn" && (
            <g>
              <path d="M43 94l-6 12M66 94l-6 12M89 94l-6 12" />
            </g>
          )}

          {typ === "sno" && (
            <g>
              <path d="M42 95v13M36 101h12M61 95v13M55 101h12M80 95v13M74 101h12" />
            </g>
          )}

          {typ === "aska" && (
            <path d="M65 87L51 105h13l-7 13 24-24H67l8-7" />
          )}

          {typ === "dimma" && (
            <g>
              <path d="M25 96h70M35 107h50" />
            </g>
          )}
        </>
      )}
    </svg>
  );
}

function Vaderkort({ stad, index }) {
  const beskrivning = vaderBeskrivning(stad.kod, stad.dag);

  return (
    <article
      className={`vader-kort weather-card--${beskrivning.typ}`}
    >
      <div className="weather-card-upper">
        <span className="weather-card-index">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="weather-card-category">
          AKTUELLT VÄDER
        </span>
      </div>

      <h3 className="weather-city-name">{stad.namn}</h3>

      <div className="weather-illustration">
        <div className="weather-orbit" />
        <Vadersymbol typ={beskrivning.typ} dag={stad.dag} />
      </div>

      <div className="weather-main-reading">
        <span className="weather-main-number">
          {formatNummer(stad.temp)}
        </span>
        <span className="weather-main-unit">°C</span>
      </div>

      <p className="weather-condition">
        {beskrivning.text}
      </p>

      <div className="weather-card-details">
        <div>
          <span>KÄNNS SOM</span>
          <strong>{formatNummer(stad.kannsSom)} °C</strong>
        </div>

        <div>
          <span>LUFTFUKTIGHET</span>
          <strong>{Math.round(stad.fukt)} %</strong>
        </div>

        <div>
          <span>VIND</span>
          <strong>{formatNummer(stad.vind)} km/h</strong>
        </div>
      </div>
    </article>
  );
}

export default function Vader() {
  const [vader, setVader] = useState([]);
  const [laddar, setLaddar] = useState(true);
  const [fel, setFel] = useState("");
  const [uppdatering, setUppdatering] = useState(0);
  const [valdStad, setValdStad] = useState("Alla");

  useEffect(() => {
    let aktiv = true;

    async function hamta() {
      setLaddar(true);
      setFel("");

      try {
        const resultat = await Promise.all(
          STADER.map(hamtaStad)
        );

        if (aktiv) {
          setVader(resultat);
        }
      } catch {
        if (aktiv) {
          setFel("Kunde inte hämta vädret just nu.");
        }
      } finally {
        if (aktiv) {
          setLaddar(false);
        }
      }
    }

    hamta();

    return () => {
      aktiv = false;
    };
  }, [uppdatering]);

  const synligtVader = vader.filter(
    (stad) =>
      valdStad === "Alla" || stad.namn === valdStad
  );

  return (
    <section className="vader weather-dashboard">
      <div className="weather-topline">
        <span>VÄDERKOLLEN / AKTUELLT VÄDER</span>
        <span className="weather-indicator">
          OPEN-METEO API
        </span>
      </div>

      <div className="weather-heading">
        <div>
          <h2>Vädret just nu.</h2>
          <p>
            Fyra städer. Samma ögonblick.
            Ganska olika temperaturer.
          </p>
        </div>

        <button
          type="button"
          className="weather-refresh"
          onClick={() => setUppdatering((n) => n + 1)}
          disabled={laddar}
        >
          <span aria-hidden="true">↻</span>
          {laddar ? "Hämtar..." : "Uppdatera"}
        </button>
      </div>

      <div
        className="vader-val"
        role="group"
        aria-label="Filtrera städer"
      >
        <button
          type="button"
          onClick={() => setValdStad("Alla")}
          aria-pressed={valdStad === "Alla"}
        >
          Alla städer
        </button>

        {STADER.map((stad) => (
          <button
            type="button"
            key={stad.namn}
            onClick={() => setValdStad(stad.namn)}
            aria-pressed={valdStad === stad.namn}
          >
            {stad.namn}
          </button>
        ))}
      </div>

      {laddar && (
        <p className="weather-state" role="status">
          Hämtar aktuellt väder...
        </p>
      )}

      {fel && (
        <p className="weather-state" role="alert">
          {fel}
        </p>
      )}

      {!laddar && !fel && (
        <div className="vader-lista">
          {synligtVader.map((stad, index) => (
            <Vaderkort
              key={stad.namn}
              stad={stad}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}
