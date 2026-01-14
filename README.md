# Notely-app
A React Native note-taking application developed as a school project using Scrum methodology.

## Definition of Done

A task is considered Done when:
- Code is implemented and committed to GitHub
- Feature works without runtime errors
- Feature is tested on emulator or device
- Acceptance criteria are fulfilled
- Documentation is updated if needed
- Reported Hours field is filled in GitHub Projects (excel)


## Kansiorakenne

Projekti käyttää Expo Routerin file-based routing -järjestelmää. Reitit määritellään `app/`-kansiossa olevien tiedostojen perusteella.

`(tabs)`-kansiossa on kolme näyttöä:
- Calculator
- Notes
- Settings  

Nämä näkyvät sovelluksen alanavigaatiossa.  

`_layout.tsx`-tiedostot määrittävät käytettävän navigaatiotyypin (Stack tai Tabs).  
Uudet näytöt lisätään luomalla uusi `.tsx`-tiedosto `app/`-kansioon.


├── app/                          # Expo Routerin reitit (file-based routing)
│   ├── _layout.tsx              # Juurilayout (Stack-navigaatio)
│   └── (tabs)/                  # Tabs-ryhmä (sulkeissa = ei näy URL:ssa)
│       ├── _layout.tsx          # Tabs-layout (Bottom Tab Navigator)
│       ├── calculator.tsx       # Calculator-näyttö
│       ├── notes.tsx            # Notes-näyttö
│       └── settings.tsx         # Settings-näyttö
├── package.json                 # "main": "expo-router/entry"
└── ...


Git-perus työnkulku 

Hae uusin main

git checkout main
git pull


Tee oma branch kortille
Nimeä branch kortin mukaan (ei tarvitse issue-linkitystä):

git checkout -b feature/<kuvaus>


Esim.

git checkout -b feature/notes-list


Tee muutokset ja committaa

git status
git add .
git commit -m "feat: notes list UI"


Pushaa branch

git push -u origin feature/notes-list