import naturalCompare from 'string-natural-compare';

export default function flatComparator(a, b) {
  return naturalCompare(a, b);
}
