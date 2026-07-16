const BRANDS = [
  { name: 'NORTHLOOP', style: { fontFamily: '"Space Grotesk"', fontWeight: 700, letterSpacing: '0.18em' } },
  { name: 'Atelier Kade', style: { fontFamily: 'Georgia, serif', fontStyle: 'italic' as const, fontWeight: 400 } },
  { name: 'VANTA & CO', style: { fontFamily: '"Inter"', fontWeight: 600, letterSpacing: '0.3em' } },
  { name: 'helios.io', style: { fontFamily: '"JetBrains Mono"', fontWeight: 500 } },
  { name: 'FORMWORKS', style: { fontFamily: '"Space Grotesk"', fontWeight: 500, letterSpacing: '0.24em' } },
  { name: 'Lumen Clinics', style: { fontFamily: '"Inter"', fontWeight: 400 } },
  { name: 'ARCADIA', style: { fontFamily: '"Space Grotesk"', fontWeight: 700, letterSpacing: '0.34em' } },
  { name: 'Studio Meridian', style: { fontFamily: 'Georgia, serif', fontWeight: 400 } },
];

export default function LogoStrip() {
  const row = (suffix: string) =>
    BRANDS.map((b, i) => (
      <span className="logos__item" style={b.style} key={`${suffix}-${i}`}>
        {b.name}
      </span>
    ));
  return (
    <section className="logos reveal">
      <p className="logos__label mono">LA CONFIANCE DES ÉQUIPES ORIENTÉES CROISSANCE</p>
      <div className="logos__mask">
        <div className="logos__track">
          {row('a')}
          {row('b')}
        </div>
      </div>
    </section>
  );
}
