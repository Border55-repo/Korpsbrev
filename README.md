# Korpsbrev

Laget av **Julian Nordli** for Ullensaker Røde Kors Hjelpekorps.

Et enkelt, lokalt verktøy for ukesbrev, månedsbrev og informasjonsbrev.

## Kom i gang

1. Last ned **Korpsbrev.html** og lagre den på skrivebordet eller i en egen mappe.
2. Dobbeltklikk filen. Den åpnes i nettleseren på Windows eller Mac.
3. Velg brevtype, skriv tekst og legg til bilder eller lenker.
4. Trykk **Lagre brev** for å laste ned en redigerbar `.korpsbrev`-fil.
5. Trykk **Last ned PDF** og last PDF-en opp i Teams.

Bruk **Åpne brev** for å fortsette i en tidligere brevfil. Behold HTML-filen og brevfilene hver for seg. Du trenger ingen installasjon, konto eller nettforbindelse for å skrive og eksportere. Kova-lenker og oppdateringssjekken krever nett.

Verktøyet er laget for moderne nettlesere på Windows og macOS, inkludert Edge, Chrome, Firefox og Safari. Native Windows- og macOS-testing er ikke utført i utviklingsmiljøet. Dette er en lokal HTML-applikasjon, ikke en EXE- eller DMG-installer.

## Funksjoner

- Tekst, overskrifter, bilder med bildetekst og justerbar bredde.
- Flytt innhold opp og ned.
- Fast Ullensaker-logo, med mulighet til å bytte logofil.
- Klikkbare lenker i PDF, blant annet til Kova.
- A4-PDF med automatisk sideskift, logo og sidenummer.
- Norske tegn og innebygde skrifter.
- Redigerbar brevfil som inneholder bilder og logo.
- Midlertidig utkast i nettleseren når lokal lagring støttes.
- GitHub-oppdateringssjekk ved oppstart og på forespørsel.

Forhåndsvisningen viser innholdet fortløpende. Den nedlastede PDF-en har den endelige sideinndelingen. Bruk «Lagre brev» for varig lagring, siden nettleserens midlertidige kopi kan forsvinne eller være utilgjengelig når programfilen flyttes.

## Oppdateringer

Standardkilden er det offentlige prosjektet `Border55-repo/Korpsbrev`. Det gjør at oppdateringssjekken fungerer uten innlogging.

Appen leser `version.json` fra GitHub. Hvis versjonsnummeret er høyere, vises **Last ned versjon …**. Programfilens SHA-256 kontrolleres før nedlasting. Ingen GitHub-passord eller tilgangsnøkler ligger i programmet.

Nettleseren kan ikke erstatte programfilen automatisk. Brukeren lagrer brevet, laster ned oppdateringen, åpner den nye HTML-filen og åpner brevfilen igjen. Appen viser disse stegene. Dersom programmet ikke får kontakt med GitHub, fortsetter brevfunksjonene å fungere.

Et privat GitHub-prosjekt fungerer som lagringssted for kode, men kan ikke brukes til automatisk oppdateringssjekk uten en egen innloggingsløsning. Ikke gjør et eksisterende prosjekt med internt innhold offentlig for å aktivere oppdateringer. Bruk et separat programprosjekt.

## Utvikling og ny versjon

`Korpsbrev.html` er den komplette applikasjonen og inneholder alle avhengigheter. Ingen ekstern CDN brukes. `src/` inneholder redigerbare maler for egne endringer.

1. Rediger filene i `src/`.
2. Øk `APP_VERSION` i `src/updater.js`, for eksempel fra `1.0.0` til `1.0.1`.
3. Kjør `node build.mjs` (Node.js kreves bare for utvikling).
4. Test den nye `Korpsbrev.html`, inkludert lagring, åpning og PDF.
5. Last opp den nye HTML-filen, `version.json` og kildeendringene til GitHub i samme commit.

Byggeskriptet beholder innebygde tredjepartsbiblioteker, skrifter og logo fra den eksisterende HTML-filen. Oppdater disse særskilt ved behov. Brevfiler og testbrev skal ikke lastes opp til programprosjektet.

## Personvern og kreditering

Brevtekst, bilder og logo behandles lokalt. Bare en oppdateringssjekk kontakter GitHub; brevets innhold sendes ikke. Midlertidige utkast kan ligge i nettleserprofilen på maskinen.

Programmet er kreditert Julian Nordli. Logoen er hentet fra [korpsets Facebook-side](https://www.facebook.com/ullensakerrkh), som er lenket fra [den offisielle lokalsiden](https://www.rodekors.no/lokalforeninger/akershus/ullensaker/). Røde Kors beholder rettighetene til logoen. Biblioteker og skrifter har egne lisenser i `THIRD-PARTY-NOTICES.txt`.
