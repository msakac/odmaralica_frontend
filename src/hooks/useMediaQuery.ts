import { useState, useEffect } from 'react';

export default function useMediaQuery(mediaQuery: string) {
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(mediaQuery);

    // Define the change handler
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsMatch(e.matches);
    };

    // Attach the change handler using addEventListener
    list.addEventListener('change', handleMediaQueryChange);

    // Check the initial state
    setIsMatch(list.matches);

    // Clean up the event listener when the component unmounts
    return () => {
      list.removeEventListener('change', handleMediaQueryChange);
    };
  }, [mediaQuery]);

  return isMatch;
}
