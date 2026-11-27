# 이희백 · 개발자 포트폴리오

React, TypeScript, Vite로 구성한 정적 포트폴리오입니다.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run test:browser
```

`src/content.ts`에서 프로젝트·사례·근거 링크를 관리합니다. 상세 화면은 콘텐츠 ID를 사용합니다. 인쇄용 요약은 `/#/print`에서 열 수 있습니다.

브라우저 검증은 설치된 Chrome을 사용하며, 빌드 이후 실행합니다.
