import { defineConfig } from '@playwright/test';

/** 고정 루프백 주소에서 빌드 산출물을 검증한다. */
export default defineConfig({
  testDir: './e2e',
  use: { channel: 'chrome', baseURL: 'http://127.0.0.1:4179' },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4179 --strictPort',
    url: 'http://127.0.0.1:4179',
  },
});
