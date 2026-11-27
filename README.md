# 이희백 · 개발자 포트폴리오

React, TypeScript, Vite로 구성한 정적 포트폴리오입니다.

[포트폴리오 사이트 열기](https://heebaek200.github.io/developer-portfolio/)

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

## GitHub Pages 배포

Pages의 배포 소스는 GitHub Actions입니다. `main`에 푸시하거나 `main`에서 배포 워크플로를 수동 실행하면 린트·테스트·빌드를 통과한 `dist/`가 게시됩니다.
