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
  { label: '일본 실무', heading: '업무 시스템의 공통화', detail: '제조업 시스템과 물류 SaaS를 유지보수하며 메타데이터로 화면과 입력 검증의 반복을 줄였습니다.', path: '/experiences/metadata-core' },
  { label: '영상 제작·콘텐츠 운영', heading: '탐색과 자원 배분의 개선', detail: '사용자 반응 데이터를 이용해 검토할 구간을 좁히고 제작 작업의 우선순위를 조정했습니다.', path: '/experiences?area=product-data' },
  { label: '개발 복귀와 팀 프로젝트', heading: '팀 단위 개발 절차의 표준화', detail: '공동 설계와 이슈·PR 협업을 팀에 도입하고, 초기화 자동화와 명세 기반 작업으로 발전시켰습니다.', path: '/projects' },
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
}

/** 두 프로젝트의 실제 작업 방식과 협업 자료를 연결한다. */
export const projectProcesses: Record<string, ProjectProcess> = {
  creature: {
    lead: '스터디룸에서 만들었던 이슈·PR 협업 방식을 반복 가능한 환경과 명세로 발전시켰습니다. 팀장으로 초기화와 공동 설계를 정리하고, 칸반·일일 리포트·QA가 이어지도록 운영했습니다.',
    steps: [
      ['초기화·온보딩', 'Bootstrapper로 저장소·Wiki·Projects를 준비하고, 팀이 설계와 이슈 작업 흐름을 시작할 수 있게 했습니다.'],
      ['공동 설계·공통 기반', 'AMALITE로 업무 규칙과 데이터·API 책임을 나눠 설계하고 SPEAR로 공통 기반을 마련했습니다. 설계가 길어졌을 때 PR #46에서 문서의 책임을 다시 정리했습니다.'],
      ['업무 분담·병렬 구현', '기능을 이슈 단위로 분리하고 담당자와 상태를 칸반에서 확인했습니다. 공통 계약 변경은 영향받는 이슈에 전달했고, 일일 리포트에서 진행과 중단 지점을 공유했습니다.'],
      ['리뷰·검증·통합', 'PR에서 구현과 계약을 대조하고 가입·보상·테스트 결제·실시간 동기화의 통합 QA를 연결했습니다. 작업이 동시 완료됐을 때는 팀 PR을 우선 검토하고 보류 지점을 체크리스트로 관리했습니다.'],
    ],
    learning: '구현을 병렬화하자 병목이 리뷰와 명세 변경 전파로 옮겨갔습니다. 이 경험을 바탕으로 계약 원본 참조, 리뷰 역할 분담, 이슈별 재검증을 다음 작업에 적용할 원칙으로 정리했습니다.',
    evidence: [
      { label: '공동 육성 Projects 보드', url: 'https://github.com/users/heebaek200/projects/12' },
      { label: '일일 리포트 Discussions', url: creature + '/discussions' },
      { label: '설계 리팩터링 PR #46', url: creature + '/pull/46' },
      { label: 'API 계약 변경 이슈 #60', url: creature + '/issues/60' },
      { label: '통합 QA 기록', url: creature + '/tree/main/docs/test-results' },
    ],
  },
  'study-room': {
    lead: '세 사람이 기능을 나눠 작업하면서도 예약, 환불, 공통 화면이 한 서비스로 이어지도록 GitHub 중심 협업을 시작했습니다. 팀장으로 공동 설계와 이슈 분담, 코드 리뷰와 교차 테스트를 연결했습니다.',
    steps: [
      ['환경·작업 규칙 합의', '저장소, Wiki, Issue와 Projects를 작업 기준으로 삼고 팀원에게 브랜치·PR 흐름을 공유했습니다.'],
      ['공동 설계', '예약과 환불 업무 규칙, 화면 흐름, 데이터 설계를 먼저 정리했습니다. 문서 구성을 핵심 설계로 좁혀 팀이 참조할 기준을 맞췄습니다.'],
      ['업무 단위와 연결점 구분', '회원 인증, 예약 동시성, 관리자 처리, 화면과 공통 라우팅을 이슈로 나눴습니다. 로드맵에서 작업 기간과 담당을 함께 확인했습니다.'],
      ['구현·리뷰·교차 테스트', '기능별 PR을 리뷰한 뒤 공통 라우팅과 화면을 통합했습니다. 교차 테스트를 이슈에 기록하고 예약 동시성 결과를 Gradle 리포트로 남겼습니다.'],
    ],
    learning: '작은 이슈와 공통 완료 기준을 공유하면서 팀원이 후속 작업을 스스로 준비할 수 있었습니다. 이후 공동 육성에서는 이 경험을 바탕으로 초기 환경 구성과 설계 절차를 더 체계화했습니다.',
    evidence: [
      { label: '스터디룸 Projects 보드', url: 'https://github.com/users/heebaek200/projects/5' },
      { label: '예약 동시성 이슈 #8', url: study + '/issues/8' },
      { label: '동시성 구현 PR #33', url: study + '/pull/33' },
      { label: '교차 테스트 이슈 #12', url: study + '/issues/12' },
      { label: '테스트 결과 게시 PR #53', url: study + '/pull/53' },
    ],
  },
};
