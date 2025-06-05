# 🤖 Copilot Instructions – OSRS GIM Chore Picker

Welcome to the **Nutville Chore Picker** project! This web app randomly assigns AFK or low-effort tasks for our **Old School RuneScape Group Ironman (GIM)** group, **Nutville**, using a fun chore wheel interface.

---

## 🗂️ Project Overview

**Goal:**  
Build a responsive, browser-based app (in **TypeScript** + a frontend framework) that:

- Displays a **chore wheel**
- Spins to randomly select a chore
- Uses a **JSON-based manifest** of chores
- Is fun, themed, and easily deployable

---

## 🚀 Core Features

### 🎡 Chore Wheel Interface

- Visual wheel that spins and selects a random chore
- Animation with celebratory display (e.g., confetti or sparkle)
- Result display with chore details

### 📦 Chore Manifest (JSON)

The wheel dynamically pulls chore data from a JSON file at **build time** or **runtime**. Each entry should follow this schema:

```json
{
  "name": "Fish Monkfish",
  "type": "afk",
  "difficulty": "easy",
  "notes": "Use Piscatoris teleport to get there quickly"
}
```

## Chore Object Fields:

`name`: (*string*) – Display name of the chore
`type`: (*string*) – One of: "afk", "gathering", "boss", etc.
`difficulty`: (*string*, optional) – "easy", "medium", "hard"
`notes`: (*string*, optional) – Optional helper text or context
`Example` file location: `/src/data/chores.json`


## 🧰 Tech Stack:

* TypeScript
* React (preferred) or Vue/Svelte
* Vite, Next.js, or similar modern tooling
* Optional styling: TailwindCSS, CSS Modules, etc.

## Stretch Goals

Optional features Copilot may help with after MVP is complete:
* Filter by activity type before spinning
* Track recently-picked chores (e.g., in localStorage)
* Add new chore from UI (non-persistent)
* Toggle types (e.g., "AFK only")
* Easter eggs or OSRS/Nutville-themed surprises

## Repo Info:

* GitHub Repository: leshicodes/osrs-gim-chore-picker
* GIM Name: Nutville

### Summary for Copilot
Build a TypeScript-based webpage that displays a chore wheel which spins and selects a random chore from a JSON manifest. The app should be modular, interactive, and themed around an OSRS GIM group called Nutville. Use modern frontend libraries and best practices for structure and DX.