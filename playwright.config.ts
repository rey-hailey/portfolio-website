import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  retries: 0,
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    // `--ignore-lock`: Astro 7 auto-backgrounds `astro preview` when it detects an AI-agent
    // environment, which makes Playwright see the server process exit early and leaves an
    // orphan on the port. The flag forces a one-off foreground server (withastro/astro#17903).
    command: 'pnpm build && pnpm preview --port 4321 --ignore-lock',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
  projects: [
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        hasTouch: true,
      },
      testIgnore: ['**/header.spec.ts', '**/responsive.spec.ts'],
    },
    {
      name: 'desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 800 },
      },
      testIgnore: ['**/mobile-menu.spec.ts'],
    },
  ],
});
