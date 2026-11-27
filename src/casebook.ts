import { cases as originalCases, type Case, type Evidence } from './content';

export interface Capture {
  key: string;
  label: string;
  caption: string;
  source: string;
  motion?: boolean;
}

export interface Diagram {
  title: string;
  kind: 'lanes' | 'timeline' | 'comparison';
  columns: { label: string; steps: string[] }[];
}

interface Dossier {
  strap: string;
  background: string[];
  flow: string[];
  architecture: Diagram;
  features: string[][];
  roles: string[][];
  management: string;
  captures: Capture[];
  records: Capture[];
  qa: string[][];
  qaLinks: Evidence[];
  reflection: string;
  featuredCase: string;
}

const creature = 'https://github.com/heebaek200/shared-creature-game';
const study = 'https://github.com/heebaek200/study_room_reservation';
const creatureRef = creature + '/blob/871c5bea7ae36dac5b4626ec5247a7d0bb880b9a/docs/';
const studyRef = study + '/blob/42b3d827d467a3c968c21945e8baf4eaa333a289/docs/images/';
const report = 'https://heebaek200.github.io/study_room_reservation/com.studyroom.reservation.service.ReservationCreateServiceTest/index.html';

/** 실제 실행 기록에서 화면과 연결되는 설명 및 원본을 정의한다. */
export const dossiers: Record<string, Dossier> = {
  creature: {
    strap: '각자의 작은 실천으로 하나의 생명체를 키우다',
    background: [
      '꾸준히 실천하기 어려운 일상 과제에 공동 목표를 더했습니다. 실명을 드러내지 않아도 일일·주간 퀘스트의 기여가 하나의 크리처 성장으로 쌓입니다.',
      '공동 성장과 순위 경쟁은 무료 참여 영역으로 설계했고, 상점은 개인 아바타 꾸미기에 연결했습니다. 프로젝트 종료 후 워크숍에서는 성장 과정과 권한 차이를 발표에서 더 명확히 보여주자는 의견이 나왔습니다.',
    ],
    flow: ['공개 그룹 가입 또는 생성', '일일·주간 퀘스트 참여', '기여도와 크리처 경험치 반영', '성장과 개인·그룹 순위 확인'],
    architecture: { title: '브라우저가 상태를 받는 경로와 서버가 상태를 바꾸는 경로', kind: 'comparison', columns: [
      { label: '현재 상태와 명령', steps: ['브라우저 → REST → Spring Boot', 'MySQL에서 상태 조회 및 트랜잭션 처리'] },
      { label: '실시간 변경', steps: ['저장 이후 WebSocket으로 변경 전달', '필요할 때 REST 스냅샷으로 정합성 복구'] },
      { label: '시간에 따른 변경', steps: ['서버 Scheduler가 작업 시점 및 상태 검사', '처리 결과를 MySQL에 반영'] },
    ] },
    features: [
      ['그룹', '최대 20명, 활성 소속은 사용자당 1개. 탈퇴·강퇴 후 24시간 동안 재가입이 제한됩니다.'],
      ['퀘스트와 성장', '체크인과 사진 인증 결과를 보상 및 성장 상태에 반영합니다.'],
      ['상점', '개인 아바타 꾸미기 구매·환불 흐름을 테스트 PG에서 구현했습니다.'],
      ['권한', '그룹 주 관리자와 부 관리자의 운영 범위를 서비스 전체 관리자 권한과 분리했습니다.'],
    ],
    roles: [
      ['개인 · 팀 운영', '공동 설계, 설계 문서 보완, 이슈 분담, PR 리뷰와 일일 리포트 운영'],
      ['개인 · 개발', '백엔드 기반, 스케줄러와 WebSocket, 그룹·관리자 업무, 퀘스트·상점 화면 연동'],
      ['팀 · 구현 성과', '그룹·퀘스트·성장, 사진 인증, 아바타, 테스트 결제·환불과 QA. 환불 구현과 공통 헤더 시즌 타이머 수정은 팀원이 담당했습니다.'],
    ],
    management: '업무 규칙을 설계 문서에서 확인하고 이슈의 완료 조건을 PR 리뷰와 QA로 연결했습니다. 작업 보드는 업무 상태를, 일일 리포트는 진행과 중단 지점을 공유하는 데 썼습니다.',
    captures: [
      { key: 'creature-join', label: '공개 그룹 가입', caption: '참여할 그룹을 선택하고 가입하는 흐름', source: creatureRef + 'images/demos/02-group-join.gif', motion: true },
      { key: 'creature-checkin', label: '퀘스트 체크인', caption: '일상 실천을 퀘스트 완료로 기록', source: creatureRef + 'images/demos/05-quest-checkin.gif', motion: true },
      { key: 'creature-growth', label: '공동 크리처 성장', caption: '퀘스트 보상이 경험치와 성장에 반영되는 모습', source: creatureRef + 'images/demos/07-creature-growth.gif', motion: true },
      { key: 'creature-ranks', label: '개인·그룹 랭킹', caption: '시즌별 개인 순위와 그룹 순위를 확인', source: creatureRef + 'images/demos/08-rankings.gif', motion: true },
    ],
    records: [
      { key: 'github-projects-kanban', label: '작업 칸반', caption: '설계 보완, 기능 구현, QA의 진행 상태를 공유', source: creatureRef + 'images/github-projects-kanban.png' },
      { key: 'github-discussions-reports', label: '일일 리포트', caption: 'GitHub Discussions에 작업 흐름을 날짜별로 기록', source: creatureRef + 'images/github-discussions-reports.png' },
    ],
    qa: [
      ['그룹 경쟁', '동시 가입에서 정원과 단일 활성 소속 검사', 'MySQL 통합 테스트 기록'],
      ['보상과 스케줄러', '기본 보상 4건 통과, 중복 실행에서 실제 작업 1회', 'QA-02'],
      ['결제·환불', '테스트 PG 기본 5건 통과', 'QA-03'],
      ['실시간 동기화', '장애 중 REST 조회 확인. 자동 재연결·폴링 중단은 후속 검증 범위', 'QA-04'],
    ],
    qaLinks: [
      { label: '가입 QA-01', url: creatureRef + 'test-results/QA-01-auth-group.md' },
      { label: 'Scheduler QA-02', url: creatureRef + 'test-results/QA-02-rewards-scheduler.md' },
      { label: '테스트 PG QA-03', url: creatureRef + 'test-results/QA-03-payment-refund.md' },
      { label: 'WebSocket QA-04', url: creatureRef + 'test-results/QA-04-websocket.md' },
      { label: '팀 발표 자료', url: 'https://heebaek200.github.io/shared-creature-game/presentation.html' },
    ],
    reflection: '시연에서는 성장과 권한 차이가 더 직접적으로 보일 필요가 있었습니다. 기술적으로는 리뷰 역할 분산과 자동 재연결 재검증, 제품 측면에서는 완전체 이후에도 참여를 지속할 동기가 후속 과제입니다.',
    featuredCase: 'scheduler',
  },
  'study-room': {
    strap: '웹 프레임워크 없이 HTTP 요청부터 예약 확정까지',
    background: [
      '사용자가 원하는 공간과 시간을 찾아 예약하고, 관리자는 공간·예약·환불 요청을 한곳에서 관리할 수 있도록 만들었습니다.',
      '라우팅, 세션, 역할 확인, JDBC와 트랜잭션을 직접 연결하면서 웹 프레임워크 아래에서 요청이 처리되는 구조를 학습하는 것이 기술 목표였습니다.',
    ],
    flow: ['세션과 회원 권한 확인', '스터디룸·시간 선택', '중복 검사 후 예약 확정', '취소 및 관리자 환불 처리'],
    architecture: { title: '프레임워크 없이 처리한 예약 요청 경로', kind: 'timeline', columns: [
      { label: 'HTTP 요청', steps: ['JDK HttpServer가 요청 수신 및 URL 라우팅'] },
      { label: 'Handler / Service', steps: ['세션 및 역할 확인', '예약 업무 규칙과 트랜잭션 적용'] },
      { label: 'DAO / MySQL', steps: ['JDBC로 방 잠금·중복 확인·저장', '처리 결과를 HTTP 응답으로 반환'] },
    ] },
    features: [
      ['사용자', '로그인, 공간 조회, 예약 신청, 예약 취소 및 환불 요청'],
      ['관리자', '공간·회원·예약 조회와 내부 환불 요청 승인 또는 거절'],
      ['요청 처리', 'JDK HttpServer로 요청을 받고 Handler·Service·DAO를 통해 MySQL에 접근했습니다.'],
    ],
    roles: [
      ['개인 · 설계 및 협업', '공동 설계, Issue·PR·Wiki 도입, 업무 분담과 통합 리뷰'],
      ['개인 · 개발 및 검증', '인증, 예약 동시성, 관리자·회원 환불 흐름에 참여하고 통합 테스트 리포트를 게시'],
      ['팀 · 구현 성과', '회원과 관리자 업무를 연결하고, 같은 공간에 겹치는 예약 요청을 제어했습니다. 환불 관리는 서비스 내부 처리입니다.'],
    ],
    management: '공동 설계를 Wiki와 이슈에 정리하고, 기능별 PR과 교차 테스트로 연결했습니다. 동시성 테스트 작성에는 LLM을 활용했고 결과 리포트를 게시했습니다.',
    captures: [
      { key: 'study-login', label: '회원 로그인', caption: '테스트 계정 입력과 회원가입 이동', source: studyRef + encodeURIComponent('1로그인 화면.png') },
      { key: 'study-rooms', label: '스터디룸 목록', caption: '수용 인원과 시간당 이용료 비교', source: studyRef + encodeURIComponent('2스터디룸 목록 화면.png') },
      { key: 'study-reservation', label: '예약 신청', caption: '공간을 확인하고 시작·종료 시간을 입력', source: studyRef + encodeURIComponent('3스터디룸 예약 신청 화면.png') },
      { key: 'study-admin', label: '관리자 홈', caption: '공간·회원·예약·환불 관리 진입점', source: studyRef + encodeURIComponent('4관리자 화면.png') },
    ],
    records: [],
    qa: [
      ['같은 방·겹치는 시간', '동시 요청 8건 중 1건 성공', '통과'],
      ['같은 방·맞닿은 시간', '끝 시각과 다음 시작 시각이 같은 요청 허용', '통과'],
      ['서로 다른 방', '독립적인 예약 요청 병행 처리', '통과'],
    ],
    qaLinks: [
      { label: '저장된 Gradle 테스트 리포트', url: report },
      { label: '교차 테스트 이슈 #12', url: study + '/issues/12' },
      { label: '프로젝트 보드', url: 'https://github.com/users/heebaek200/projects/5' },
    ],
    reflection: '저장된 예약 생성 테스트 결과는 세 건입니다. 테스트 Java 원본은 현재 저장소에 보존돼 있지 않아 이 리포트로 확인할 수 있는 범위를 표시했습니다. 향후 테스트 코드와 자동 실행 환경까지 함께 보존할 수 있습니다.',
    featuredCase: 'reservation',
  },
};

export interface ProjectCase extends Case {
  role: string;
  diagram: Diagram;
}

const detailedCases: Record<string, Pick<ProjectCase, 'role' | 'diagram'>> = {
  scheduler: { role: '스케줄러 설계 및 개발', diagram: { title: '서버 중단을 넘겨 업무 상태 복구', kind: 'timeline', columns: [
    { label: '서버 중단', steps: ['실행 시각을 지나 일부 작업이 만료 상태로 남음'] },
    { label: '애플리케이션 준비', steps: ['현재 시각과 저장된 시즌 상태를 대조', '필요한 시즌·퀘스트·부화 상태 정규화'] },
    { label: '정기 점검', steps: ['다음 주기에도 상태 재검사', '중복 실행 조건은 별도로 검증'] },
  ] } },
  websocket: { role: '실시간 상태 동기화 설계 및 개발', diagram: { title: '실시간 이벤트를 받은 뒤의 두 경로', kind: 'comparison', columns: [
    { label: '같은 스트림 · 다음 순번', steps: ['증분 이벤트 반영', '로컬 순번 갱신'] },
    { label: '스트림 변경 · 순번 누락', steps: ['현재 상태를 REST로 다시 조회', '스냅샷 기준으로 화면 정합성 회복'] },
  ] } },
  integrity: { role: '그룹·결제 흐름 설계와 검증 · 환불 구현은 팀원 담당', diagram: { title: '불확실한 결과를 확정하는 위치', kind: 'comparison', columns: [
    { label: '그룹 가입', steps: ['트랜잭션에서 정원 변경', '활성 소속 제약으로 중복 가입 방지'] },
    { label: '테스트 결제·환불', steps: ['서버가 결제·환불 상태 확인', '확정 상태에서 지급 또는 환불 반영'] },
  ] } },
  qa: { role: 'QA 발견 이후 팀 수정 작업과 검증 범위 추적', diagram: { title: '유효한 퀘스트를 잘못 차단한 조건', kind: 'comparison', columns: [
    { label: '발견', steps: ['시즌은 활성, 그룹은 부화 준비 중', '그룹 상태 조건이 완료 요청을 차단'] },
    { label: '수정', steps: ['시즌·기간과 그룹 상태를 따로 검증', '준비 중인 그룹도 유효한 퀘스트 완료 허용'] },
  ] } },
  contract: { role: '설계 문서 책임 정리와 변경 검토', diagram: { title: '같은 정보의 복제에서 책임 구분으로', kind: 'comparison', columns: [
    { label: '중복 정의', steps: ['업무 규칙과 API 계약이 여러 문서에 반복', '변경 때 복사본을 함께 고쳐야 함'] },
    { label: '책임 분리', steps: ['고유 ID를 유지하고 문서마다 맡을 범위를 정리', '후속 작업에서 원본 링크로 참조하는 원칙 제안'] },
  ] } },
  reservation: { role: '동시성 제어 직접 구현 · 팀 통합 결과 게시', diagram: { title: '같은 방을 예약하는 요청 A와 B', kind: 'lanes', columns: [
    { label: '요청 A', steps: ['같은 방의 행 잠금 획득', '겹치는 확정 예약 검사', '예약 저장 후 커밋'] },
    { label: '요청 B', steps: ['같은 방의 행 잠금 시도', '잠금 대기', 'A 커밋 이후 잠금 획득', '새 예약과의 겹침을 확인해 거절'] },
  ] } },
};

interface AdditionalCase extends ProjectCase { project: string }
const extraCases: AdditionalCase[] = [
  {
    project: 'creature', id: 'photo-retention', title: '실패한 사진 정리를 다음 작업에서 격리', outlineTitle: '사진 삭제 하나가 실패하면?',
    summary: '실패 항목이 후속 정리를 계속 밀어내는 위험을 다뤘습니다.',
    problem: '재시도 항목을 앞에서 계속 처리하면 삭제가 실패하는 사진이 다른 정리를 지연시킬 수 있었습니다.',
    decision: '재시도와 신규 처리 기회를 나누고, 대상의 실행권과 만료를 확인했습니다. 파일 I/O를 DB 트랜잭션 밖에서 처리하고 결과 확정 전에 소유권을 다시 확인했습니다.',
    verification: 'PR의 선택 테스트 보고에서 사진 61건과 Scheduler 회귀 33건 통과가 확인됐습니다. 앞선 전체 실행 이후 전체 재실행 성공 기록은 확인되지 않습니다.',
    role: '스케줄러·파일 정리 경합 설계 및 검증',
    diagram: { title: '삭제 한 건의 실행권과 실패 경로', kind: 'timeline', columns: [
      { label: '실행권 확보', steps: ['만료된 실행권 또는 처리 가능한 항목 선별'] },
      { label: '파일 I/O', steps: ['삭제 결과 확인', '실행권을 잃으면 완료 확정 중단'] },
      { label: '결과 분리', steps: ['성공은 완료 기록', '실패는 이후 재시도 대상으로 분리'] },
    ] },
    evidence: [{ label: '검증 기록 PR #86', url: creature + '/pull/86' }],
  },
  {
    project: 'creature', id: 'season-header', title: '공통 헤더의 시즌 타이머 갱신 리뷰', outlineTitle: '카운트다운이 멈췄다',
    summary: '시즌이 바뀌어도 재조회하지 않는 경로와 타이머 정리 누락을 리뷰에서 발견했습니다.',
    problem: '공통 레이아웃의 플래그가 갱신을 막고, 이전 타이머와 비동기 응답이 남을 수 있었습니다.',
    decision: '팀원이 추적 로직을 분리하고 시즌 종료·페이지 진입·탭 복귀를 조회 계기로 삼았습니다. 저는 수정 요청과 재리뷰에서 정리와 오래된 응답 차단을 확인했습니다.',
    verification: '병합 전 코드 재리뷰 범위입니다. 브라우저 실측 결과는 포함하지 않습니다.',
    role: '개인 코드 리뷰 및 재리뷰 · 수정 구현은 팀원 담당',
    diagram: { title: '갱신 시점과 이전 상태의 정리', kind: 'timeline', columns: [
      { label: '갱신 계기', steps: ['시즌 종료 / 진입 / 탭 복귀'] },
      { label: '기존 작업 정리', steps: ['이전 타이머 정리', '중복 조회 및 오래된 응답 방지'] },
      { label: '새 상태 반영', steps: ['최신 시즌을 기준으로 카운트다운 표시'] },
    ] },
    evidence: [{ label: '시즌 타이머 PR #95', url: creature + '/pull/95' }],
  },
  {
    project: 'creature', id: 'avatar-rendering', title: '20인 그룹의 아바타 렌더링 방식 선택', outlineTitle: 'Canvas 대신 DOM?',
    summary: '작은 그룹에서 아바타와 말풍선을 다루기에 적합한 브라우저 표현 방식을 비교했습니다.',
    problem: '위치·클릭·말풍선은 상호작용이 필요한데, 규모에 비해 복잡한 렌더링을 도입하면 유지 비용이 늘어납니다.',
    decision: '팀은 최대 20명과 기존 Vanilla JS 구성을 고려해 아바타별 DOM 요소와 CSS 전환을 사용했습니다.',
    verification: '소규모 비교 구현이 근거입니다. 대규모 성능 비교와 작은 화면의 배치 제약은 별도 범위입니다.',
    role: '팀의 기술 검증 사례',
    diagram: { title: '같은 동작을 구현하는 두 가지 표현 방식', kind: 'comparison', columns: [
      { label: 'Canvas', steps: ['한 캔버스에 렌더링', '요소별 클릭 판별과 말풍선 동작을 별도 구현'] },
      { label: 'DOM·CSS 선택', steps: ['아바타마다 요소·이벤트 배치', '위치와 전환을 CSS로 처리'] },
    ] },
    evidence: [{ label: '팀 기술 검증 PR #44', url: creature + '/pull/44' }],
  },
  {
    project: 'study-room', id: 'refund-state', title: '관리자 환불 요청의 중복 처리 방지', outlineTitle: '한 환불을 두 번 처리하면?',
    summary: '환불을 처리하기 전에 요청 행을 잠그고 현재 상태를 확인했습니다.',
    problem: '동일한 환불 요청을 관리자가 동시에 처리하면 이전 상태를 기준으로 결과가 덮일 수 있었습니다.',
    decision: '관리자 권한을 검사한 뒤 한 트랜잭션에서 환불 행을 잠그고, 요청 상태에서만 승인 또는 거절을 허용했습니다.',
    verification: '서비스 코드와 관련 PR을 근거로 정리했습니다. 저장된 예약 생성 통합 리포트는 환불 검증 결과에 포함되지 않습니다.',
    role: '관리자 및 회원 환불 업무 구현 참여',
    diagram: { title: '관리자 환불 상태의 전이', kind: 'timeline', columns: [
      { label: '처리 요청', steps: ['관리자 권한 확인'] },
      { label: '행 잠금', steps: ['현재 상태가 요청인지 확인'] },
      { label: '최종 상태', steps: ['승인 또는 거절 한 번만 반영', '이미 처리한 요청은 거절'] },
    ] },
    evidence: [{ label: '관리자 환불 PR #40', url: study + '/pull/40' }],
  },
  {
    project: 'study-room', id: 'reservation-ownership', title: '예약·환불의 서버 권한과 소유권 분리', outlineTitle: '버튼을 숨기면 끝일까?',
    summary: '일반 회원의 데이터 소유권과 관리자 권한을 서버에서 확인했습니다.',
    problem: '화면 상태에만 의존하면 회원과 관리자의 데이터 경계가 요청 처리에 전달되지 않습니다.',
    decision: '세션으로 사용자를 확인하고, 회원은 자신의 예약·환불에 접근하는지 검증했습니다. 관리자 처리는 별도로 역할을 확인합니다.',
    verification: '서비스 코드와 환불 PR을 검토했습니다. 전체 권한 경로를 재실행한 테스트 결과는 포함하지 않습니다.',
    role: '회원 인증 및 환불 기능 개발 참여',
    diagram: { title: '역할이 다른 두 요청의 검사 기준', kind: 'comparison', columns: [
      { label: '일반 회원', steps: ['로그인 세션 확인', '본인 데이터인지 확인한 뒤 처리'] },
      { label: '관리자', steps: ['관리자 역할 확인', '승인·거절 업무 규칙 적용'] },
    ] },
    evidence: [{ label: '회원 환불 PR #43', url: study + '/pull/43' }],
  },
];

/** 프로젝트 소속을 한 곳에서 정의해 탐색과 상세 라우팅에서 재사용한다. */
const caseIdsByProject: Record<string, string[]> = {
  creature: ['scheduler', 'photo-retention', 'websocket', 'integrity', 'qa', 'season-header', 'contract', 'avatar-rendering'],
  'study-room': ['reservation', 'refund-state', 'reservation-ownership'],
};

/** 프로젝트의 사례만 취합하고 기존 제목과 근거는 원본 데이터에서 가져온다. */
export function getProjectCases(projectId: string): ProjectCase[] {
  return (caseIdsByProject[projectId] ?? []).flatMap((id) => {
    const extra = extraCases.find((item) => item.id === id && item.project === projectId);
    if (extra) return [extra];
    const original = originalCases.find((item) => item.id === id);
    return original && detailedCases[id] ? [{ ...original, ...detailedCases[id] }] : [];
  });
}
