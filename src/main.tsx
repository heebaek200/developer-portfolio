import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { career, credentials, profile, projects, skills, type Case, type Evidence, type Project } from './content';
import { dossiers, getProjectCases } from './casebook';
import { experiences } from './experiences';
import { DecisionDiagram, Gallery, GrowthFilm, mediaPath } from './exhibits';
import './styles.css';

interface OutlineItem { url: string; label: string; children?: OutlineItem[] }

const menus: OutlineItem[] = [
  { url: '/', label: 'Home' },
  { url: '/career', label: 'Career' },
  { url: '/skills', label: 'Skills' },
  { url: '/projects', label: 'Projects', children: projects.map(({ id, title }) => ({
    url: '/projects/' + id, label: title,
    children: getProjectCases(id).map((item) => ({ url: casePath(id, item.id), label: item.outlineTitle })),
  })) },
  { url: '/experiences', label: 'Experiences', children: experiences.map(({ id, title }) => ({ url: '/experiences?area=' + id, label: title })) },
  { url: '/about', label: 'About' },
];

/** 사례의 소속과 안정적인 상세 주소를 함께 결정한다. */
function casePath(projectId: string, caseId: string) {
  return '/projects/' + projectId + '/cases/' + caseId;
}

/** 저장이 제한된 브라우저에서는 시스템 테마를 초기값으로 사용한다. */
function readTheme() {
  try {
    const stored = localStorage.getItem('portfolio-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch { /* 현재 화면은 저장 권한 없이도 동작한다. */ }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** 콘텐츠 데이터에서 탐색 계층을 만들고 현재 페이지의 경로를 강조한다. */
function SiteOutline({ pathname }: { pathname: string }) {
  const [expanded, setExpanded] = useState(false);
  const { search } = useLocation();
  const toggle = useRef<HTMLButtonElement>(null);

  function close(event: MouseEvent<HTMLAnchorElement>, target: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setExpanded(false);
    if (target.split('?')[0] === pathname && toggle.current?.offsetWidth) toggle.current.focus();
  }

  function renderOutline(items: OutlineItem[], depth = 0): ReactNode {
    return <ul>{items.map(({ url, label, children }) => {
      const queryLink = url.includes('?');
      const active = queryLink ? pathname + search === url : pathname === url || pathname.startsWith(url + '/');
      return <li key={url} data-current-branch={active}>
        {queryLink || (url === '/experiences' && search)
          ? <Link to={url} aria-current={queryLink && active ? 'page' : undefined} onClick={(event) => close(event, url)}>{label}</Link>
          : <NavLink to={url} end onClick={(event) => close(event, url)}>{label}</NavLink>}
        {children && (depth === 0 || active) && renderOutline(children, depth + 1)}
      </li>;
    })}</ul>;
  }
  return <aside className="site-outline">
    <p className="outline-heading">포트폴리오 구성</p>
    <button ref={toggle} type="button" className="outline-toggle" aria-expanded={expanded} aria-controls="portfolio-outline" onClick={() => setExpanded(!expanded)}>
      포트폴리오 구성 <span aria-hidden="true">{expanded ? '−' : '+'}</span>
    </button>
    <nav id="portfolio-outline" aria-label="포트폴리오 구성" data-expanded={expanded}>
      {renderOutline(menus)}
    </nav>
  </aside>;
}

/** 공통 탐색과 페이지 이동 시 문서 제목 및 본문 포커스를 관리한다. */
function Layout() {
  const [theme, setTheme] = useState(readTheme);
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    const title = main.current?.querySelector('h1')?.textContent;
    document.title = pathname === '/' || !title ? '이희백 · 개발자 포트폴리오' : title + ' · 이희백';
    if (first.current) { first.current = false; return; }
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('portfolio-theme', next); } catch { /* 세션 상태는 이미 갱신했다. */ }
  }

  return <>
    <a className="skip" href="#main-content" onClick={(e) => { e.preventDefault(); main.current?.focus(); }}>본문으로 건너뛰기</a>
    <div className="site-layout">
      <SiteOutline pathname={pathname} />
      <main id="main-content" ref={main} tabIndex={-1}>
        <div key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/career" element={<Career />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/projects/:projectId/cases/:caseId" element={<ProjectCaseDetail />} />
            <Route path="/experiences" element={<ExperienceIndex />} />
            <Route path="/experiences/:caseId" element={<ExperienceDetail />} />
            <Route path="/engineering" element={<Navigate replace to="/experiences" />} />
            <Route path="/engineering/:caseId" element={<LegacyCase />} />
            <Route path="/about" element={<About />} />
            <Route path="/print" element={<Print />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
    <footer className="site-footer">
      <span>이희백</span>
      <Link to="/print">인쇄용 요약</Link>
      <a href={profile.github}>GitHub</a>
      <button type="button" className="quiet-button theme-toggle" onClick={toggleTheme}>{theme === 'dark' ? '라이트 모드' : '다크 모드'}</button>
    </footer>
  </>;
}

/** 페이지 제목과 내용을 공통 여백 안에 배치한다. */
function Page({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return <><header className="page-heading"><h1>{title}</h1>{lead && <p className="lead">{lead}</p>}</header>{children}</>;
}

/** 외부 근거는 해당 사례와 함께 탐색할 수 있게 표시한다. */
function EvidenceLinks({ items }: { items: Evidence[] }) {
  return !!items.length && <ul className="links">{items.map((item) => <li key={item.url}><a href={item.url}>{item.label}</a></li>)}</ul>;
}

/** 홈에서 실제 화면과 함께 두 프로젝트의 상세 사례집을 소개한다. */
function Home() {
  return <>
    <header className="hero">
      <p className="eyebrow">{profile.role}</p>
      <h1>{profile.headline}</h1>
      <p className="lead">{profile.introduction}</p>
      <ul className="facts"><li>개발 실무 6년 6개월</li><li>완료 팀 프로젝트 {projects.length}개</li><li>JLPT N1 · 2021년 취득</li></ul>
    </header>
    <section className="section"><h2>프로젝트 사례집</h2>
      <div className="project-exhibits">{projects.map((project) => <ProjectTeaser key={project.id} project={project} />)}</div>
    </section>
    <section className="section"><h2>프로젝트 밖의 경험</h2>
      <ul className="case-list">{experiences.map((area) => <li key={area.id}><Link to={'/experiences?area=' + area.id}>{area.title}</Link><p>{area.summary}</p></li>)}</ul>
    </section>
  </>;
}

/** 실제 캡처, 서비스 요약, 역할을 한 프로젝트 소개 안에서 연결한다. */
function ProjectTeaser({ project }: { project: Project }) {
  const dossier = dossiers[project.id];
  const cover = dossier.captures[2];
  return <article className={'project-teaser project-' + project.id}>
    <div className="teaser-copy">
      <p className="eyebrow">{project.team}</p>
      <h2><Link to={'/projects/' + project.id}>{project.title}</Link></h2>
      <p>{dossier.strap}</p>
      <p className="teaser-stack">{project.stack}</p>
    </div>
    <img loading="lazy" src={mediaPath(project.id === 'creature' ? 'creature-showcase' : cover.key)} alt={cover.label + ' 시연 화면'} />
  </article>;
}

/** 역할과 업무의 차이가 드러나도록 경력과 기술을 표로 정리한다. */
function DataTable({ headings, rows }: { headings: string[]; rows: string[][] }) {
  return <div className="table-scroll"><table>
    <thead><tr>{headings.map((heading) => <th scope="col" key={heading}>{heading}</th>)}</tr></thead>
    <tbody>{rows.map(([first, ...rest]) => <tr key={first}><th scope="row">{first}</th>{rest.map((cell, index) => <td key={headings[index + 1]}>{cell}</td>)}</tr>)}</tbody>
  </table></div>;
}

/** 업무 흐름과 교육·자격을 경력 페이지에 제공한다. */
function Career() {
  return <Page title="개발과 사용자 경험을 함께 쌓아온 경력">
    <DataTable headings={['기간', '역할', '업무']} rows={career} />
    <section className="section"><h2>실무에서 개선한 일</h2><p><Link to="/experiences/legacy">레거시 CSV 처리 프로그램 재설계</Link></p>
      <DataTable headings={['사례', '업무']} rows={[
        ['메타데이터 기반 공통 코어', 'DB의 메타 정의를 서버 검증과 화면 필드가 참조하도록 구성했습니다.'],
        ['사내 도시락 신청 자동화', '신청·취소 화면, 집계와 전달 흐름을 연결했습니다.'],
        ['SaaS 데이터 격리', '고객사별 조회 조건 누락을 줄이기 위한 공통 조건 적용 방향을 검토했습니다.'],
        ['콘텐츠 운영', '채널 동향 분석, 사용자 반응이 집중된 구간 탐색, 성과에 따른 제작 시간 재배분을 수행했습니다.'],
      ]} />
    </section>
    <section className="section"><h2>학력·교육·자격</h2><p>동아대학교 컴퓨터공학과 학사 · 2014년 졸업</p>
      <p>공공데이터 융합 생성형 AI 활용 풀스택 개발자 양성과정 · 2026년 7월부터 수강 중</p>
      <ul>{credentials.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  </Page>;
}

/** 활용 맥락별 기술을 표시한다. */
function Skills() {
  return <Page title="기술과 활용 범위" lead="실무, 팀 프로젝트, 학습과 실습에서 사용한 기술을 구분했습니다.">
    <DataTable headings={['활용 맥락', '기술']} rows={skills} />
  </Page>;
}

/** 완료 프로젝트 목록을 상세 경로와 연결한다. */
function Projects() {
  return <Page title="완료 팀 프로젝트" lead="실제 화면에서 시작해, 설계 결정과 검증 범위까지 이어지는 두 프로젝트의 사례집입니다.">
    <div className="project-exhibits">{projects.map((project) => <ProjectTeaser key={project.id} project={project} />)}</div>
  </Page>;
}

const projectSections = [
  ['purpose', '기획과 서비스'],
  ['screens', '실제 기능 화면'],
  ['team', '역할과 협업'],
  ['decisions', '기술적 판단'],
  ['verification', '검증과 회고'],
];

/** 동일한 본문 안에서 각 섹션을 스크롤하고 키보드 포커스를 옮긴다. */
function ProjectSections() {
  return <nav className="section-jump" aria-label="프로젝트 페이지 목차">
    {projectSections.map(([id, label]) => <button type="button" key={id} onClick={() => {
      const heading = document.getElementById(id);
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: 'start' });
    }}>{label}</button>)}
  </nav>;
}

/** 프로젝트 서사 속에 기능 화면, 기여, 기술 도식, 검증을 배치한다. */
function ProjectDetail() {
  const { projectId } = useParams();
  const project = projects.find((item) => item.id === projectId);
  if (!project) return <NotFound recovery="/projects" label="프로젝트 목록" />;
  const dossier = dossiers[project.id];
  const projectCases = getProjectCases(project.id);
  const featured = projectCases.find((item) => item.id === dossier.featuredCase);
  return <Page title={project.title} lead={dossier.strap}>
    <ul className="project-facts"><li>{project.period}</li><li>{project.team}</li><li>{project.stack}</li></ul>
    <ProjectSections />
    {project.id === 'creature' && <GrowthFilm />}
    <section className="section">
      <h2 id="purpose" tabIndex={-1}>기획과 서비스</h2>
      {dossier.background.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <DecisionDiagram diagram={{ title: '사용자가 기능을 이용하는 흐름', kind: 'timeline', columns: dossier.flow.map((label, index) => ({ label: String(index + 1), steps: [label] })) }} />
      <DataTable headings={['기능', '서비스에서의 역할']} rows={dossier.features} />
      <DecisionDiagram diagram={dossier.architecture} />
    </section>
    <section className="section">
      <h2 id="screens" tabIndex={-1}>실제 기능 화면</h2>
      <p className="meta">테스트 환경의 실제 UI입니다. 시연에는 테스트 계정과 예시 데이터가 사용됐습니다.</p>
      <Gallery items={dossier.captures} />
    </section>
    <section className="section">
      <h2 id="team" tabIndex={-1}>역할과 팀 성과</h2>
      <DataTable headings={['구분', '기여와 결과']} rows={dossier.roles} />
      <p>{dossier.management}</p>
      {!!dossier.records.length && <Gallery items={dossier.records} kind="records" />}
      <EvidenceLinks items={project.evidence} />
    </section>
    <section className="section">
      <h2 id="decisions" tabIndex={-1}>기술적 판단과 트러블슈팅</h2>
      {featured && <article className="featured-decision">
        <h3><Link to={casePath(project.id, featured.id)}>{featured.title}</Link></h3>
        <p>{featured.problem}</p>
        <DecisionDiagram diagram={featured.diagram} />
        <p>{featured.verification}</p>
      </article>}
      <CaseList items={projectCases} href={(item) => casePath(project.id, item.id)} />
    </section>
    <section className="section">
      <h2 id="verification" tabIndex={-1}>검증과 회고</h2>
      <DataTable headings={['검증 범위', '기록된 결과', '근거']} rows={dossier.qa} />
      <EvidenceLinks items={dossier.qaLinks} />
      <p>{dossier.reflection}</p>
    </section>
    <Link to="/projects">프로젝트 목록</Link>
  </Page>;
}

/** 사례의 전체 제목을 표시하고 해당 영역 아래의 상세 주소로 이동한다. */
function CaseList({ items, href }: { items: Case[]; href: (item: Case) => string }) {
  return <ul className="case-list">{items.map((item) => <li key={item.id}>
    <Link to={href(item)}>{item.title}</Link><p>{item.summary}</p>
  </li>)}</ul>;
}

/** 현업 개발, 개발 생산성, 제품·데이터 경험을 프로젝트와 별도로 탐색한다. */
function ExperienceIndex() {
  const { search } = useLocation();
  const activeArea = new URLSearchParams(search).get('area');
  const selected = experiences.find((area) => area.id === activeArea);
  return <Page title="경험 사례집" lead="현업 개발, 팀 개발 생산성, 콘텐츠 운영과 데이터 활용 경험을 모았습니다.">
    <nav className="section-jump" aria-label="경험 분류">
      <Link to="/experiences" aria-current={!selected ? 'page' : undefined}>전체</Link>
      {experiences.map((area) => <Link key={area.id} to={'/experiences?area=' + area.id} aria-current={selected === area ? 'page' : undefined}>{area.title}</Link>)}
    </nav>
    {(selected ? [selected] : experiences).map((area) => <section className="section" key={area.id}>
      <h2>{area.title}</h2><p>{area.summary}</p><CaseList items={area.items} href={(item) => '/experiences/' + item.id} />
    </section>)}
  </Page>;
}

/** 사례의 문제, 선택, 검증 범위를 읽는 순서대로 정리한다. */
function CaseNarrative({ item }: { item: Case }) {
  return <dl className="case-detail">{[['문제', item.problem], ['판단', item.decision], ['검증 범위', item.verification]].map(([label, value]) => <div key={label}>
    <dt>{label}</dt><dd>{value}</dd>
  </div>)}</dl>;
}

/** 프로젝트 소속을 주소와 상단 탐색에서 보존하는 트러블슈팅 상세. */
function ProjectCaseDetail() {
  const { projectId, caseId } = useParams();
  const project = projects.find((item) => item.id === projectId);
  const item = project && getProjectCases(project.id).find((candidate) => candidate.id === caseId);
  if (!project || !item) return <NotFound recovery="/projects" label="프로젝트 목록" />;
  return <>
    <p className="breadcrumb"><Link to={'/projects/' + project.id}>{project.title}</Link> / 트러블슈팅</p>
    <Page title={item.title} lead={item.summary}>
      <p className="meta">{item.role}</p>
      <DecisionDiagram diagram={item.diagram} />
      <CaseNarrative item={item} />
      <EvidenceLinks items={item.evidence} />
      <Link to={'/projects/' + project.id}>프로젝트의 기술 사례 목록</Link>
    </Page>
  </>;
}

/** 프로젝트와 별개로 쌓은 작업 경험의 상세. */
function ExperienceDetail() {
  const { caseId } = useParams();
  const area = experiences.find((group) => group.items.some((item) => item.id === caseId));
  const item = area?.items.find((candidate) => candidate.id === caseId);
  if (!area || !item) return <NotFound recovery="/experiences" label="경험 목록" />;
  return <Page title={item.title} lead={item.summary}>
    <p className="breadcrumb"><Link to={'/experiences?area=' + area.id}>{area.title} 사례 목록</Link></p>
    {item.id === 'legacy' && <figure className="runtime-chart">
      <figcaption>약 1만 건의 CSV 처리 시간 비교</figcaption>
      <div><span>기존 · 약 30초</span><meter min="0" max="30" value="30" aria-label="기존 약 30초" /></div>
      <div><span>재구현 · 약 3초</span><meter min="0" max="30" value="3" aria-label="재구현 약 3초" /></div>
    </figure>}
    <CaseNarrative item={item} /><EvidenceLinks items={item.evidence} />
  </Page>;
}

/** 이전 Engineering 주소를 사례의 현재 소속으로 연결한다. */
function LegacyCase() {
  const { caseId } = useParams();
  if (caseId === 'qa') return <Navigate replace to="/projects/creature" />;
  const project = projects.find(({ id }) => getProjectCases(id).some((item) => item.id === caseId));
  if (project && caseId) return <Navigate replace to={casePath(project.id, caseId)} />;
  if (experiences.some((area) => area.items.some((item) => item.id === caseId))) return <Navigate replace to={'/experiences/' + caseId} />;
  return <NotFound recovery="/experiences" label="경험 목록" />;
}

/** 개발 방식과 실제 제공된 연락 수단을 보여준다. */
function About() {
  return <Page title="팀이 검증할 수 있게 개발합니다" lead={profile.introduction}>
    <DataTable headings={['원칙', '작업 방식']} rows={[
      ['요구사항 먼저', '기능을 구현하기 전에 사용자 가치와 완료 조건을 정합니다.'],
      ['반복 업무 표준화', '반복 작업을 문서화하고 유지할 수 있는 범위에서 자동화합니다.'],
      ['사람이 결과 검증', 'AI를 활용하고 설계 선택·검증·승인에 책임을 집니다.'],
      ['팀의 자율성', '이슈와 리뷰로 다음 작업과 완료 조건을 공유합니다.'],
    ]} /><p><a href={profile.github}>GitHub 프로필</a></p>
  </Page>;
}

/** 화면과 같은 콘텐츠 데이터로 인쇄 가능한 요약을 제공한다. */
function Print() {
  return <Page title={profile.name + ' · ' + profile.role} lead={profile.introduction}>
    <button className="quiet-button print-action" onClick={() => window.print()}>인쇄 또는 PDF 저장</button>
    <section className="section"><h2>경력·자격</h2><DataTable headings={['기간', '역할', '업무']} rows={career} /><p>{credentials.join(' / ')}</p></section>
    <section className="section"><h2>주요 역량</h2><DataTable headings={['활용 맥락', '기술']} rows={skills} /></section>
    <section className="section"><h2>완료 팀 프로젝트</h2><DataTable headings={['프로젝트', '역할', '내용']} rows={projects.map((project) => [project.title, project.team, project.summary])} /></section>
    <section className="section"><h2>대표 사례</h2><DataTable headings={['사례', '요약']} rows={[
      ...projects.flatMap((project) => getProjectCases(project.id).slice(0, 1)),
      ...experiences.flatMap((group) => group.items.slice(0, 1)),
    ].map((item) => [item.title, item.summary])} /><p><a href={profile.github}>{profile.github}</a></p></section>
  </Page>;
}

/** 주소로 접근할 수 없는 페이지에서 관련 목록으로 돌아갈 경로를 제공한다. */
function NotFound({ recovery = '/', label = '홈으로' }: { recovery?: string; label?: string }) {
  return <Page title="페이지를 찾을 수 없습니다"><Link to={recovery}>{label}</Link></Page>;
}

createRoot(document.getElementById('root')!).render(<HashRouter><Layout /></HashRouter>);
