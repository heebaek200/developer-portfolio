import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { career, credentials, profile, projects, skills, type Case, type Evidence, type Project } from './content';
import { dossiers, getProjectCases } from './casebook';
import { experienceDiagrams, experiences } from './experiences';
import { DecisionDiagram, Gallery, GrowthFilm, mediaPath } from './exhibits';
import { careerChapters, careerHighlights, careerStages, contentCareer } from './career-detail';
import { bootstrapper, bootstrapperArchitecture, bootstrapperDecisions, bootstrapperNotes, bootstrapperProof, bootstrapperSteps } from './bootstrapper';
import { contractCaptures, contractExample, projectDesigns, workflowProof } from './design-evidence';
import { practiceControls, practiceEvidence, practiceHistory, practicePrinciples, productivityTopics, projectProcesses, reviewDiagram, setupCaptures, workflowDecisions, workflowRows } from './practice';
import './styles.css';
import './practice.css';

interface OutlineItem { url: string; label: string; children?: OutlineItem[] }

const menus: OutlineItem[] = [
  { url: '/', label: 'Home' },
  { url: '/productivity', label: '개발 생산성', children: productivityTopics.map(({ id, title }) => ({ url: '/productivity/' + id, label: title })) },
  { url: '/projects', label: 'Projects', children: [
    ...projects.map(({ id, title }) => ({
      url: '/projects/' + id, label: title,
      children: getProjectCases(id).map((item) => ({ url: casePath(id, item.id), label: item.outlineTitle })),
    })),
    { url: '/projects/bootstrapper', label: 'GitHub Project Bootstrapper · 개인' },
  ] },
  { url: '/experiences', label: 'Experiences', children: experiences.map(({ id, title }) => ({ url: '/experiences?area=' + id, label: title })) },
  { url: '/career', label: 'Career' },
  { url: '/skills', label: 'Skills' },
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
            <Route path="/productivity" element={<Productivity />} />
            <Route path="/productivity/:topic" element={<Productivity />} />
            <Route path="/career" element={<Career />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/bootstrapper" element={<BootstrapperDetail />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/projects/:projectId/cases/:caseId" element={<ProjectCaseDetail />} />
            <Route path="/experiences" element={<ExperienceIndex />} />
            <Route path="/experiences/:caseId" element={<ExperienceDetail />} />
            <Route path="/engineering" element={<Navigate replace to="/experiences" />} />
            <Route path="/engineering/:caseId" element={<LegacyCase />} />
            <Route path="/about" element={<Navigate replace to="/" />} />
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

/** 홈에서 개발자의 관점과 그 관점이 발전한 과정부터 소개한다. */
function Home() {
  return <>
    <header className="hero identity-hero">
      <p className="eyebrow">{profile.name} · {profile.role}</p>
      <h1>{profile.headline.map((line, index) => <span key={line}>{index === 0 ? '' : ' '}{line}</span>)}</h1>
      <p className="lead">{profile.introduction}</p>
      <div className="identity-actions">
        <Link className="primary-link" to="/productivity">제가 설계한 개발 방식</Link>
        <Link to="/career">경력과 역할</Link>
      </div>
    </header>
    <section className="section identity-practice">
      <h2>팀이 같은 기준에서 시작하고, 함께 검증하도록</h2>
      <PracticePrinciples />
    </section>
    <section className="section">
      <h2>개발 방식이 발전해 온 과정</h2>
      <ol className="practice-history">{practiceHistory.map((item) => <li key={item.label}>
        <p className="eyebrow">{item.label}</p><h3><Link to={item.path}>{item.heading}</Link></h3><p>{item.detail}</p>
      </li>)}</ol>
    </section>
    <section className="section"><h2>팀 프로젝트에서 적용한 방식</h2>
      <p>팀장을 맡은 프로젝트에서 설계 문서가 잘 정리돼 있다는 피드백을 여러 차례 받았습니다. 권한, 화면, API의 기준을 어떻게 합의하고 개발과 리뷰에 적용했는지 각 프로젝트에 담았습니다.</p>
      <div className="project-exhibits">{projects.map((project) => <ProjectTeaser key={project.id} project={project} />)}</div>
    </section>
  </>;
}

/** 개발 방식에서 줄이고자 한 비용을 공통 원칙으로 정리한다. */
function PracticePrinciples() {
  return <dl className="practice-principles">{practicePrinciples.map((item) => <div key={item.title}>
    <dt>{item.title}</dt><dd>{item.description}</dd>
  </div>)}</dl>;
}

/** 프로젝트의 실제 설계 목록과 개발 과정의 요약을 연결한다. */
function ProjectTeaser({ project }: { project: Project }) {
  const cover = projectDesigns[project.id].index;
  return <article className={'project-teaser project-' + project.id}>
    <div className="teaser-copy">
      <p className="eyebrow">{project.team}</p>
      <h2><Link to={'/projects/' + project.id}>{project.title}</Link></h2>
      <p>{project.id === 'creature' ? '초기화부터 명세 변경과 리뷰까지 이어진 팀 개발' : '공동 설계, 이슈 분담, 교차 테스트로 연결한 팀 개발'}</p>
      <p className="teaser-stack">{dossiers[project.id].strap}</p>
    </div>
    <img loading="lazy" src={mediaPath(cover.key, cover.extension)} alt={cover.label + ' 실제 화면'} />
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
    <section className="section">
      <h2>일본 IT 기업 · 시스템 엔지니어</h2>
      <p>PHP, JavaScript, PostgreSQL을 기반으로 제조업 사내 시스템과 운송·창고 SaaS의 개발과 유지보수를 담당했습니다.</p>
      <DataTable headings={['경력 단계', '업무와 역할']} rows={careerStages} />
      {careerChapters.map(({ title, rows }) => <div className="career-chapter" key={title}>
        <h3>{title}</h3><DataTable headings={['업무', '수행 내용']} rows={rows} />
      </div>)}
      <p><Link to="/experiences?area=professional">현업 문제 해결 사례</Link></p>
    </section>
    <section className="section">
      <h2>프리랜서 영상 편집·채널 운영</h2>
      <p>콘텐츠 기획, 편집, 데이터 분석, 제작 일정 관리를 하나의 작업으로 운영했습니다.</p>
      <DataTable headings={['업무', '수행 내용']} rows={contentCareer} />
      <p><Link to="/experiences?area=product-data">제품·데이터 경험 사례</Link></p>
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

/** 작업의 시작, 명세, 리뷰를 연결해 생산성을 높인 실제 과정과 다음 개선 방향을 보여준다. */
function Productivity() {
  const { topic } = useParams();
  const selected = productivityTopics.find((item) => item.id === topic);
  useEffect(() => {
    if (!selected) return;
    const frame = requestAnimationFrame(() => {
      const heading = document.getElementById(selected.id);
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [selected]);
  if (topic && !selected) return <NotFound recovery="/productivity" label="개발 생산성으로" />;

  return <Page title="개발 생산성" lead="팀이 무엇을 만들어야 하는지 빨리 이해하고, 같은 기준에서 구현하고, 결과를 믿고 통합할 수 있도록 개발 과정을 설계합니다.">
    <PracticePrinciples />
    <nav className="section-jump" aria-label="개발 생산성 목차">
      {productivityTopics.map((item) => <Link key={item.id} to={'/productivity/' + item.id} aria-current={topic === item.id ? 'location' : undefined}>{item.title}</Link>)}
    </nav>
    <section className="section">
      <h2>공통화를 코드에서 팀 작업으로</h2>
      <p>일본 실무에서 화면과 입력 검증에 중복되던 규칙을 메타데이터로 모았습니다. 다음 팀 프로젝트에서는 같은 문제를 작업 환경과 명세에서도 마주했습니다. 사람이 바뀌어도 규칙을 찾아 적용하고, 변경할 때 영향받는 작업을 확인할 수 있는 흐름을 만들기 시작했습니다.</p>
      <p><Link to="/experiences/metadata-core">업무 화면 공통화 사례</Link></p>
    </section>
    <section className="section">
      <h2 id="bootstrapper" tabIndex={-1}>환경 초기화와 온보딩</h2>
      <p>팀원이 설계와 이슈 작업을 바로 시작할 수 있도록 저장소, Wiki, Projects 준비를 Bootstrapper에 모았습니다. 저장소를 만드는 단계와 팀 작업 환경을 구성하는 단계로 나눠, 각 단계의 결과를 확인하고 이어서 진행할 수 있게 했습니다.</p>
      <p><Link to="/projects/bootstrapper">GitHub Project Bootstrapper 개인 프로젝트 보기</Link></p>
    </section>
    <section className="section">
      <h2 id="workflow" tabIndex={-1}>명세를 팀의 작업 기준으로</h2>
      <p>업무 규칙이 여러 문서와 이슈에 반복되면 수정 사항을 팀 전체에 전달하기 어려웠습니다. 공동 육성에서는 문서별 책임을 나누고, 공통 기반을 합의한 뒤 각 기능을 이슈 단위로 나눴습니다. 이후 이슈별 최신 명세와 리뷰 결과를 대조하는 STEYR를 정립했습니다.</p>
      <WorkflowMap />
      <DataTable headings={['단계', '도구·절차', '팀의 작업 기준', '적용 시점']} rows={workflowRows} />
      <ol className="workflow-decisions">
        {workflowDecisions.map(({ name, title, situation, input, output, decision, ownership }) => <li key={name}>
          <h3>{name} · {title}</h3>
          <p>{situation}</p>
          <dl><div><dt>입력</dt><dd>{input}</dd></div><div><dt>산출물</dt><dd>{output}</dd></div></dl>
          <p>{decision}</p><p>{ownership}</p>
        </li>)}
      </ol>
      <EvidenceLinks items={practiceEvidence.slice(1, 3)} />
    </section>
    <section className="section">
      <h2 id="execution-contract" tabIndex={-1}>팀 설계와 AI 실행 계약</h2>
      <p>팀과 AI는 같은 업무 규칙과 설계 문서를 참조합니다. AI가 맡을 공통 기반 작업은 별도 YAML에 근거 결정 ID, 수용 기준, 의존 관계를 연결해 실행 범위를 정했습니다. 참조 코드 분석은 팀이 함께 쓸 구조와 필요한 기반을 결정하는 데 활용했습니다.</p>
      <DataTable headings={['기록', '무엇을 정하는가', '언제 갱신하는가']} rows={[
        ['팀 설계 Markdown', '기능, 권한, 데이터, 화면, API, 코드 규칙의 기준', '팀이 요구사항이나 계약 변경을 합의할 때'],
        ['결정 기록', '합의한 선택과 그 근거', '선택을 확정하거나 바꿀 때'],
        ['실행 계약 · common-foundation.yaml', '이번에 구현할 범위와 수용 기준', '합의한 결정이 구현 범위나 검증에 영향을 줄 때'],
        ['진행 상태 · protocol-state.yaml', '작업을 이어갈 지점과 실제 진행 내역', '이슈·PR·Git 이력과 대조해 진행을 확인할 때'],
      ]} />
      <p>결정을 승인해도 해당 구현은 나중으로 미룰 수 있습니다. 그래서 결정의 상태와 구현 포함 여부를 따로 관리했습니다. 합의가 바뀌면 결정이 속한 설계 문서를 갱신하고, 영향받는 실행 계약과 확인 조건을 맞췄습니다.</p>
      <figure className="contract-example">
        <figcaption>공동 육성 실행 계약 발췌 · MySQL 환경의 구현 범위와 수용 기준</figcaption>
        <pre><code>{contractExample}</code></pre>
      </figure>
      <p>위 수용 기준은 공통 기반 작업을 인계할 때 확인하도록 정한 조건입니다. 당시 설계와 공통 기반을 적용한 기록은 PR #7과 #10에서 이어서 볼 수 있습니다. 최근 절차는 Markdown으로 정리해 새 작업에 적용합니다.</p>
      <Gallery items={contractCaptures} kind="design" />
      <EvidenceLinks items={workflowProof} />
    </section>
    <section className="section">
      <h2 id="review-bottleneck" tabIndex={-1}>구현이 빨라진 뒤, 리뷰가 병목이 되다</h2>
      <p>여러 구현이 동시에 끝날 때는 설계 변경의 영향과 각 PR의 맥락을 먼저 파악해야 했습니다. 팀 PR을 우선 검토하고 중단점과 다음 확인 항목을 남겼습니다. 다음 작업을 위한 개선 방향은 규칙의 원본을 참조하고, 리뷰를 나누고, 사람의 확인이 필요한 조건을 이슈에 적는 것입니다.</p>
      <DecisionDiagram diagram={reviewDiagram} />
      <DataTable headings={['반복되는 문제', '작업 기준', '재개·검토 때 확인할 항목']} rows={practiceControls} />
      <Gallery items={[dossiers.creature.records[0]]} kind="records" />
      <EvidenceLinks items={practiceEvidence.slice(3)} />
    </section>
    <section className="section"><h2>두 팀 프로젝트에서의 적용</h2>
      <ul className="case-list">
        <li><Link to="/projects/study-room">스터디룸 예약 관리 시스템</Link><p>공동 설계, 이슈 단위 분담, PR 리뷰와 교차 테스트를 팀의 작업 흐름으로 연결했습니다.</p></li>
        <li><Link to="/projects/creature">다 같이 키우는 생명체</Link><p>초기 환경을 자동화하고, 명세·보드·일일 리포트·통합 QA를 같은 개발 과정에서 운영했습니다.</p></li>
      </ul>
    </section>
  </Page>;
}

/** 사람이 합의한 결정이 팀의 설계와 AI의 작업 범위에 함께 반영되는 흐름. */
function WorkflowMap() {
  return <figure className="workflow-map">
    <figcaption>공동 설계에서 구현·검증까지 이어지는 개발 체계</figcaption>
    <ol>
      <li><strong>협업 환경 준비</strong><p>Bootstrapper로 저장소·Wiki·Projects의 출발점을 마련합니다.</p></li>
      <li><strong>공동 설계 · 사람이 결정</strong><p>팀이 업무 규칙과 완료 조건을 합의합니다. 참조할 결정과 설계 문서를 연결합니다.</p>
        <dl className="workflow-branches">
          <div><dt>팀 설계</dt><dd>요구사항·업무 규칙·API를 팀과 AI가 참조</dd></div>
          <div><dt>AI 실행 계약</dt><dd>같은 결정을 근거로 구현 대상·의존 관계·수용 기준 정의</dd></div>
        </dl>
      </li>
      <li><strong>공통 기반 · 범위 안에서 실행</strong><p>AI는 확정된 계약에 따라 기반과 샘플 구현을 돕고, 사람은 실제 흐름과 완료 조건을 확인합니다.</p></li>
      <li><strong>이슈 단위 구현·리뷰·검증</strong><p>최신 이슈·PR·Git으로 진행을 확인하고, 리뷰에서 실제 구현을 설계와 대조합니다.</p></li>
    </ol>
    <p className="workflow-return"><strong>계약 변경이 필요할 때</strong> 합의할 지점으로 돌아가 설계와 실행 계약을 맞춘 뒤 영향받는 동작을 다시 검증합니다.</p>
  </figure>;
}

/** 완료 프로젝트 목록을 상세 경로와 연결한다. */
function Projects() {
  return <Page title="완료 프로젝트" lead="팀의 구현 기준을 세운 프로젝트와 반복되는 협업 준비를 자동화한 개인 도구를 소개합니다.">
    <section className="section">
      <h2>팀 프로젝트</h2>
      <div className="project-exhibits">{projects.map((project) => <ProjectTeaser key={project.id} project={project} />)}</div>
    </section>
    <section className="section">
      <h2>개인 프로젝트</h2>
      <div className="project-exhibits"><article className="project-teaser project-bootstrapper">
        <div className="teaser-copy">
          <h3><Link to="/projects/bootstrapper">{bootstrapper.title}</Link></h3>
          <p>{bootstrapper.summary}</p><p className="teaser-stack">{bootstrapper.stack}</p>
        </div>
        <img loading="lazy" src={mediaPath(setupCaptures[0].key, setupCaptures[0].extension)} alt={setupCaptures[0].label} />
      </article></div>
    </section>
  </Page>;
}

/** Bootstrapper의 자동화 범위와 제품 설계·검증의 실제 근거를 소개한다. */
function BootstrapperDetail() {
  return <Page title={bootstrapper.title} lead={bootstrapper.summary}>
    <ul className="project-facts"><li>{bootstrapper.team}</li><li>{bootstrapper.period}</li><li>{bootstrapper.stack}</li></ul>
    <section className="section">
      <h2>협업의 출발점을 도구로 만들다</h2>
      <p>팀 프로젝트를 시작할 때마다 저장소, 보호 규칙, Wiki, Projects와 팀원 권한을 따로 설정했습니다. 터미널에 익숙하지 않은 팀원도 같은 환경에서 출발할 수 있도록 반복 설정을 두 단계의 Windows GUI에 담았습니다.</p>
      <p>자동화할 범위와 실행 순서를 정하고, Codex에 코드 작성을 위임했습니다. 실제 GitHub 환경에서 결과를 확인하며 오류 원인과 수정 방향을 검토했습니다. 이후 Spring Boot 초기화와 협업 템플릿을 확장해 공동 육성 프로젝트의 환경 준비에 사용했습니다.</p>
      <Gallery items={setupCaptures} kind="setup" />
    </section>
    <section className="section">
      <h2>두 번의 실행과 사람이 맡는 설정</h2>
      <DataTable headings={['순서', '자동화 범위와 사용자 작업']} rows={bootstrapperSteps} />
      <DecisionDiagram diagram={bootstrapperArchitecture} />
      <p className="process-lesson">개인 계정의 새 프로젝트를 준비하는 도구입니다. 같은 대상을 다시 구성하면 Wiki 문서, 라벨, Project 보기·상태·연결 저장소가 교체될 수 있고 대상 저장소의 공개 여부가 Public으로 바뀔 수 있습니다.</p>
    </section>
    <section className="section">
      <h2>실행 결과를 확인하며 바꾼 설계</h2>
      <DataTable headings={['기술 판단', '확인한 문제와 대응']} rows={bootstrapperDecisions} />
      <EvidenceLinks items={bootstrapperProof} />
    </section>
    <section className="section">
      <h2>도구에서 팀 개발 절차로</h2>
      <p>환경을 준비하는 도구를 만든 뒤, 팀이 함께 설계하고 공통 기반을 마련해 일을 나누는 방식도 문서로 정리했습니다. 아래는 그 팀 개발 절차를 구상할 때 남긴 자료입니다.</p>
      <Gallery items={bootstrapperNotes} kind="design" />
      <p><Link to="/productivity/execution-contract">개발 생산성 · 팀 설계와 AI 실행 계약</Link></p>
    </section>
    <Link to="/projects">프로젝트 목록</Link>
  </Page>;
}

const projectSections = [
  ['design', '설계 문서'],
  ['process', '추진 절차'],
  ['team', '역할과 팀 성과'],
  ['purpose', '기획과 서비스'],
  ['screens', '실제 기능 화면'],
  ['decisions', '기술적 판단'],
  ['verification', '검증과 다음 개선'],
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
  const design = projectDesigns[project.id];
  const process = projectProcesses[project.id];
  const projectCases = getProjectCases(project.id);
  const featured = projectCases.find((item) => item.id === dossier.featuredCase);
  return <Page title={project.title} lead={project.summary}>
    <ul className="project-facts"><li>{project.period}</li><li>{project.team}</li><li>{project.stack}</li></ul>
    <ProjectSections />
    <section className="section">
      <h2 id="design" tabIndex={-1}>설계 문서에서 시작한 개발</h2>
      <p>{design.intro}</p>
      <Gallery items={[design.index]} kind="design-index" />
      <h3>대표 문서와 구현 기준</h3>
      <Gallery items={design.documents} kind="design" />
      <DecisionDiagram diagram={design.trace} />
      <EvidenceLinks items={design.links} />
    </section>
    <section className="section project-process">
      <h2 id="process" tabIndex={-1}>프로젝트 추진 절차</h2>
      <p>{process.lead}</p>
      <Gallery items={dossier.records} kind="records" />
      <ol className="process-steps">{process.steps.map(([phase, description]) => <li key={phase}>
        <h3>{phase}</h3><p>{description}</p>
      </li>)}</ol>
      <p className="process-lesson">{process.learning}</p>
      {project.id === 'creature' && <p>종료 후 팀 워크숍에서 설계 문서가 처음 맡는 프론트엔드 업무의 기준을 파악하는 데 도움이 됐다는 의견이 나왔습니다. 이슈와 PR로 진행을 확인하고, 일일 리포트로 다음 작업을 정리했으며, 코드 리뷰에서 작성자가 놓친 문제를 발견한 경험도 공유했습니다.</p>}
      <EvidenceLinks items={process.evidence} />
      <p><Link to="/productivity">개발 생산성 페이지</Link></p>
    </section>
    <section className="section">
      <h2 id="team" tabIndex={-1}>역할과 팀 성과</h2>
      <DataTable headings={['구분', '기여와 결과']} rows={dossier.roles} />
      <h3>직접 구현한 백엔드·화면 변경</h3>
      <EvidenceLinks items={process.implementation} />
      <EvidenceLinks items={project.evidence} />
    </section>
    <section className="section">
      <h2 id="purpose" tabIndex={-1}>기획과 서비스</h2>
      {dossier.background.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <DecisionDiagram diagram={{ title: '사용자가 기능을 이용하는 흐름', kind: 'timeline', columns: dossier.flow.map((label, index) => ({ label: String(index + 1), steps: [label] })) }} />
      <DataTable headings={['기능', '서비스에서의 역할']} rows={dossier.features} />
      <DecisionDiagram diagram={dossier.architecture} />
      {project.id === 'creature' && <section className="case-expansion">
        <h3>프로젝트 종료 후 팀 워크숍</h3>
        <p>종료 후 워크숍에서 서비스를 다시 설명하며, 함께 키우는 재미와 개인 성장을 어떻게 연결했는지 돌아봤습니다.</p>
        <DataTable headings={['살펴본 서비스', '팀이 논의한 관점']} rows={[
          ['산사', '같은 공간을 쓰는 사람들과의 느슨한 관계'],
          ['투두메이트', '작은 행동을 반복하며 실천하는 흐름'],
          ['Pikmin Bloom', '일상 행동과 공동 활동을 보상으로 연결하는 방식'],
        ]} />
        <p>공동 육성은 무료로 참여하고, 테스트 결제는 개인 아바타 아이템에 적용했습니다. 개인 랭킹은 각자의 활동을 돌아보는 기준이고, 그룹 랭킹은 같은 시즌을 보낸 팀이 함께 쌓은 결과를 보여줍니다.</p>
        <p>활성 그룹은 한 번에 하나입니다. 탈퇴하거나 추방되면 24시간 뒤 다시 가입할 수 있습니다.</p>
        <DataTable headings={['운영 역할', '권한 범위']} rows={[
          ['주 관리자', '자기 그룹을 관리하며 부 관리자를 지정하거나 주 관리자 역할을 넘길 수 있습니다.'],
          ['부 관리자', '자기 그룹의 운영을 보조합니다.'],
          ['서비스 전체 관리자', '서비스 차원의 회원과 운영 업무를 관리합니다.'],
        ]} />
        <p>완전체 이후에도 돌아올 이유를 만들 수 있는지, 참여가 일부 인원에게 집중될 때 부담을 어떻게 줄일지, 순위 경쟁과 느슨한 유대가 함께 갈 수 있는지는 워크숍의 후속 논의로 남겼습니다.</p>
        <EvidenceLinks items={[{ label: '프로젝트 포트폴리오 워크숍 회의록', url: 'https://github.com/heebaek200/shared-creature-game/wiki/프로젝트-포트폴리오-워크숍-회의록' }]} />
      </section>}
    </section>
    <section className="section">
      <h2 id="screens" tabIndex={-1}>실제 기능 화면</h2>
      <p className="meta">테스트 환경의 실제 UI입니다. 시연에는 테스트 계정과 예시 데이터가 사용됐습니다.</p>
      <Gallery items={dossier.captures} />
      {project.id === 'creature' && <GrowthFilm />}
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
      <h2 id="verification" tabIndex={-1}>검증과 다음 개선</h2>
      <DataTable headings={['테스트 영역', '확인한 동작', '원본']} rows={dossier.qa} />
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

/** 현업 개발과 제품·데이터 경험을 프로젝트와 별도로 탐색한다. */
function ExperienceIndex() {
  const { search } = useLocation();
  const activeArea = new URLSearchParams(search).get('area');
  if (activeArea === 'productivity') return <Navigate replace to="/productivity" />;
  const selected = experiences.find((area) => area.id === activeArea);
  return <Page title="경험 사례집" lead="업무 시스템 개발과 콘텐츠 운영에서 마주친 문제, 기술 선택과 실제 적용을 정리했습니다.">
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
  return <dl className="case-detail">{[['문제', item.problem], ['판단', item.decision], ['적용과 결과', item.verification]].map(([label, value]) => <div key={label}>
    <dt>{label}</dt><dd>{value}</dd>
  </div>)}</dl>;
}

/** 사례 상세에 각 판단의 근거와 검증 조건을 덧붙인다. */
function CaseDepth({ item }: { item: Case }) {
  return item.details?.map(({ heading, paragraphs }) => <section className="case-expansion" key={heading}>
    <h2>{heading}</h2>
    {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
  </section>);
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
      <CaseDepth item={item} />
      <EvidenceLinks items={item.evidence} />
      <Link to={'/projects/' + project.id}>프로젝트의 기술 사례 목록</Link>
    </Page>
  </>;
}

/** 프로젝트와 별개로 쌓은 작업 경험의 상세. */
function ExperienceDetail() {
  const { caseId } = useParams();
  if (productivityTopics.some(({ id }) => id === caseId)) return <Navigate replace to={'/productivity/' + caseId} />;
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
    <DecisionDiagram diagram={experienceDiagrams[item.id]} />
    <CaseNarrative item={item} /><CaseDepth item={item} /><EvidenceLinks items={item.evidence} />
  </Page>;
}

/** 이전 Engineering 주소를 사례의 현재 소속으로 연결한다. */
function LegacyCase() {
  const { caseId } = useParams();
  if (productivityTopics.some(({ id }) => id === caseId)) return <Navigate replace to={'/productivity/' + caseId} />;
  const project = projects.find(({ id }) => getProjectCases(id).some((item) => item.id === caseId));
  if (project && caseId) return <Navigate replace to={casePath(project.id, caseId)} />;
  if (experiences.some((area) => area.items.some((item) => item.id === caseId))) return <Navigate replace to={'/experiences/' + caseId} />;
  return <NotFound recovery="/experiences" label="경험 목록" />;
}

/** 화면과 같은 콘텐츠 데이터로 인쇄 가능한 요약을 제공한다. */
function Print() {
  return <Page title={profile.name + ' · ' + profile.role} lead={profile.introduction}>
    <button className="quiet-button print-action" onClick={() => window.print()}>인쇄 또는 PDF 저장</button>
    <section className="section"><h2>개발 방식</h2><PracticePrinciples /></section>
    <section className="section"><h2>경력·자격</h2><DataTable headings={['기간', '역할', '업무']} rows={career} /><DataTable headings={['경험', '주요 업무']} rows={careerHighlights} /><p>{credentials.join(' / ')}</p></section>
    <section className="section"><h2>주요 역량</h2><DataTable headings={['활용 맥락', '기술']} rows={skills} /></section>
    <section className="section"><h2>완료 프로젝트</h2><DataTable headings={['프로젝트', '역할', '내용']} rows={[...projects, bootstrapper].map((project) => [project.title, project.team, project.summary])} /></section>
    <section className="section"><h2>대표 사례</h2><DataTable headings={['사례', '요약']} rows={[
      ...projects.flatMap((project) => getProjectCases(project.id).slice(0, 1)),
      ...experiences.flatMap((group) => group.items.filter(({ id }) => id !== 'legacy').slice(0, 1)),
    ].map((item) => [item.title, item.summary])} /><p><a href={profile.github}>{profile.github}</a></p></section>
  </Page>;
}

/** 주소로 접근할 수 없는 페이지에서 관련 목록으로 돌아갈 경로를 제공한다. */
function NotFound({ recovery = '/', label = '홈으로' }: { recovery?: string; label?: string }) {
  return <Page title="페이지를 찾을 수 없습니다"><Link to={recovery}>{label}</Link></Page>;
}

createRoot(document.getElementById('root')!).render(<HashRouter><Layout /></HashRouter>);
