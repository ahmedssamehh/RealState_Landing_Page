/**
 * Next.js dev mode compiles each route on its first request. Hitting all
 * three routes once, sequentially, before the timed parallel test run
 * begins means every test starts against an already-compiled route instead
 * of racing a multi-second cold compile under parallel load.
 */
export default async function globalSetup() {
  const base = 'http://localhost:3000';
  for (const path of ['/', '/rent', '/sale']) {
    const res = await fetch(`${base}${path}`);
    await res.text();
  }
}
