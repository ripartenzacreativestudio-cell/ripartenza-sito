# Ripartenza Creative Studio – Guida al sito con pannello di gestione

Il sito è diviso in due parti:
- **la grafica** (cartella `src/_includes`, `src/assets`): non serve toccarla;
- **i contenuti** (testi, servizi, squadra, clienti, lavori, FAQ): si modificano dal **pannello** su `tuodominio.it/admin`.

Quando premi "Pubblica" nel pannello, la modifica viene salvata su GitHub e Netlify ripubblica il sito da solo in circa un minuto.

```
Pannello /admin  →  GitHub (archivio dei file)  →  Netlify (pubblica il sito)  →  www.tuodominio.it
                                                         ↑
                                         OVH: dominio ed email, puntano a Netlify
```

Costi: dominio su OVH (circa 10–15 € l'anno). GitHub e Netlify gratuiti per un sito come questo.

---

## Parte 1 – Messa online (una volta sola, circa 1 ora)

### 1. GitHub: l'archivio del sito
1. Crea un account su **github.com** per lo studio (es. `ripartenzastudio`).
2. In alto a destra **+ → New repository**. Nome: `ripartenza-sito`. Puoi lasciarlo **Private**. Crea.
3. Nella pagina del repository: **uploading an existing file**. Trascina **tutto il contenuto** di questa cartella
   (non le cartelle `node_modules` e `_site`, se ci sono). In basso **Commit changes**.
4. Apri il file `src/admin/config.yml` (matita per modificare) e alla riga `repo:` scrivi
   `NOMEACCOUNT/ripartenza-sito` (es. `ripartenzastudio/ripartenza-sito`). Salva con **Commit changes**.

### 2. Netlify: la pubblicazione automatica
1. Vai su **netlify.com** → registrati con **"Sign up with GitHub"**.
2. **Add new project → Import an existing project → GitHub** → autorizza → scegli `ripartenza-sito`.
3. Le impostazioni si compilano da sole (le legge dal file `netlify.toml`). Premi **Deploy**.
4. Dopo un paio di minuti il sito è online su `ripartenza-sito.netlify.app` (indirizzo tecnico, resta attivo e porta al dominio).
   Nelle impostazioni del progetto puoi cambiare il nome provvisorio.

### 3. Accesso al pannello /admin
Il pannello usa gli account GitHub per entrare, così solo chi autorizzate può modificare.
1. Su GitHub: foto profilo → **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - Application name: `Pannello Ripartenza`
   - Homepage URL: l'indirizzo del sito (per ora quello `.netlify.app`)
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Crea, poi **Generate a new client secret**. Tieni aperti **Client ID** e **Client secret**.
2. Su Netlify: progetto → **Project configuration → Access & security → OAuth** →
   **Install provider** → GitHub → incolla Client ID e Client secret → Install.
3. Apri `indirizzo-del-sito/admin` → **Login with GitHub**. Sei dentro.
4. Per far entrare gli altri: su GitHub, nel repository → **Settings → Collaborators → Add people**.
   Ognuno crea il suo account GitHub gratuito e accetta l'invito.

### 4. Ricevere le richieste di preventivo via email
1. Su Netlify: progetto → **Forms** → se richiesto, **Enable form detection**, poi rifai un deploy
   (Deploys → Trigger deploy).
2. Comparirà il modulo **preventivo**. Vai su **Forms → Form notifications → Add notification → Email notification**
   e inserisci `ripartenzacreativestudio@gmail.com`.
3. Fai una prova dal sito: compila il modulo, devi ricevere l'email e vedere la richiesta anche su Netlify.
   Il piano gratuito ha un limite mensile di invii, ampiamente sufficiente per iniziare.

### 5. Il dominio (OVH)
1. Il dominio dello studio è **ripartenza-creativestudio.it** (registrato su OVH, non serve l'hosting).
2. Su Netlify: progetto → **Domain management → Add a domain** → scrivi `ripartenza-creativestudio.it` → conferma (Netlify aggiunge da solo anche il www).
3. Su OVH: **Web Cloud → Domini → il dominio → Zona DNS** e imposta questi record
   (eliminando eventuali record A o CNAME già presenti per gli stessi nomi):

   | Tipo  | Sottodominio | Destinazione                       |
   |-------|--------------|------------------------------------|
   | CNAME | www          | `ripartenza-sito.netlify.app.`     |
   | A     | (vuoto)      | `75.2.60.5` (controlla che sia l'IP indicato da Netlify) |

   I record MX dell'email non vanno toccati.
4. Entro qualche ora Netlify verifica il dominio e attiva da solo **HTTPS** (lucchetto).
   Il dominio principale è `ripartenza-creativestudio.it`: chi scrive con www viene reindirizzato.
5. L'indirizzo del sito è già impostato su `https://ripartenza-creativestudio.it` (in **Dati dello studio** e in `src/admin/config.yml`).
   Se un giorno cambia dominio, va aggiornato in entrambi.

### 6. Google
1. **search.google.com/search-console** → Aggiungi proprietà → Dominio → verifica con il record TXT nella Zona DNS di OVH.
2. **Sitemap** → scrivi `sitemap.xml` → Invia. La sitemap si aggiorna da sola a ogni pubblicazione.
3. Crea il **Google Business Profile** dello studio (nome, Bari, sito, Instagram) e chiedi recensioni ai clienti.
4. Metti il link del sito nella bio di Instagram.

### 7. Da completare nel pannello (Dati dello studio)
- **Partita IVA e ragione sociale** (obbligatorie per legge): compaiono nel piè di pagina e nella privacy.
- **WhatsApp e telefono**: compaiono nella pagina Preventivo appena li inserisci.
- Controllare la **licenza web** del font dei titoli (ITC Avant Garde).

---

## Parte 2 – Usare il pannello (ogni giorno)

Apri `www.tuodominio.it/admin` → Login with GitHub. A sinistra trovi le sezioni:

| Sezione | Cosa ci fai |
|---|---|
| **Pagine e impostazioni** | Dati dello studio (email, WhatsApp, P.IVA…), testi della Home, Studio, Sport, Domande frequenti |
| **Servizi** | Modifica o aggiungi servizi. Ogni servizio ha la sua pagina con testo per Google e, se vuoi, il prezzo "a partire da" |
| **Lavori** | Aggiungi i progetti: copertina, riassunto, risultato, testo, video YouTube/Vimeo, galleria |
| **Squadra** | Le schede della formazione: foto, ruolo, compiti e posizione sul campo |
| **Clienti** | Loghi dei clienti (versione a colori e versione bianca per il tema scuro) |

Ogni modifica: compila → **Pubblica → Pubblica ora**. Dopo circa un minuto è online.

### Cose che il sito fa da solo
- La voce **Lavori** nel menu e i "Lavori recenti" in home compaiono appena pubblichi il primo progetto.
- Lo **showreel** in home compare appena carichi il video (Pagine e impostazioni → Home).
- Il **prezzo** di un servizio compare solo se lo compili.
- WhatsApp, telefono, P.IVA compaiono solo se compilati.
- Sitemap, titoli per Google e anteprime social si aggiornano a ogni pubblicazione.

### Consigli per le immagini
- Foto squadra: verticali, circa 900×1200 px, JPG.
- Copertine lavori: orizzontali 4:3, circa 1600×1200 px, JPG o WebP sotto i 400 KB.
- Loghi clienti: PNG o WebP con sfondo trasparente, ritagliati stretti. Serve anche la versione bianca.
- Showreel: MP4 orizzontale, 15–30 secondi, sotto i 20 MB, senza audio importante (parte muto).

### Il progetto di esempio
In **Lavori** trovi "Esempio di progetto" con "Pubblicato sul sito" spento: è un modello da duplicare o modificare.
Non compare sul sito finché non accendi "Pubblicato".

---

## Per chi sa usare il computer (facoltativo)
- Provare il sito sul proprio computer: installa Node.js 20, poi nella cartella `npm install` e `npm start`
  → apri `http://localhost:8080`.
- Il sito pubblicato si genera con `npm run build` nella cartella `_site`.
- Se un giorno voleste ospitarlo su OVH invece che su Netlify: caricate il contenuto di `_site` nella cartella `www`.
  In quel caso il modulo preventivo va collegato a un altro servizio di invio email e il pannello non pubblica in automatico.
