
import { authOptions } from '../pages/api/auth/[...nextauth]';

console.log('Testing auth configuration...');

const providers = authOptions.providers;
console.log(`Found ${providers.length} providers.`);

const googleProvider = providers.find((p: any) => p.id === 'google');
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    if (googleProvider) {
        console.log('PASS: Google provider is present when env vars are set.');
    } else {
        console.error('FAIL: Google provider is missing even though env vars are set.');
        process.exit(1);
    }
} else {
    if (!googleProvider) {
        console.log('PASS: Google provider is correctly missing when env vars are unset.');
    } else {
        // Note: The provider might still be there but initialized with undefined if my logic was wrong,
        // but since I used the spread operator with conditional, it should be absent from the array.
        // However, next-auth providers don't have an 'id' property strictly visible on the object returned by the factory function in all versions, 
        // but they usually do. Let's inspect the names.
        console.log('Providers:', providers.map((p: any) => p.name));
        const names = providers.map((p: any) => p.name);
        if (names.includes('Google')) {
            console.error('FAIL: Google provider is present when env vars are NOT set.');
            process.exit(1);
        } else {
            console.log('PASS: Google provider is correctly missing.');
        }
    }
}
