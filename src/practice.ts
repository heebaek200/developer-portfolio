import type { Capture, Diagram } from './casebook';
import type { Evidence } from './content';

const creature = 'https://github.com/heebaek200/shared-creature-game';
const study = 'https://github.com/heebaek200/study_room_reservation';
const boot = 'https://github.com/heebaek200/github-project-bootstrapper';
const bootImages = boot + '/blob/da748cf24a8363d89bd78d6cae20cbeb73e33cf3/docs/images/';

export const practicePrinciples = [
  { title: '반복은 공통 기반으로', description: '입력 검증과 화면 규칙을 공통화했던 실무 경험을 개발 환경 준비와 팀 온보딩의 표준화로 확장했습니다.' },
  { title: '판단은 명세로 공유', description: '업무 규칙의 원본과 이슈별 완료 조건을 공유해 팀원이 스스로 다음 작업을 시작할 수 있게 합니다.' },
  { title: '변경은 검증까지 연결', description: '구현과 자동 검사에는 AI를 활용하고, 중요한 결정과 리뷰, 인수 확인은 사람이 맡습니다.' },
];

export const practiceHistory = [
  { label: '일본 실무', heading: '업무 시스템의 공통화', detail: '화면을 추가할 때마다 같은 규칙을 다시 쓰던 비용을 줄이기 위해 입력 검증과 화면 구성을 하나의 메타데이터 정의로 묶었습니다.', path: '/experiences/metadata-core' },
  { label: '영상 제작·콘텐츠 운영', heading: '탐색과 자원 배분의 개선', detail: '공개 채팅과 시청자 반응으로 검토할 구간을 좁혀, 사람의 판단이 필요한 소재 선택과 편집에 시간을 썼습니다.', path: '/experiences?area=product-data' },
  { label: '개발 복귀와 팀 프로젝트', heading: '팀 단위 개발 절차의 표준화', detail: '반복해서 설정하는 환경은 자동화하고, 사람의 합의가 필요한 업무 규칙과 리뷰 기준은 문서와 이슈에 남겼습니다.', path: '/projects' },
];

export const productivityTopics = [
  { id: 'bootstrapper', title: '환경 초기화' },
  { id: 'workflow', title: '명세와 개발 절차' },
  { id: 'review-bottleneck', title: '리뷰 병목과 검증' },
];

export const setupCaptures: Capture[] = [
  { key: 'bootstrapper-project', extension: 'png', label: '저장소 준비 화면', caption: '사전 점검과 저장소 초기 설정을 한 화면에서 수행', source: bootImages + 'Screenshot_1.png' },
  { key: 'bootstrapper-stack', extension: 'png', label: 'Wiki·Projects 구성 화면', caption: '작업 보드와 문서 공간을 팀의 공통 시작점으로 준비', source: bootImages + 'Screenshot_2.png' },
];

export const workflowRows = [
  ['환경 준비', 'Bootstrapper', '저장소와 협업 환경을 표준화해 팀이 같은 출발점에서 작업', '공동 육성에 적용'],
  ['공동 설계', 'AMALITE', '팀이 업무 규칙과 완료 조건을 합의하고 담당 문서에 고정', '공동 육성에 적용'],
  ['공통 기반', 'SPEAR', '확정된 범위의 공통 코어와 샘플을 만들고 실행·검증 결과를 공유', '공동 육성에 적용'],
  ['이슈 단위 개발', 'STEYR', '최신 계약을 확인하고 구현·리뷰·재검증을 반복', '공동 육성 종료 후 정립'],
];

export const workflowDecisions = [
  {
    name: 'Bootstrapper', title: '팀원이 같은 환경에서 작업을 시작하도록',
    situation: '저장소, Wiki, 보드, 권한을 매번 따로 설정하면 첫날에 도구 사용법과 설정 차이부터 풀어야 했습니다.',
    input: '저장소·프로젝트 이름과 팀 설정', output: '기본 파일·보호 규칙·Wiki·Projects가 준비된 시작 환경',
    decision: 'PowerShell과 WPF GUI를 사용하고 GitHub CLI를 통해 REST·GraphQL로 설정을 처리했습니다. 저장소를 먼저 준비하고 문서·보드는 다음 단계로 나눠 단계별 결과를 확인할 수 있게 했습니다.',
    ownership: '저는 자동화할 순서와 예외 흐름을 정의하고 GitHub에서 생성 결과를 확인했습니다. 구현과 수정 코드 작성에는 Codex를 활용했습니다.',
  },
  {
    name: 'AMALITE', title: '합의할 내용과 구현할 내용을 나누다',
    situation: 'AI나 팀원마다 요구를 다르게 해석하면 빠르게 만든 코드가 서로 다른 업무 규칙을 따를 수 있습니다.',
    input: '프로젝트 목표·업무 규칙과 열린 결정', output: '책임이 구분된 설계 문서와 합의된 계약',
    decision: '기획·업무 규칙·API 등 문서의 역할을 분리하고, 기능의 입력과 결과, 완료 조건을 합의합니다. 다음 작업자가 결정을 찾아볼 수 있도록 관련 이슈와 계약 원본을 연결합니다.',
    ownership: 'AI는 질문과 초안을 정리하고, 팀은 사용자에게 영향을 주는 결정과 적용 범위를 확정합니다.',
  },
  {
    name: 'SPEAR', title: '같은 출발점과 검증 기준을 갖추다',
    situation: '팀원마다 공통 구조와 오류 처리 방식이 달라지면 기능 통합에서 다시 맞춰야 할 일이 늘어납니다.',
    input: '승인한 명세와 공통으로 구현할 범위', output: '공통 기반·참조할 샘플·검증 결과',
    decision: '인증이나 공통 응답처럼 여러 기능이 공유하는 구조를 먼저 마련합니다. 샘플 기능에서 화면부터 서버까지 한 흐름을 보여주면 새 이슈를 맡은 팀원이 그 패턴으로 작업할 수 있습니다.',
    ownership: 'AI가 합의된 범위 안에서 기반 작업과 자동 검사를 돕고, 사람은 샘플이 명세와 실제 흐름을 따르는지 확인합니다.',
  },
  {
    name: 'STEYR', title: '이슈가 구현·리뷰·재검증의 기준이 되도록',
    situation: '작업이 길어지거나 다른 사람이 이어받으면 이전 설명과 최신 명세가 어긋나고, 병렬 구현 뒤에 리뷰가 밀립니다.',
    input: '이슈·최신 설계·현재 Git/PR 상태', output: '구현 변경과 리뷰 근거, 재검증 결과',
    decision: '재개할 때 이슈·Git·명세를 대조해 이미 끝난 작업과 남은 범위를 확인합니다. 리뷰에서 계약의 변경이 필요하면 먼저 설계를 갱신하고 해당 조건으로 구현과 테스트를 다시 확인합니다.',
    ownership: 'AI가 구현 보조와 자동 확인을 맡고, 개발자는 계약 변경·수동 인수 확인·리뷰 결과를 판단합니다. 이 절차는 공동 육성 종료 후 정립했습니다.',
  },
];

export const practiceControls = [
  ['맥락 손실', '프로젝트별로 확정 사항과 진행 지점을 관리', '재개 전에 최신 이슈·명세·Git과 대조하고 이미 완료한 작업을 다시 시작하지 않음'],
  ['계약 중복', '업무 규칙과 API의 책임 문서를 구분', '변경한 계약, 영향받는 이슈와 검증 항목을 함께 연결'],
  ['구현 편차', '공통 기반과 작동하는 샘플을 공유', '개별 작업에 적용 범위와 종료 조건을 명시'],
  ['리뷰 집중', '구현과 리뷰에 필요한 조건을 작업 전에 정리', '중단점을 기록하고, 자동 검사와 팀원 교차 리뷰를 분리하는 방향으로 개선'],
  ['완료 판단', '테스트와 사람의 인수 확인을 분리', '자동 결과와 실제 업무 동작을 대조하고 필요한 수정은 확인을 반복한 뒤 통합'],
];

export const reviewDiagram: Diagram = {
  title: '병렬 구현 뒤에 남은 리뷰 병목',
  kind: 'comparison',
  columns: [
    { label: '공동 육성에서 겪은 흐름', steps: ['여러 작업과 팀 PR이 동시에 리뷰에 도착', '설계 판단·변경 전파·리뷰가 팀장에게 집중', '작업 중단점과 다음 확인 사항을 체크리스트에 기록'] },
    { label: '이후 정리한 개선 방향', steps: ['이슈에 계약 원본과 완료 조건을 연결', '자동 검사와 수동 확인을 구분', '팀원 교차 리뷰와 사람의 인수 검증으로 역할 분산'] },
  ],
};

export const practiceEvidence: Evidence[] = [
  { label: 'Bootstrapper 소스와 사용법', url: boot },
  { label: '설계 문서 개선 PR #46', url: creature + '/pull/46' },
  { label: 'API 계약 변경 이슈 #60', url: creature + '/issues/60' },
  { label: '스케줄러 리뷰·검증 PR #86', url: creature + '/pull/86' },
];

interface ProjectProcess {
  lead: string;
  steps: string[][];
  learning: string;
  evidence: Evidence[];
  implementation: Evidence[];
}

/** 두 프로젝트의 실제 작업 방식과 협업 자료를 연결한다. */
export const projectProcesses: Record<string, ProjectProcess> = {
  creature: {
    lead: '스터디룸에서 만들었던 이슈·PR 협업 방식을 반복 가능한 환경과 명세로 발전시켰습니다. 팀장으로 초기화와 공동 설계를 정리하고, 칸반·일일 리포트·QA가 이어지도록 운영했습니다.',
    steps: [
      ['초기화·온보딩', '스터디룸에서 반복한 저장소·문서·보드 준비를 Bootstrapper로 자동화했습니다. 처음에는 보드에서 작업을 고르고 이슈·PR로 이어지는 방식을 설명했습니다. 이후 팀원이 보드에서 전체 진행을 파악하고 다음 작업을 준비하는 흐름이 자리 잡았습니다.'],
      ['공동 설계·공통 기반', 'AMALITE로 업무 규칙, DB, API의 책임을 나누고 SPEAR로 기반을 마련했습니다. 명세가 커지며 규칙과 계약이 겹쳤을 때 #46에서 책임 문서를 다시 분리하고 기존 기능 ID를 유지했습니다.'],
      ['업무 분담·변경 전달', '기능과 검증을 별도 이슈로 나누고 칸반에서 담당과 상태를 공유했습니다. WebSocket 계약이 달라졌을 때는 프론트엔드 작업에 바뀐 계약과 관련 이슈를 연결했습니다(#60). 일일 리포트는 팀이 작업 맥락을 다시 읽는 데 사용했습니다.'],
      ['리뷰·검증·통합', '작업을 병렬로 진행하자 제 작업과 팀원 PR이 리뷰를 동시에 기다렸습니다. 팀원의 진행을 막지 않도록 팀 PR을 먼저 검토하고, 제가 멈춘 지점과 다음 확인 항목은 체크리스트에 적었습니다. 가입·보상·테스트 결제·실시간 동기화의 통합 QA도 분리해 기록했습니다.'],
    ],
    learning: '구현을 병렬화하자 병목이 리뷰와 명세 변경 전파로 옮겨갔습니다. 이 경험을 바탕으로 계약 원본 참조, 리뷰 역할 분담, 이슈별 재검증을 다음 작업에 적용할 원칙으로 정리했습니다.',
    implementation: [
      { label: '백엔드 · 그룹 가입과 제한 PR #45', url: creature + '/pull/45' },
      { label: '백엔드 · 결제 검증과 Webhook PR #71', url: creature + '/pull/71' },
      { label: '백엔드 · WebSocket PR #90', url: creature + '/pull/90' },
      { label: '화면 · 퀘스트 PR #102', url: creature + '/pull/102' },
      { label: '화면 · 실시간 동기화 PR #104', url: creature + '/pull/104' },
      { label: '화면 · 상점 PR #110', url: creature + '/pull/110' },
    ],
    evidence: [
      { label: '공동 육성 Projects 보드', url: 'https://github.com/users/heebaek200/projects/12' },
      { label: '일일 리포트 Discussions', url: creature + '/discussions' },
      { label: '설계 리팩터링 PR #46', url: creature + '/pull/46' },
      { label: 'API 계약 변경 이슈 #60', url: creature + '/issues/60' },
      { label: '통합 QA 기록', url: creature + '/tree/main/docs/test-results' },
      { label: '업무 규칙', url: creature + '/blob/main/docs/business-rules.md' },
      { label: 'DB 설계', url: creature + '/blob/main/docs/database-design.md' },
      { label: 'API 설계', url: creature + '/blob/main/docs/api-design.md' },
      { label: '화면 설계', url: creature + '/blob/main/docs/screen-design.md' },
    ],
  },
  'study-room': {
    lead: '세 사람이 기능을 나눠 작업하면서도 예약, 환불, 공통 화면이 한 서비스로 이어지도록 GitHub 중심 협업을 시작했습니다. 팀장으로 공동 설계와 이슈 분담, 코드 리뷰와 교차 테스트를 연결했습니다.',
    steps: [
      ['환경·작업 규칙 합의', '개인 프로젝트에서 작업 흐름을 먼저 연습한 뒤, 팀원에게 보드에서 이슈를 고르고 브랜치와 PR로 연결하는 순서를 시연했습니다. 작업 순서, 브랜치 규칙, 충돌 대응은 Wiki에 남겨 다시 찾아볼 수 있게 했습니다.'],
      ['공동 설계', '예약과 환불 업무 규칙, 화면 흐름, 데이터 설계를 먼저 합의했습니다. 사용해야 할 문서를 핵심 설계 중심으로 좁히고 각 이슈에 목적·주의할 조건·완료 기준을 적었습니다.'],
      ['업무 단위와 연결점 구분', '인증, 예약 생성, 관리자 환불과 화면 연결을 이슈로 나눴습니다. 로드맵에서 담당과 일정을 보고, 공통 라우팅이나 화면처럼 앞선 구현과 맞물리는 항목을 추적했습니다.'],
      ['구현·리뷰·교차 테스트', '팀원이 요구사항과 PR 변경을 비교해 리뷰한 뒤 라우팅과 화면을 통합했습니다. 교차 테스트 이슈에서 회원·관리자 흐름을 나눠 살폈고, 예약 동시성 검증은 수치와 조건이 적힌 Gradle 리포트로 게시했습니다.'],
    ],
    learning: '작은 이슈와 공통 완료 기준을 공유하면서 팀원이 후속 작업을 스스로 준비할 수 있었습니다. 이후 공동 육성에서는 이 경험을 바탕으로 초기 환경 구성과 설계 절차를 더 체계화했습니다.',
    implementation: [
      { label: '백엔드 · 예약 동시성 PR #33', url: study + '/pull/33' },
      { label: '화면 · 예약 신청 PR #34', url: study + '/pull/34' },
    ],
    evidence: [
      { label: '스터디룸 Projects 보드', url: 'https://github.com/users/heebaek200/projects/5' },
      { label: '예약 동시성 이슈 #8', url: study + '/issues/8' },
      { label: '교차 테스트 이슈 #12', url: study + '/issues/12' },
      { label: '테스트 결과 게시 PR #53', url: study + '/pull/53' },
      { label: '공동 설계와 작업 규칙 Wiki', url: study + '/wiki' },
    ],
  },
};
