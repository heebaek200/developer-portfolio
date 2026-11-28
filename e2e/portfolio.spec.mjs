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
  await expect(page.getByRole('heading', { level: 1 })).toContainText('팀이 만드는 방식도 개선합니다');
  await page.goto('/#/projects/missing');
  await page.getByRole('link', { name: '프로젝트 목록', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('완료 프로젝트');
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
  await expect(page.getByRole('heading', { name: '완료 프로젝트' })).toBeVisible();
  await expect(page.getByRole('row').filter({ hasText: 'GitHub Project Bootstrapper' })).toContainText('개인 프로젝트');
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
      await expect(page.getByText('적용과 결과', { exact: true })).toBeVisible();
      await expect(page.locator('.links a').first()).toBeVisible();
    }
  }
  await page.goto('/#/experiences?area=product-data');
  await expect(page.getByRole('heading', { name: '제품·데이터' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '현업 개발' })).toHaveCount(0);
});

test('공동 육성에서 리뷰, QA 후속, 팀원 구현의 역할을 구분한다', async ({ page }) => {
  await page.goto('/#/engineering/qa');
  await expect(page).toHaveURL(/#\/projects\/creature\/cases\/qa$/);
  await expect(page.getByRole('main').locator('.meta')).toContainText(/이슈.*PR/);
  await page.goto('/#/projects/creature/cases/season-header');
  await expect(page.getByRole('main').locator('.meta')).toContainText('최초 리뷰·수정 요청·재리뷰 승인 / 팀원 · 코드 구현');
  await page.goto('/#/projects/creature');
  const credits = page.getByRole('row').filter({ hasText: '팀원 · 구현' });
  await expect(credits).toContainText('아바타 렌더링 방식 선택');
  await expect(credits).toContainText('공통 헤더 시즌 타이머 갱신');
  await expect(page.locator('a[href$="/cases/avatar-rendering"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '프로젝트 종료 후 팀 워크숍' })).toBeVisible();
});

test('결제 전이와 스케줄러 검증의 근거를 개별 사례에서 제공한다', async ({ page }) => {
  await page.goto('/#/projects/creature/cases/payment');
  await expect(page.locator('.state-transitions tbody tr')).toHaveCount(4);
  await page.goto('/#/projects/creature/cases/scheduler');
  await expect(page.locator('a[href$="/QA-02-rewards-scheduler.md"]')).toBeVisible();
  await expect(page.locator('a[href$="/pull/86#issuecomment-6809447816"]')).toBeVisible();
});

test('홈의 첫 탐색이 개발 생산성으로 이어지고 자격증은 경력에 표시한다', async ({ page }) => {
  await page.goto('/');
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { level: 1 })).toHaveText('소프트웨어를 만들고, 팀이 만드는 방식도 개선합니다.');
  await expect(main).not.toContainText(/JLPT|완료 팀 프로젝트 \d+개|90%|CSV/);
  await expect(main.locator('.facts')).toHaveCount(0);
  await main.getByRole('link', { name: '제가 설계한 개발 방식' }).click();
  await expect(page).toHaveURL(/#\/productivity$/);
  await expect(main.getByRole('heading', { level: 1 })).toHaveText('개발 생산성');
  await expect(main.getByRole('row').filter({ hasText: 'STEYR' })).toContainText('공동 육성 종료 후 정립');
  await expect(main.locator('.workflow-decisions > li')).toHaveCount(4);
  await expect(main.locator('.workflow-decisions')).toContainText('REST·GraphQL');
  await expect(main.getByRole('link', { name: 'GitHub Project Bootstrapper 개인 프로젝트 보기' })).toBeVisible();
  await page.goto('/#/career');
  await expect(main.getByRole('heading', { name: '업무 시스템과 복잡한 화면' })).toBeVisible();
  await expect(main.getByRole('heading', { name: '프리랜서 영상 편집·채널 운영' })).toBeVisible();
  await expect(main).toContainText('JLPT N1 · 2021년 취득');
});

test('프로젝트 목록은 실제 제품 화면을 대표 이미지로 사용한다', async ({ page }) => {
  await page.goto('/#/projects');
  const covers = page.locator('.project-cover img');
  const files = ['creature-growth.webp', 'study-rooms.webp', 'bootstrapper-project.png'];
  await expect(covers).toHaveCount(files.length);
  for (const [index, file] of files.entries()) {
    const cover = covers.nth(index);
    await expect(cover).toHaveAttribute('src', './evidence/' + file);
    await cover.scrollIntoViewIfNeeded();
    await cover.evaluate((image) => image.decode());
  }
});

test('두 팀 프로젝트는 설계 증빙을 먼저 보여주고 협업과 기능 화면을 유지한다', async ({ page }) => {
  for (const [project, alt, count] of [['study-room', '스터디룸 Wiki 설계 문서 목록', 2], ['creature', '공동 육성 설계 문서 목록', 5]]) {
    await page.goto('/#/projects/' + project);
    const main = page.getByRole('main');
    const firstImage = main.locator('img').first();
    await expect(firstImage).toHaveAttribute('alt', alt);
    await expect(main.locator('[data-gallery="design"] img')).toHaveCount(count);
    const documents = main.locator('[data-gallery^="design"] img');
    for (const image of await documents.all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((img) => img.decode());
    }
    const trigger = main.getByRole('button', { name: alt + ' 이미지 확대' });
    await trigger.click();
    await expect(page.getByRole('dialog').getByRole('img', { name: alt })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(main.locator('[data-gallery="features"] img')).toHaveCount(4);
    if (project === 'study-room') {
      await expect(main.locator('[data-gallery="records"] img').first()).toHaveAttribute('src', './evidence/study-roadmap.png');
      await expect(main.getByRole('link', { name: '스터디룸 Projects 보드' })).toHaveAttribute('href', 'https://github.com/users/heebaek200/projects/5');
    }
  }
});

test('개인 프로젝트는 실제 두 GUI와 실행 범위를 제공하고 AI 실행 계약으로 연결한다', async ({ page }) => {
  await page.goto('/#/projects');
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { name: '팀 프로젝트', exact: true })).toBeVisible();
  await expect(main.getByRole('heading', { name: '개인 프로젝트', exact: true })).toBeVisible();
  await main.getByRole('link', { name: 'GitHub Project Bootstrapper', exact: true }).click();
  await expect(page).toHaveURL(/#\/projects\/bootstrapper$/);
  const screenshots = main.locator('[data-gallery="setup"] img');
  await expect(screenshots).toHaveCount(2);
  const notes = main.locator('[data-gallery="design"] img');
  await expect(notes).toHaveCount(2);
  for (const img of await screenshots.or(notes).all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate((image) => image.decode());
  }
  await expect(main.getByRole('row', { name: /Wiki Home 수동 생성/ })).toBeVisible();
  await expect(main).toContainText('공개 여부가 Public으로 바뀔 수 있습니다');
  await main.getByRole('link', { name: '개발 생산성 · 팀 설계와 AI 실행 계약' }).click();
  await expect(page).toHaveURL(/#\/productivity\/execution-contract$/);
  await expect(main.getByRole('heading', { name: '팀 설계와 AI 실행 계약' })).toBeFocused();
  await expect(main.locator('.workflow-map')).toContainText('계약 변경이 필요할 때');
  await expect(main.locator('.contract-example code')).toContainText('environment.mysql-profiles');
  await expect(main.getByRole('link', { name: '공통 기반 PR #10' })).toHaveAttribute('href', 'https://github.com/heebaek200/shared-creature-game/pull/10');
  const contracts = main.locator('[data-gallery="design"] img');
  await expect(contracts).toHaveCount(4);
  for (const img of await contracts.all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate((image) => image.decode());
  }
  await expect(main.locator('a[href*="personal-knowledge-base"]')).toHaveCount(0);
});

test('이전 개발 생산성·About 주소는 새 정보 구조로 연결된다', async ({ page }) => {
  await page.goto('/#/experiences?area=productivity');
  await expect(page).toHaveURL(/#\/productivity$/);
  await page.goto('/#/engineering/workflow');
  await expect(page).toHaveURL(/#\/productivity\/workflow$/);
  await expect(page.getByRole('heading', { name: '명세를 팀의 작업 기준으로' })).toBeFocused();
  await page.goto('/#/about');
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'GitHub' })).toBeVisible();
});

test('공개 페이지와 인쇄 요약에 내부 보고용 문구가 남아 있지 않다', async ({ page }) => {
  const roots = ['', 'productivity', 'projects', 'projects/creature', 'projects/study-room', 'projects/bootstrapper', 'experiences', 'career', 'skills', 'print'];
  const paths = new Set(roots.map((root) => '/#/' + root));
  const internalWording = /미검증|NOT RUN|재실행하지 않았|검증 결과에 포함되지|검증 범위 밖|확인하지 못했|별도로 측정하지|제시할 자료는 없|증빙 미확보|\(회고\)|\(사용자 진술\)/;
  const main = page.getByRole('main');
  for (const path of paths) {
    await page.goto(path);
    await expect(main.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(main).not.toContainText(internalWording);
    if (!path.endsWith('/experiences/legacy')) await expect(main).not.toContainText(/약 30초|약 90%/);
    const detailLinks = await main.locator('a').evaluateAll((anchors) => anchors.map((link) => link.getAttribute('href')).filter((href) =>
      href?.startsWith('#/experiences/') || href?.includes('/cases/'),
    ));
    for (const link of detailLinks) paths.add('/' + link);
  }
});
