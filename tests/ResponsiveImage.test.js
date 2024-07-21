import { h } from 'preact';
import { render, fireEvent } from '@testing-library/preact';
import ResponsiveImage from '../src/components/ResponsiveImage';

jest.mock('../src/utils/checkWebpSupport', () => ({
  checkWebpSupport: (callback) => callback(true),
}));

describe('ResponsiveImage', () => {
  it('renders correctly', () => {
    const { getByAltText } = render(
      <ResponsiveImage
        src="test.jpg"
        alt="Test image"
        sizes={[300, 600]}
        fallbackSrc="fallback.jpg"
      />
    );
    expect(getByAltText('Test image')).toBeTruthy();
  });

  it('uses fallback image on error', () => {
    const { getByAltText } = render(
      <ResponsiveImage
        src="nonexistent.jpg"
        alt="Test image"
        sizes={[300, 600]}
        fallbackSrc="fallback.jpg"
      />
    );
    const img = getByAltText('Test image');
    fireEvent.error(img);
    expect(img.src).toContain('fallback.jpg');
  });
});
