import { useState } from "react";

/** Brand band. Shows public/logo.svg, or a text wordmark until the logo file is added. */
export default function BrandHeader() {
  const [logoMissing, setLogoMissing] = useState(false);
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;

  return (
    <header className="brandbar">
      <div className="brandbar-inner">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="Career Connections home">
          {logoMissing ? (
            <span className="brand-word">Diamondback Energy</span>
          ) : (
            <img className="brand-logo" src={logoSrc} alt="Diamondback Energy" onError={() => setLogoMissing(true)} />
          )}
        </a>
        <span className="brand-program">Career Connections</span>
      </div>
    </header>
  );
}
