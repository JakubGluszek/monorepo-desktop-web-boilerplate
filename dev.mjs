import concurrently from 'concurrently';

concurrently(
  [
    { command: 'pnpm run dev:backend', name: 'backend', prefixColor: 'blue' },
    { command: 'pnpm run dev:web', name: 'web', prefixColor: 'green' },
    { command: 'pnpm run dev:site', name: 'site', prefixColor: 'yellow' },
    { command: 'pnpm run dev:desktop', name: 'desktop', prefixColor: 'magenta' }
  ],
  {
    prefix: 'name',
    killOthers: ['failure', 'success'],
    restartTries: 3
  }
).then(
  () => console.log('All processes exited successfully'),
  (error) => console.error('One or more processes failed', error)
);
