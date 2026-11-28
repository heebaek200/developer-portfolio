import type { Capture, Diagram } from './casebook';
import type { Evidence } from './content';

const study = 'https://github.com/heebaek200/study_room_reservation';
const wiki = study + '/wiki';
const creature = 'https://github.com/heebaek200/shared-creature-game';
const docs = creature + '/blob/main/docs/';
const creatureContract: Capture = {
  key: 'creature-ai-contract', extension: 'png', label: '공동 육성 실행 계약 발췌',
  caption: '프로젝트의 렌더링, 패키지, 프론트엔드 기반 구조를 실행 계약으로 기록했습니다.',
};

interface DesignEvidence {
  intro: string;
  index: Capture;
  documents: Capture[];
  trace: Diagram;
  links: Evidence[];
}

/** 설계 문서에서 실제 기능과 검증까지 따라갈 수 있는 프로젝트별 근거. */
export const projectDesigns: Record<string, DesignEvidence> = {
  'study-room': {
    intro: '세 사람이 서로 다른 기능을 맡기 전에 권한, 예약 상태와 화면 흐름을 Wiki에 합의했습니다. 이 문서를 기준으로 작업 이슈를 쪼개고 PR과 교차 테스트에서 같은 조건을 확인했습니다.',
    index: { key: 'study-design-index', extension: 'png', label: '스터디룸 Wiki 설계 문서 목록', caption: '요구사항, 권한, 데이터 모델, 사용자 시나리오와 화면을 구현 전에 정의했습니다.', source: wiki + '#문서' },
    documents: [
      { key: 'study-database', extension: 'png', label: '데이터베이스 설계서', caption: '회원·공간·예약·환불의 데이터와 상태를 정의했습니다.', source: wiki + '/데이터베이스-설계서-및-ERD' },
      { key: 'study-permission-matrix', extension: 'png', label: '권한별 기능 매트릭스', caption: '회원 본인의 예약 변경과 관리자 업무를 나눠 화면·서버 권한의 기준을 만들었습니다.', source: wiki + '/권한별-기능-매트릭스' },
    ],
    trace: { title: '예약 설계가 팀의 구현 기준이 된 과정', kind: 'timeline', columns: [
      { label: '공동 설계', steps: ['권한·업무 규칙·화면·클래스 책임 합의'] },
      { label: '작업 분담', steps: ['예약의 겹침 판단과 완료 조건을 이슈 #8에 연결'] },
      { label: '구현과 확인', steps: ['PR #33에서 행 잠금 적용', '테스트 리포트에서 같은 방·맞닿은 시간·다른 방을 확인'] },
    ] },
    links: [
      { label: '작업 분담 및 이슈 목록', url: wiki + '/작업-분담-및-Issue-목록' },
      { label: '예약 동시성 이슈 #8', url: study + '/issues/8' },
      { label: '예약 동시성 구현 PR #33', url: study + '/pull/33' },
    ],
  },
  creature: {
    intro: '설계 문서의 목차에 요구사항, 업무 규칙, 화면, API, 데이터베이스와 클래스 책임을 연결했습니다. 팀원은 구현 안내서에서 담당 기능의 계약을 찾고, AI는 같은 설계와 구조화된 실행 계약을 함께 참조했습니다.',
    index: { key: 'creature-design-index', extension: 'png', label: '공동 육성 설계 문서 목록', caption: '팀 설계의 출발점입니다. 구현 안내서와 각 문서, 선행 기술 검증 자료를 한곳에서 찾을 수 있습니다.', source: docs + 'index.md' },
    documents: [
      { key: 'creature-database', extension: 'png', label: '계정·그룹 운영 ERD', caption: '회원과 그룹 소속의 관계 및 제약을 데이터 설계에서 확인합니다.', source: docs + 'database-design.md' },
      { key: 'creature-wireframes', extension: 'png', label: '크리처 홈 와이어프레임', caption: '공동 성장, 기여도, 퀘스트 진입의 화면 구성을 합의한 설계 시안입니다.', source: docs + 'design/wireframes/creature.html' },
      { key: 'creature-convention', extension: 'png', label: '팀 코드 컨벤션', caption: '공통 실행 환경과 코드 작성·리뷰 기준을 정리했습니다.', source: docs + 'convention.md' },
      { key: 'creature-gantt-draft', extension: 'png', label: '간트 차트 초안', caption: '공통 기반이 준비된 뒤 기능 작업의 선후 관계와 예상 일정을 논의한 초안입니다.', source: docs + 'shared-creature-game_day1-10_schedule.md' },
      creatureContract,
    ],
    trace: { title: '그룹 생성 요구사항 REQ-GRP-001을 따라가는 법', kind: 'timeline', columns: [
      { label: '업무 규칙과 화면', steps: ['활성 그룹 소속과 생성 조건 확인', '/groups/select에서 입력과 성공 후 이동 정의'] },
      { label: 'API와 데이터', steps: ['createGroup 요청·성공·오류 계약 확인', '그룹·활성 멤버십의 DB 제약과 클래스 책임 연결'] },
      { label: '구현과 QA', steps: ['화면 API 호출과 서버 Controller를 연결', 'QA-01에서 그룹 생성과 가입 흐름 확인'] },
    ] },
    links: [
      { label: '구현 시작 안내서', url: docs + 'implementation-guide.md' },
      { label: '설계 결정 기록', url: docs + 'decision-log.md' },
      { label: '프론트엔드 그룹 API', url: creature + '/blob/main/frontend/src/features/group/api.js' },
      { label: '그룹 Controller', url: creature + '/blob/main/src/main/java/com/team/sharedcreature/group/api/GroupController.java' },
      { label: '인증·그룹 QA-01', url: docs + 'test-results/QA-01-auth-group.md' },
    ],
  },
};

export const contractCaptures: Capture[] = [
  creatureContract,
  { key: 'workflow-files', extension: 'png', label: '개발 절차 문서 구성', caption: '공통 규칙과 설계·공통 기반·이슈 단위 절차를 Markdown으로 분리했습니다.' },
  { key: 'workflow-contract', extension: 'png', label: 'AMALITE 설계 절차 발췌', caption: '팀이 읽는 설계 문서와 검토 기준을 정리하는 절차입니다.' },
  { key: 'workflow-contract-2', extension: 'png', label: 'SPEAR 공통 기반 절차 발췌', caption: '포함하기로 확정한 항목을 기준으로 공통 기반을 구현하는 절차입니다.' },
];

export const contractExample = `environment.mysql-profiles:
  status: included
  sourceDecisions:
    - environment.local-test-mysql-ddl-policy
    - database.schema-management-with-special-sql
  summary: local·test MySQL Profile과 비밀정보 없는 환경변수 예시를 구성한다.
  acceptance:
    - local은 ddl-auto=update, test는 별도 MySQL DB의 create-drop으로 기동한다.
    - H2 의존성과 설정을 사용하지 않는다.
  dependencies: []`;

export const workflowProof = [
  { label: '공동 육성 설계 PR #7', url: creature + '/pull/7' },
  { label: '공통 기반 PR #10', url: creature + '/pull/10' },
  { label: '설계 계약 개선 PR #46', url: creature + '/pull/46' },
  { label: '시즌 타이머 리뷰 PR #95', url: creature + '/pull/95' },
  { label: '퀘스트 QA 후속 PR #137', url: creature + '/pull/137' },
];
