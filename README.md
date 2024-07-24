# Preact WebP JPEG Support

A Preact app that detects browser support for WebP and falls back to JPEG, with improved performance, accessibility, and testing.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Build](#build)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jameswquinn/preact-webp-jpeg.git
   cd preact-webp-jpeg
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

To start the development server:

```bash
npm start
```

Navigate to `http://localhost:8080` to see the app in action.

## Development

### Adding Images

Place your images in the `src/images` directory. Import and use the `ResponsiveImage` component in your Preact components:

```jsx
import ResponsiveImage from './components/ResponsiveImage';

const Example = () => (
  <ResponsiveImage
    src="./images/example.jpg"
    alt="Example Image"
    sizes={[300, 600, 1200]}
    fallbackSrc="./images/fallback.jpg"
  />
);
```

### WebP Support Check

The `checkWebpSupport` utility detects if the browser supports WebP and adjusts the image sources accordingly.

## Testing

Run the test suite with:

```bash
npm test
```

## Build

To build the project for production:

```bash
npm run build
```

The output will be in the `dist` directory.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details on each release.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
