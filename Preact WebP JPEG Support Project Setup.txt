Project Structure (updated):

preact-webp-jpeg/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ResponsiveImage.tsx
│   │   └── ImageGallery.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   ├── utils/
│   │   └── checkWebpSupport.ts
│   ├── styles/
│   │   └── global.css
│   ├── app.tsx
│   └── index.tsx
├── webpack.config.js
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env
└── README.md

New and updated file contents:

1. src/context/AppContext.tsx:

import { h, createContext } from 'preact';
import { StateUpdater, useContext, useState } from 'preact/hooks';

interface AppContextType {
  images: string[];
  addImage: (image: string) => void;
  removeImage: (image: string) => void;
  supportsWebp: boolean;
  setSupportsWebp: StateUpdater<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: preact.ComponentChildren }) => {
  const [images, setImages] = useState<string[]>([]);
  const [supportsWebp, setSupportsWebp] = useState(false);

  const addImage = (image: string) => {
    setImages((prevImages) => [...prevImages, image]);
  };

  const removeImage = (image: string) => {
    setImages((prevImages) => prevImages.filter((img) => img !== image));
  };

  return (
    <AppContext.Provider value={{ images, addImage, removeImage, supportsWebp, setSupportsWebp }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

2. src/components/ImageGallery.tsx:

import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { useAppContext } from '../context/AppContext';
import ResponsiveImage from './ResponsiveImage';
import { checkWebpSupport } from '../utils/checkWebpSupport';

const ImageGallery = () => {
  const { images, addImage, removeImage, supportsWebp, setSupportsWebp } = useAppContext();

  useEffect(() => {
    checkWebpSupport((supported) => {
      setSupportsWebp(supported);
    });

    // Simulating image additions (in a real app, this might come from an API or user input)
    addImage('./images/example1.jpg');
    addImage('./images/example2.jpg');
    addImage('./images/example3.jpg');
  }, []);

  return (
    <div className="image-gallery">
      <h2>Image Gallery</h2>
      {images.map((image, index) => (
        <div key={index} className="image-container">
          <ResponsiveImage
            src={image}
            alt={`Gallery image ${index + 1}`}
            sizes={[300, 600, 1200]}
            className="gallery-image"
          />
          <button onClick={() => removeImage(image)}>Remove</button>
        </div>
      ))}
      <p>WebP Support: {supportsWebp ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default ImageGallery;

3. src/app.tsx (updated):

import { h } from 'preact';
import { AppProvider } from './context/AppContext';
import ImageGallery from './components/ImageGallery';
import './styles/global.css';

const App = () => (
  <AppProvider>
    <div>
      <h1>Welcome to Preact</h1>
      <ImageGallery />
    </div>
  </AppProvider>
);

export default App;

4. src/components/ResponsiveImage.tsx (updated):

import { h } from 'preact';
import { useEffect, useState, useRef } from 'preact/hooks';
import { useAppContext } from '../context/AppContext';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes: number[];
  className?: string;
}

const ResponsiveImage = ({ src, alt, sizes, className }: ResponsiveImageProps) => {
  const { supportsWebp } = useAppContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

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

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  return (
    <picture>
      {sources.map(source => (
        <source
          key={source.size}
          srcSet={source.srcSet}
          type={source.type}
        />
      ))}
      {imageError ? (
        <div>Error loading image</div>
      ) : (
        <img
          ref={imgRef}
          data-src={`${src}?sizes=${sizes[0]}w`}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`${className} ${imageLoaded ? 'loaded' : 'loading'}`}
          loading="lazy"
        />
      )}
    </picture>
  );
};

export default ResponsiveImage;

5. src/styles/global.css (updated):

.loading {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.loaded {
  opacity: 1;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gallery-image {
  max-width: 300px;
  height: auto;
}

6. README.md (updated to include state management info):

# Preact WebP JPEG Support with State Management

A Preact app that detects browser support for WebP and falls back to JPEG, with TypeScript, Jest testing, lazy loading, and state management using Context API.

...

## State Management

This project uses Preact's Context API for state management. The main state is managed in `src/context/AppContext.tsx`. It includes:

- A list of images
- WebP support status
- Functions to add and remove images

To use the app state in a component:

```tsx
import { useAppContext } from '../context/AppContext';

const MyComponent = () => {
  const { images, addImage, removeImage, supportsWebp } = useAppContext();

  // Use the state and functions here
};
```

...
