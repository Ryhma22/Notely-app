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

---

## Git-perus työnkulku

### Hae uusin `main`
```bash
git checkout main
git pull
Tee oma branch kortille
Nimeä branch kortin mukaan (ei tarvitse issue-linkitystä):

bash
Kopioi koodi
git checkout -b feature/<kuvaus>
Esim:

bash
Kopioi koodi
git checkout -b feature/notes-list
Tee muutokset ja committaa
bash
Kopioi koodi
git status
git add .
git commit -m "feat: notes list UI"
Pushaa branch GitHubiin
bash
Kopioi koodi
git push -u origin feature/notes-list
