import { expect, test } from '@playwright/test';

test('홈에서 상세를 탐색하고 새로고침과 잘못된 ID를 처리한다', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const outline = page.getByRole('navigation', { name: '포트폴리오 구성' });
  await expect(outline.locator(':scope > ul > li')).toHaveCount(6);
  await expect(page.locator('.project-teaser img')).toHaveCount(2);
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('animation-name', 'slide-fade-in');
  const startFrames = await page.locator('.hero > :is(.eyebrow, h1)').evaluateAll((elements) => elements.map((element) => {
    const [animation] = element.getAnimations();
    animation.pause();
    animation.currentTime = 0;
    const style = getComputedStyle(element);
    return { x: new DOMMatrix(style.transform).m41, opacity: Number(style.opacity) };
  }));
  expect(startFrames[0].x).toBeLessThan(0);
  expect(startFrames[1].x).toBeGreaterThan(0);
  expect(startFrames.every(({ opacity }) => opacity > 0 && opacity < 1)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('animation-name', 'none');
  const toggle = page.getByRole('button', { name: '포트폴리오 구성' });
  const outline = page.locator('#portfolio-outline');
  await expect(outline).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await outline.getByRole('link', { name: '스터디룸 예약 관리 시스템', exact: true }).click();
  await expect(outline).toBeHidden();
  await toggle.click();
  await outline.getByRole('link', { name: '동시 예약 8건, 성공 1건' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('같은 스터디룸의 동시 예약 제어');
  await expect(outline).toBeHidden();
  await expect(page.getByRole('main')).toBeFocused();
  await page.getByRole('link', { name: '프로젝트의 기술 사례 목록' }).click();
  await expect(page.getByRole('main').getByRole('link', { name: '같은 스터디룸의 동시 예약 제어' }).first()).toBeVisible();
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

test('시연 영상이 실패해도 원본과 본문을 표시한다', async ({ page }) => {
  await page.route('**/*.mp4', (route) => route.abort());
  await page.goto('/#/projects/creature');
  await page.getByRole('button', { name: '성장 영상 열기' }).click();
  await expect(page.getByRole('status')).toHaveText('영상을 불러오지 못했습니다.');
  await expect(page.getByRole('link', { name: '원본 보기' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '역할과 팀 성과' })).toBeVisible();
});

test('이미지 확대를 키보드로 닫으면 포커스가 돌아온다', async ({ page }) => {
  await page.goto('/#/projects/study-room');
  const trigger = page.getByRole('button', { name: '예약 신청 이미지 확대' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('두 프로젝트 본문에서 실제 기능 화면 네 개씩을 디코딩한다', async ({ page }) => {
  for (const project of ['creature', 'study-room']) {
    await page.goto('/#/projects/' + project);
    await page.getByRole('button', { name: '실제 기능 화면', exact: true }).click();
    await expect(page.getByRole('heading', { name: '실제 기능 화면' })).toBeFocused();
    const images = page.locator('[data-gallery="features"] .exhibit-trigger img');
    await expect(images).toHaveCount(4);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((element) => element.decode());
      expect(await image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(300);
    }
  }
});

test('실제 시연 파일을 재생하고 이전 사례 주소를 새 소속으로 연결한다', async ({ page }) => {
  await page.goto('/#/projects/creature');
  await page.getByRole('button', { name: '공개 그룹 가입 시연 보기' }).click();
  const clip = page.getByRole('dialog').locator('video');
  await expect.poll(() => clip.evaluate((element) => element.readyState)).toBeGreaterThan(0);
  await clip.evaluate((element) => element.play().then(() => undefined));
  await expect.poll(() => clip.evaluate((element) => element.currentTime)).toBeGreaterThan(0);
  await page.goto('/#/engineering/reservation');
  await expect(page).toHaveURL(/#\/projects\/study-room\/cases\/reservation$/);
  await expect(page.getByRole('figure', { name: '같은 방을 예약하는 요청 A와 B' })).toBeVisible();
  await page.goto('/#/engineering/legacy');
  await expect(page).toHaveURL(/#\/experiences\/legacy$/);
  await expect(page.getByRole('figure').filter({ hasText: 'CSV 처리 시간 비교' })).toBeVisible();
});

test('프로젝트에 귀속된 모든 기술 사례가 자체 도식과 근거를 제공한다', async ({ page }) => {
  for (const [project, expectedCount] of [['creature', 8], ['study-room', 3]]) {
    await page.goto('/#/projects/' + project);
    const links = page.locator('.case-list').getByRole('link');
    await expect(links).toHaveCount(expectedCount);
    const paths = await links.evaluateAll((items) => items.map((item) => item.getAttribute('href')));
    for (const path of paths) {
      expect(path).toContain('#/projects/' + project + '/cases/');
      await page.goto('/' + path);
      await expect(page.locator('.decision-diagram')).toBeVisible();
      await expect(page.getByText('검증 범위', { exact: true })).toBeVisible();
      await expect(page.locator('.links a').first()).toBeVisible();
    }
  }
  await page.goto('/#/experiences?area=product-data');
  await expect(page.getByRole('heading', { name: '제품·데이터' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '현업 개발' })).toHaveCount(0);
});
