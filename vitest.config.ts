/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Astro 컨테이너 API로 .astro 컴포넌트를 렌더하기 위해 Astro Vite 설정으로 감싼다 (FND-R12 AC1)
export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
