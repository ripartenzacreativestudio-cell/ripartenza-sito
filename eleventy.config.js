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
      "@id": site.url + "/#studio", email: site.email, telephone: site.telefono, vatID: site.piva, legalName: site.ragione_sociale,
      address: { "@type": "PostalAddress", streetAddress: site.indirizzo, addressLocality: site.citta, addressRegion: site.regione, addressCountry: "IT" },
      areaServed: [site.citta, site.regione], sameAs: ["https://www.instagram.com/" + site.instagram + "/"],
    }));
  });
  cfg.addFilter("schemaServizio", (pg, site) => JSON.stringify({
    "@context": "https://schema.org", "@graph": [
      { "@type": "Service", name: pg.titolo, serviceType: pg.titolo, description: pg.descrizione, url: site.url + pg.url,
        provider: { "@id": site.url + "/#studio" }, areaServed: [{ "@type": "City", name: site.citta }, { "@type": "AdministrativeArea", name: site.regione }] },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url + "/" },
        { "@type": "ListItem", position: 2, name: "Servizi", item: site.url + "/servizi/" },
        { "@type": "ListItem", position: 3, name: pg.titolo, item: site.url + pg.url } ] } ] }));
  // ordine nella sitemap: home, servizi, sport, lavori, studio, clienti, preventivo, resto
  cfg.addFilter("ordinaSitemap", (arr) => {
    const peso = (u) => u === "/" ? 0 : u === "/servizi/" ? 1 : u.startsWith("/servizi/") ? 2 : u === "/sport/" ? 3 : u.startsWith("/lavori/") ? 4 : u === "/studio/" ? 5 : u === "/clienti/" ? 6 : u === "/preventivo/" ? 7 : 9;
    return [...arr].sort((a, b) => peso(a.url || "") - peso(b.url || "") || String(a.url).localeCompare(String(b.url)));
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
