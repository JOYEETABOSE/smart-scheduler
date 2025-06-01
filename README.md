# ScheduleWizard

A smart scheduling assistant that understands natural language input to help you manage your calendar effortlessly.

## Features

- 🗣️ Natural Language Processing - Simply type or speak your scheduling needs
- 📅 Interactive Calendar View - Monthly and daily views of your schedule
- 🎯 Smart Event Parsing - Automatically extracts event details, participants, and locations
- 🎨 Beautiful UI - Clean, modern interface with smooth animations
- 🔊 Voice Input Support - Hands-free event creation (on supported browsers)
- 💾 Local Storage - Your events persist between sessions
- 📱 Responsive Design - Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/schedule-wizard.git
cd schedule-wizard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## Usage

### Creating Events

You can create events in two ways:

1. **Natural Language Input**
   - Type phrases like:
     - "Schedule a meeting with Jack tomorrow at 3pm"
     - "Lunch with Sarah on Friday at noon at Bistro Garden"
     - "Call with the design team next Monday from 2-3pm"

2. **Voice Input**
   - Click the microphone icon and speak your scheduling request
   - Works in browsers that support the Web Speech API

### Managing Events

- View events in the calendar or list view
- Click on any event to view details
- Edit or delete events from the event details modal
- Switch between month and day views

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Vite
- chrono-node (for natural language parsing)
- react-calendar
- Web Speech API

## Live Demo

Visit the live demo at: [https://beautiful-frangollo-1fb4c2.netlify.app](https://beautiful-frangollo-1fb4c2.netlify.app)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.