# FridgeSmart

A smart inventory management app for your fridge that helps you track expiration dates and reduce food waste.

## Features

- 📱 Modern, intuitive UI with a clean design
- 📸 Add items using your camera or manually
- 📅 Track expiration dates and get notifications
- 🔍 Search and filter items by category
- 📊 Sort items by name, expiry date, or recently added
- ⚡ Quick access to items expiring soon

## Tech Stack

- React Native with Expo
- TypeScript for type safety
- React Navigation for routing
- Context API for state management
- Expo Camera for photo capture
- Custom theming system

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ejiang-airta/fridgesmart.git
cd fridgesmart
```

2. Install dependencies:
```bash
cd FridgeSmart
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on iOS simulator:
- Press 'i' in the terminal, or
- Scan the QR code with your iOS camera

## Project Structure

```
FridgeSmart/
├── assets/              # Images and static assets
├── components/          # Reusable UI components
├── context/            # React Context for state management
├── screens/            # Screen components
├── theme/             # Theme configuration
└── types/             # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 