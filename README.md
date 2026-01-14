# Notely-app  
A React Native note-taking application developed as a school project using Scrum methodology.

---

## Definition of Done

A task is considered **Done** when:
- Code is implemented and committed to GitHub  
- Feature works without runtime errors  
- Feature is tested on emulator or device  
- Acceptance criteria are fulfilled  
- Documentation is updated if needed  
- Reported Hours field is filled in GitHub Projects (Excel)

---

## Kansiorakenne

Projekti käyttää **Expo Routerin file-based routing** -järjestelmää. Reitit määritellään `app/`-kansiossa olevien tiedostojen perusteella.

`(tabs)`-kansiossa on kolme näyttöä (alanavigaatiossa):
- Calculator  
- Notes  
- Settings  

`_layout.tsx`-tiedostot määrittävät navigaatiotyypin (Stack tai Tabs).  
Uudet näytöt lisätään luomalla uusi `.tsx`-tiedosto `app/`-kansioon.

Git-perus työnkulku

```text
Notely-app/
├── app/
│   ├── _layout.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── calculator.tsx
│       ├── notes.tsx
│       └── settings.tsx
├── assets/
├── components/
├── constants/
├── hooks/
├── app.json
├── package.json
└── README.md
```

---

## Git-perus työnkulku

### Hae uusin `main`
🚀 Käynnistys
1. Asenna riippuvuudet
Bash

npm install
2. Käynnistä kehityspalvelin
Bash

npx expo start
Skannaa terminaaliin ilmestyvä QR-koodi puhelimellasi tai paina w (web), a (Android) tai i (iOS).

🛠 Git-työnkulku
Noudata tätä prosessia uusien ominaisuuksien kehittämisessä.

1) Hae uusin main
Varmista aina ennen aloitusta, että sinulla on uusin versio projektista.

```bash

git checkout main
git pull
```
2) Luo uusi branch
Tee kortille/tehtävälle oma haara (branch). Nimeämiskäytäntö: feature/<kuvaus> tai fix/<kuvaus>. Issue-linkitystä ei tarvita nimeen.

# Esimerkki:
```bash
git checkout -b feature/notes-list
3) Tee muutokset ja committaa
Kun olet valmis, tarkista muutokset ja tee commit.
```

```bash

git status
git add .
git commit -m "feat: notes list UI"
```

4) Pushaa GitHubiin
Ensimmäisellä kerralla uusi branch pitää asettaa upstreamiin (-u).

```bash
git push -u origin feature/notes-list
📝 Pikakomennot (Quick Cheatsheet)
```


# Projektin alustus
```bash
git clone <REPO_URL>
cd Notely-app
npm install

# Käynnistys
npx expo start

# Uusi ominaisuus
git checkout main && git pull
git checkout -b feature/uusi-ominaisuus
git add . && git commit -m "feat: kuvaus muutoksesta"
git push -u origin feature/uusi-ominaisuus
```
