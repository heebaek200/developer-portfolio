import tseslint from 'typescript-eslint';

/** 소스의 TypeScript 문법과 기본 오류를 검사한다. */
export default [
  { ignores: ['dist/**', 'test-results/**', 'playwright-report/**'] },
  ...tseslint.configs.recommended,
];
