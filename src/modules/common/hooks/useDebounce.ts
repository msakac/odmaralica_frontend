import { useEffect } from 'react';
import useTimeout from './useTimeout';

type DependencyList = readonly any[];

export default function useDebounce(callback: () => void, delay: number, dependencies: DependencyList) {
  const { reset, clear } = useTimeout(callback, delay);
  useEffect(reset, [...dependencies, reset]);
  useEffect(clear, []);
}
