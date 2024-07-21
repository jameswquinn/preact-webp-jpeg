import { h } from 'preact';
import ResponsiveImage from './components/ResponsiveImage';

const App = () => (
  <div>
    <h1>Welcome to Preact</h1>
    <ResponsiveImage
      src="./images/example.jpg"
      alt="Example Image"
      sizes={[300, 600, 1200]}
      fallbackSrc="./images/fallback.jpg"
    />
  </div>
);

export default App;
