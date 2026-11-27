import { expect, test } from '@playwright/test';

test('홈에서 상세를 탐색하고 새로고침과 잘못된 ID를 처리한다', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const outline = page.getByRole('navigation', { name: '포트폴리오 구성' });
  await expect(outline.locator(':scope > ul > li')).toHaveCount(6);
  await expect(page.locator('.video-cover img')).toHaveJSProperty('complete', true);
  const project = outline.getByRole('link', { name: '다 같이 키우는 생명체', exact: true });
  await project.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('다 같이 키우는 생명체');
  await expect(project).toHaveAttribute('aria-current', 'page');
  await expect(outline.getByRole('link', { name: 'Projects' }).locator('..')).toHaveAttribute('data-current-branch', 'true');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('다 같이 키우는 생명체');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('팀이 검증할 수 있게');
  await page.goto('/#/projects/missing');
  await page.getByRole('link', { name: '프로젝트 목록', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('완료 팀 프로젝트');
  expect(errors).toEqual([]);
});

test('모바일 탐색을 펼쳐 사례로 이동하고 모션 감소 설정을 지킨다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 820 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('animation-name', 'text-enter');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('animation-name', 'none');
  const toggle = page.getByRole('button', { name: '포트폴리오 구성' });
  const outline = page.locator('#portfolio-outline');
  await expect(outline).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await outline.getByRole('link', { name: '같은 스터디룸의 동시 예약 제어' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('같은 스터디룸의 동시 예약 제어');
  await expect(outline).toBeHidden();
  await expect(page.getByRole('main')).toBeFocused();
});

test('화면 폭별 넘침, 테마 유지, 인쇄 레이아웃을 확인한다', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/#/print');
  await expect(page.getByRole('banner')).toHaveCount(0);
  const footer = page.getByRole('contentinfo');
  await footer.getByRole('button', { name: '다크 모드' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  for (const width of [390, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('navigation')).toBeHidden();
  await expect(footer).toBeHidden();
  await expect(page.getByRole('heading', { name: '완료 팀 프로젝트' })).toBeVisible();
  expect((await page.pdf({ preferCSSPageSize: true })).subarray(0, 4).toString()).toBe('%PDF');
});

test('외부 미디어가 실패해도 원본과 본문을 표시한다', async ({ page }) => {
  await page.route('**/*.mp4', (route) => route.abort());
  await page.goto('/#/projects/creature');
  await page.getByRole('button', { name: '영상 열기' }).click();
  await expect(page.getByRole('status')).toHaveText('미디어를 불러오지 못했습니다.');
  await expect(page.getByRole('link', { name: '원본 보기' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '역할과 팀 성과' })).toBeVisible();
});

test('이미지 확대를 키보드로 닫으면 포커스가 돌아온다', async ({ page }) => {
  await page.route('https://raw.githubusercontent.com/**', (route) => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"/>',
  }));
  await page.goto('/#/projects/study-room');
  const trigger = page.getByRole('button', { name: /이미지 확대/ });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
});
