# FridgeSmart

FridgeSmart is a React Native mobile app that helps you manage your food inventory and reduce waste by tracking expiry dates and sending timely notifications.

## Features

- 📸 Take photos of food items
- 📅 Track expiry dates
- 🔔 Get notifications before food expires
- 🔍 Search and filter your inventory
- 📱 Dark mode support
- 💾 Offline data persistence
- 📊 Category-based organization

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- iOS Simulator (for iOS development)
- Android Studio (for Android development)
- Expo CLI (`npm install -g expo-cli`)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fridgesmart.git
   cd fridgesmart
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

## Project Structure

```
fridgesmart/
├── app/                  # App entry point and navigation
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components
│   ├── services/        # Business logic and API services
│   ├── context/         # React Context providers
│   ├── theme/           # Theme configuration
│   └── types/           # TypeScript type definitions
├── assets/              # Static assets
└── docs/                # Documentation
```

## Development

### Environment Setup

1. Install Expo CLI globally:
   ```bash
   npm install -g expo-cli
   ```

2. Install development dependencies:
   ```bash
   npm install --save-dev
   ```

### Running Tests

```bash
npm test
```

### Building for Production

1. Build for iOS:
   ```bash
   expo build:ios
   ```

2. Build for Android:
   ```bash
   expo build:android
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

## Support

For support, please open an issue in the GitHub repository or contact the development team. 