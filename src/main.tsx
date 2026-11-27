import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { career, cases, credentials, profile, projects, skills, type Evidence, type Project } from './content';
import creaturePoster from './moss-golem.png';
import './styles.css';

const menus = [
  { url: '/', label: 'Home' },
  { url: '/career', label: 'Career' },
  { url: '/skills', label: 'Skills' },
  { url: '/projects', label: 'Projects', children: projects.map(({ id, title }) => ({ id, title })) },
  { url: '/engineering', label: 'Engineering', children: cases.map(({ id, outlineTitle }) => ({ id, title: outlineTitle })) },
  { url: '/about', label: 'About' },
];

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
  const toggle = useRef<HTMLButtonElement>(null);

  function close(event: MouseEvent<HTMLAnchorElement>, target: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setExpanded(false);
    if (pathname === target && toggle.current?.offsetWidth) toggle.current.focus();
  }
  return <aside className="site-outline">
    <p className="outline-heading">포트폴리오 구성</p>
    <button ref={toggle} type="button" className="outline-toggle" aria-expanded={expanded} aria-controls="portfolio-outline" onClick={() => setExpanded(!expanded)}>
      포트폴리오 구성 <span aria-hidden="true">{expanded ? '−' : '+'}</span>
    </button>
    <nav id="portfolio-outline" aria-label="포트폴리오 구성" data-expanded={expanded}>
      <ul>{menus.map(({ url, label, children }) => <li key={url} data-current-branch={pathname === url || pathname.startsWith(url + '/')}>
        <NavLink to={url} end onClick={(event) => close(event, url)}>{label}</NavLink>
        {children && <ul>{children.map(({ id, title }) => <li key={id}>
          <NavLink to={url + '/' + id} end onClick={(event) => close(event, url + '/' + id)}>{title}</NavLink>
        </li>)}</ul>}
      </li>)}</ul>
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
            <Route path="/engineering" element={<Engineering />} />
            <Route path="/engineering/:caseId" element={<CaseDetail />} />
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

/** 해당 미디어의 실패 상태를 개별적으로 처리하며 원본 경로를 제공한다. */
function ProjectMedia({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const imageTrigger = useRef<HTMLButtonElement>(null);
  const media = project.video ?? project.image;
  if (!media) return null;
  return <figure className="project-media">
    {failed ? <p role="status">미디어를 불러오지 못했습니다.</p> : project.video
      ? playing
        ? <video controls playsInline preload="metadata" aria-label={media.label} src={media.url} onError={() => setFailed(true)} />
        : <div className="video-cover">
          <img src={creaturePoster} alt="" width={250} height={250} loading="lazy" />
          <span>{media.label}</span>
          <button type="button" onClick={() => setPlaying(true)}>영상 열기</button>
        </div>
      : <>
        <button type="button" className="image-trigger" ref={imageTrigger} onClick={() => dialog.current?.showModal()}>
          <img loading="lazy" decoding="async" src={media.url} alt={media.label} onError={() => setFailed(true)} />
          <span>이미지 확대</span>
        </button>
        <dialog ref={dialog} aria-label={media.label} onClose={() => imageTrigger.current?.focus()}>
          <form method="dialog"><button>닫기</button></form>
          <img loading="lazy" src={media.url} alt={media.label} />
        </dialog>
      </>}
    <figcaption>{media.label} · <a href={media.url}>원본 보기</a></figcaption>
  </figure>;
}

/** 홈에 경력 소개와 대표 프로젝트·기술 판단을 연결한다. */
function Home() {
  const featured = projects.find((project) => project.id === 'creature');
  return <>
    <header className="hero">
      <p className="eyebrow">{profile.role}</p>
      <h1>{profile.headline}</h1>
      <p className="lead">{profile.introduction}</p>
      <ul className="facts"><li>개발 실무 6년 6개월</li><li>완료 팀 프로젝트 {projects.length}개</li><li>JLPT N1 · 2021년 취득</li></ul>
    </header>
    {featured && <section className="section">
      <p className="eyebrow">대표 프로젝트</p>
      <h2><Link to={'/projects/' + featured.id}>{featured.title}</Link></h2>
      <p>{featured.summary}</p>
      <ProjectMedia project={featured} />
      <p><Link to="/projects">완료 프로젝트 모두 보기</Link></p>
    </section>}
    <section className="section"><h2>대표 엔지니어링 사례</h2><CaseList ids={['legacy', 'workflow', 'scheduler']} /></section>
  </>;
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
    <section className="section"><h2>실무에서 개선한 일</h2><CaseList ids={['legacy']} />
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
  return <Page title="완료 팀 프로젝트">{projects.map((project) => <article className="entry" key={project.id}>
    <h2><Link to={'/projects/' + project.id}>{project.title}</Link></h2>
    <p className="meta">{project.period} · {project.team}</p><p>{project.summary}</p>
  </article>)}</Page>;
}

/** 상세 페이지에서 팀 성과, 개인 역할, 시연과 기술 사례를 연결한다. */
function ProjectDetail() {
  const { projectId } = useParams();
  const project = projects.find((item) => item.id === projectId);
  if (!project) return <NotFound recovery="/projects" label="프로젝트 목록" />;
  return <Page title={project.title} lead={project.summary}>
    <p className="meta">{project.period} · {project.team}</p><p>{project.stack}</p>
    <ProjectMedia key={project.id} project={project} />
    <section className="section"><h2>역할과 팀 성과</h2><DataTable headings={['구분', '내용']} rows={[[ '내 역할', project.contribution ], [ '팀 성과', project.outcome ]]} /><EvidenceLinks items={project.evidence} /></section>
    <section className="section"><h2>관련 기술 사례</h2><CaseList ids={project.caseIds} /></section>
    <Link to="/projects">프로젝트 목록</Link>
  </Page>;
}

/** 전달받은 순서의 사례를 요약하고 상세 페이지에 연결한다. */
function CaseList({ ids = cases.map((item) => item.id) }: { ids?: string[] }) {
  return <ul className="case-list">{ids.map((id) => {
    const item = cases.find((candidate) => candidate.id === id);
    return item && <li key={id}><Link to={'/engineering/' + id}>{item.title}</Link><p>{item.summary}</p></li>;
  })}</ul>;
}

/** 엔지니어링 사례 목록을 제공한다. */
function Engineering() {
  return <Page title="엔지니어링 사례" lead="실무 개선과 팀 프로젝트에서 내린 기술적 판단, 그리고 검증 결과를 정리했습니다."><CaseList /></Page>;
}

/** 사례별 문제, 판단, 검증 근거를 하나의 흐름으로 제시한다. */
function CaseDetail() {
  const { caseId } = useParams();
  const item = cases.find((candidate) => candidate.id === caseId);
  if (!item) return <NotFound recovery="/engineering" label="사례 목록" />;
  return <Page title={item.title} lead={item.summary}>
    <dl className="case-detail">{[['문제', item.problem], ['판단', item.decision], ['검증', item.verification]].map(([label, text]) => <div key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>
    <EvidenceLinks items={item.evidence} /><Link to="/engineering">사례 목록</Link>
  </Page>;
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
    <section className="section"><h2>대표 사례</h2><DataTable headings={['사례', '요약']} rows={cases.map((item) => [item.title, item.summary])} /><p><a href={profile.github}>{profile.github}</a></p></section>
  </Page>;
}

/** 주소로 접근할 수 없는 페이지에서 관련 목록으로 돌아갈 경로를 제공한다. */
function NotFound({ recovery = '/', label = '홈으로' }: { recovery?: string; label?: string }) {
  return <Page title="페이지를 찾을 수 없습니다"><Link to={recovery}>{label}</Link></Page>;
}

createRoot(document.getElementById('root')!).render(<HashRouter><Layout /></HashRouter>);
