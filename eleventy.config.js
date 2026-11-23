// Configurazione del sito: i contenuti stanno in src/_data, src/servizi e src/lavori (modificabili dal pannello /admin)
module.exports = function (cfg) {
  cfg.addPassthroughCopy({ "src/assets": "assets", "src/admin": "admin", "src/favicon.svg": "favicon.svg" });

  const byOrder = (a, b) => (a.data.ordine || 99) - (b.data.ordine || 99);
  cfg.addCollection("serviziOrdinati", (api) => api.getFilteredByTag("servizi").filter((p) => p.data.icona).sort(byOrder));
  cfg.addCollection("progetti", (api) =>
    api.getFilteredByTag("lavori").filter((p) => p.data.pubblicato).sort((a, b) => new Date(b.data.data) - new Date(a.data.data)));

  // elenchi da cartelle di dati (squadra, clienti) ordinati
  cfg.addFilter("elenco", (obj, key) => Object.values(obj || {}).sort((a, b) => String(a[key] ?? "").localeCompare(String(b[key] ?? ""), "it", { numeric: true })));
  cfg.addFilter("json", (v) => JSON.stringify(v));
  cfg.addFilter("schema", (site) => {
    const clean = (o) => JSON.parse(JSON.stringify(o, (k, v) => (v === "" || v === null ? undefined : v)));
    return JSON.stringify(clean({
      "@context": "https://schema.org", "@type": "ProfessionalService", name: site.nome, url: site.url + "/",
      logo: site.url + "/assets/img/logo-512.png", image: site.url + "/assets/img/og-image.jpg", description: site.descrizione,
      email: site.email, telephone: site.telefono,
      address: { "@type": "PostalAddress", streetAddress: site.indirizzo, addressLocality: site.citta, addressRegion: site.regione, addressCountry: "IT" },
      areaServed: [site.citta, site.regione], sameAs: ["https://www.instagram.com/" + site.instagram + "/"],
    }));
  });
  cfg.addFilter("isoData", (d) => (d ? new Date(d).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)));
  cfg.addFilter("anno", () => new Date().getFullYear());
  cfg.addFilter("telefono", (t) => String(t || "").replace(/[^\d+]/g, ""));
  cfg.addFilter("wa", (t) => String(t || "").replace(/[^\d]/g, ""));
  cfg.addFilter("iniziali", (p) => ((p.nome || "")[0] || "") + ((p.cognome || "")[0] || ""));
  cfg.addFilter("head", (arr, n) => (arr || []).slice(0, n));
  cfg.addFilter("perServizio", (arr, t) => (arr || []).filter((p) => (p.data.servizi || []).includes(t)));
  cfg.addFilter("filtraSettore", (arr, s) => arr.filter((c) => c.settore === s));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
