import { defineConfig } from 'vite';

/** 저장소 하위 경로에서도 정적 자산을 현재 페이지 기준으로 불러온다. */
export default defineConfig({ base: './' });
