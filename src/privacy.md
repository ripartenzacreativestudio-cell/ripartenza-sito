---
permalink: /privacy/
titolo: Informativa privacy
layout: base.njk
fuori_sitemap: true
---
<section class="page-hero"><div class="wrap"><p class="label">Privacy</p><h1 class="display">Informativa privacy</h1></div></section>
<section class="sec"><div class="wrap prose">

**Titolare del trattamento:** {{ site.ragione_sociale or site.nome }}{% if site.indirizzo %}, {{ site.indirizzo }}{% endif %}, {{ site.citta }}{% if site.piva %} · P.IVA {{ site.piva }}{% endif %}. Contatto: {{ site.email }}.

## Quali dati raccogliamo
Solo i dati che inserisci nel modulo preventivo: nome, azienda, email, telefono e il testo della richiesta.

## Perché li usiamo
Per rispondere alla tua richiesta e inviarti la proposta. Non li usiamo per newsletter o pubblicità e non li cediamo a terzi. La base giuridica è la tua richiesta (misure precontrattuali, art. 6.1.b GDPR).

## Dove sono conservati e per quanto
Le richieste vengono inoltrate alla nostra email tramite il servizio FormSubmit (formsubmit.co), che le trasmette senza usarle per altri scopi. Le conserviamo per il tempo necessario a gestire la richiesta e l'eventuale collaborazione, e comunque non oltre 24 mesi se non nasce un rapporto di lavoro.

## Cookie
Il sito non usa cookie di profilazione né strumenti di statistica. Salva solo nel tuo browser la preferenza tra tema chiaro e scuro.

## I tuoi diritti
Puoi chiedere in qualsiasi momento di vedere, correggere o cancellare i tuoi dati scrivendo a {{ site.email }}. Puoi anche presentare reclamo al Garante per la protezione dei dati personali.

*Ultimo aggiornamento: {{ page.date | isoData }}.*

</div></section>
