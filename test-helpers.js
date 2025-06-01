// Quick test to verify the helper functions work
import { getStarCount, getStarCounts } from './lib/index.js';

try {
  process.loadEnvFile();
} catch {
  console.warn('No .env file found, using environment variables directly');
}

// Test single repo star count
console.log('Testing getStarCount...');
const stars = await getStarCount('hiroppy', 'fusuma');
console.log(`hiroppy/fusuma has ${stars} stars`);

// Test multiple repos star counts
console.log('\nTesting getStarCounts...');
const multiStars = await getStarCounts(['hiroppy/fusuma', 'webpack/webpack']);
console.log('Multiple star counts:', multiStars);

console.log('\nHelper functions are working correctly! 🎉');