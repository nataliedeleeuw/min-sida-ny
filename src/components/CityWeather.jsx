import { useEffect, useState } from "react";
import { STADER } from "../Data/stader";
import { grader } from "../utils/text";
import "./CityWeather.css";

export default function CityWeather() {
  const [selectedCity, setSelectedCity] = useState(STADER[0].namn);
  const [vader, setVader] = useState(null);
  const [laddar, setLaddar] = useState(true);
  const [fel, setFel] = useState("");

  useEffect(() => {
    let aktiv = true;

    async function hamtaVader() {
      setLaddar(true);
      setFel("");

      const city = STADER.find(
        (stad) => stad.namn === selectedCity
      );

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,wind_speed_10m`;

        const svar = await fetch(url);

        if (!svar.ok) {
          throw new Error("Kunde inte hämta vädret.");
        }

        const data = await svar.json();
        if (aktiv) setVader(data.current);
      } catch {
        if (aktiv) {
          setFel("Kunde inte hämta vädret just nu.");
          setVader(null);
        }
      } finally {
        if (aktiv) setLaddar(false);
      }
    }

    hamtaVader();

    return () => {
      aktiv = false;
    };
  }, [selectedCity]);

  return (
    <section className="city-weather weather-dashboard">
      <div className="weather-topline">
        <span>VÄDERKOLLEN / EN STAD</span>
        <span className="weather-indicator">OPEN-METEO API</span>
      </div>

      <div className="weather-heading">
        <div>
          <h2>En plats i taget.</h2>
          <p>Nyfiken på vädret någon annanstans?</p>
        </div>
      </div>

      <div className="weather-select-wrap">
        <label htmlFor="valj-stad">Välj stad</label>
        <select
          id="valj-stad"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {STADER.map((stad) => (
            <option key={stad.namn} value={stad.namn}>
              {stad.namn}
            </option>
          ))}
        </select>
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

      {!laddar && !fel && vader && (
        <article className="city-weather-resultat">
          <div className="weather-card-head">
            <span className="weather-card-index">01</span>
            <h3>{selectedCity}</h3>
          </div>

          <div className="weather-temperature">
            {grader(vader.temperature_2m)}
          </div>

          <div className="weather-card-foot">
            <span>Temperatur just nu</span>
            <span>
              Vind <strong>{vader.wind_speed_10m} km/h</strong>
            </span>
          </div>
        </article>
      )}
    </section>
  );
}