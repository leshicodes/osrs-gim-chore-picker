# 🎡 Nutville GIM Chore Picker

A fun, interactive chore wheel app for randomly assigning AFK or low-effort tasks for the Nutville Old School RuneScape Group Ironman (GIM) team.

![OSRS Nutville Chore Picker](https://github.com/leshicodes/osrs-gim-chore-picker/raw/main/screenshot.png)

## 🎮 Features

- **Interactive Chore Wheel**: Visually appealing wheel that spins to randomly select tasks
- **OSRS-Themed**: Designed with Old School RuneScape aesthetics
- **Celebration Effects**: Confetti animations when a task is selected
- **Task Details**: Shows difficulty, type, and helpful notes for each task
- **Mobile Responsive**: Works on all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/leshicodes/osrs-gim-chore-picker.git
cd osrs-gim-chore-picker
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📦 Build for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build files will be located in the `dist` directory.

## 🛠️ Technologies Used

- **React**: UI Framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool
- **CSS**: Styling
- **canvas-confetti**: Celebration effects

## 📋 Chore Manifest

Chores are defined in `src/data/chores.json` with the following structure:

```json
{
  "name": "Fish Monkfish",
  "type": "afk",
  "difficulty": "easy",
  "notes": "Use Piscatoris teleport to get there quickly"
}
```

## 🎯 Future Enhancements

- Filter by activity type before spinning
- Track recently-picked chores in localStorage
- Add new chore from UI
- Toggle activity types
- More OSRS-themed visual elements and easter eggs

## 📄 License

MIT © Nutville GIM Team
