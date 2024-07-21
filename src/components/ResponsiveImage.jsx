import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { checkWebpSupport } from '../utils/checkWebpSupport';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ResponsiveImage = ({ src, alt, sizes, fallbackSrc }) => {
  const [supportsWebp, setSupportsWebp] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    checkWebpSupport((supported) => {
      setSupportsWebp(supported);
    });
  }, []);

  const handleError = () => {
    setError(true);
  };

  const getImageSources = () => {
    if (supportsWebp) {
      return sizes.map(size => ({
        srcSet: `${src}?webp&sizes=${size}w`,
        size: `${size}w`,
        type: 'image/webp'
      }));
    } else {
      return sizes.map(size => ({
        srcSet: `${src}?sizes=${size}w`,
        size: `${size}w`,
        type: 'image/jpeg'
      }));
    }
  };

  const sources = getImageSources();
  const sizeSet = sizes.map(size => `${size}w`).join(', ');

  if (error && fallbackSrc) {
    return <LazyLoadImage src={fallbackSrc} alt={alt} onError={handleError} effect="blur" />;
  }

  return (
    <picture aria-label={`Image of ${alt}`}>
      {sources.map(source => (
        <source
          key={source.size}
          srcSet={source.srcSet}
          sizes={sizeSet}
          type={source.type}
        />
      ))}
      <LazyLoadImage
        src={`${src}?sizes=${sizes[0]}w`}
        alt={alt}
        sizes={sizeSet}
        onError={handleError}
        effect="blur"
      />
    </picture>
  );
};

export default ResponsiveImage;
