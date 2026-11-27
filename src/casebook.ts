import { cases as originalCases, type Case, type Evidence } from './content';

export interface Capture {
  key: string;
  extension?: 'png';
  label: string;
  caption: string;
  source: string;
  motion?: boolean;
}

export interface Diagram {
  title: string;
  kind: 'lanes' | 'timeline' | 'comparison' | 'states';
  columns: { label: string; steps: string[] }[];
  transitions?: { from: string; trigger: string; to: string }[];
}

interface Dossier {
  strap: string;
  background: string[];
  flow: string[];
  architecture: Diagram;
  features: string[][];
  roles: string[][];
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
      ['팀 · 구현 성과', '그룹·퀘스트·성장, 사진 인증, 아바타, 테스트 결제·환불과 QA'],
      ['팀원 · 구현', '아바타 렌더링 방식 선택, 공통 헤더 시즌 타이머 갱신, 환불 서비스'],
      ['개인 · 코드 리뷰와 QA 후속', '시즌 타이머 수정 요청·재리뷰(PR #95), 부화 전 퀘스트 오류 이슈 등록·담당 및 수정 PR 제출(#135·#137)'],
    ],
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
      ['실시간 동기화', '연결 장애 중 REST 조회로 현재 상태 반영 확인', 'QA-04'],
    ],
    qaLinks: [
      { label: '가입 QA-01', url: creatureRef + 'test-results/QA-01-auth-group.md' },
      { label: 'Scheduler QA-02', url: creatureRef + 'test-results/QA-02-rewards-scheduler.md' },
      { label: '테스트 PG QA-03', url: creatureRef + 'test-results/QA-03-payment-refund.md' },
      { label: 'WebSocket QA-04', url: creatureRef + 'test-results/QA-04-websocket.md' },
      { label: '팀 발표 자료', url: 'https://heebaek200.github.io/shared-creature-game/presentation.html' },
    ],
    reflection: '발표의 후속 방향으로 크리처 성장과 권한 차이를 더 직접적으로 보여주는 시연을 정리했습니다. 팀 운영에서는 리뷰 역할 분산을, 제품에서는 완전체 이후의 참여 동기를 개선 방향으로 잡았습니다.',
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
    captures: [
      { key: 'study-login', label: '회원 로그인', caption: '테스트 계정 입력과 회원가입 이동', source: studyRef + encodeURIComponent('1로그인 화면.png') },
      { key: 'study-rooms', label: '스터디룸 목록', caption: '수용 인원과 시간당 이용료 비교', source: studyRef + encodeURIComponent('2스터디룸 목록 화면.png') },
      { key: 'study-reservation', label: '예약 신청', caption: '공간을 확인하고 시작·종료 시간을 입력', source: studyRef + encodeURIComponent('3스터디룸 예약 신청 화면.png') },
      { key: 'study-admin', label: '관리자 홈', caption: '공간·회원·예약·환불 관리 진입점', source: studyRef + encodeURIComponent('4관리자 화면.png') },
    ],
    records: [
      { key: 'study-roadmap', extension: 'png', label: '스터디룸 GitHub Projects 로드맵', caption: '인증, 예약 동시성, 환불, 공통 라우팅과 화면 작업을 이슈·담당·일정으로 추적한 실제 로드맵', source: 'https://github.com/users/heebaek200/projects/5' },
    ],
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
    reflection: '예약 생성 통합 테스트에서는 요청이 겹치는 경우와 허용해야 할 경계를 함께 다뤘습니다. Gradle 리포트를 공유해 팀이 세 시나리오의 동작을 다시 살펴볼 수 있게 했습니다.',
    featuredCase: 'reservation',
  },
};

export interface ProjectCase extends Case {
  role: string;
  diagram: Diagram;
}

const detailedCases: Record<string, Pick<ProjectCase, 'role' | 'diagram' | 'details'>> = {
  scheduler: { role: '스케줄러 설계 및 개발', diagram: { title: '서버 중단을 넘겨 업무 상태 복구', kind: 'timeline', columns: [
    { label: '서버 중단', steps: ['실행 시각을 지나 일부 작업이 만료 상태로 남음'] },
    { label: '기동·주기 트리거', steps: ['현재 시각과 저장된 시즌 상태를 대조', '실행할 작업이 있으면 실행권 확인'] },
    { label: '상태 조정', steps: ['만료 실행권은 인계, 진행 중인 실행권은 존중', '시즌 확정 뒤 관련 퀘스트·부화 상태 조정'] },
  ] }, details: [
    { heading: '시계가 아니라 저장된 상태를 기준으로', paragraphs: ['서버가 내려간 동안 예약 시각을 지나면 그 시점의 이벤트는 돌아오지 않습니다. 부팅과 정기 트리거가 같은 상태 조정 로직을 타도록 해 현재 시각과 DB의 실행 이력에서 필요한 작업을 판단했습니다.'] },
    { heading: '동일 작업의 중복과 부분 실패', paragraphs: ['동시에 트리거가 들어오는 상황에 대비해 실행 이력과 Lease로 작업을 맡은 실행을 구분했습니다. 시즌 상태를 먼저 맞춘 다음 퀘스트와 부화에 반영해 선후 관계를 지켰습니다.'] },
  ] },
  websocket: { role: '실시간 상태 동기화 설계 및 개발', diagram: { title: '실시간 이벤트를 받은 뒤의 두 경로', kind: 'comparison', columns: [
    { label: '같은 스트림 · 다음 순번', steps: ['증분 이벤트 반영', '로컬 순번 갱신'] },
    { label: '스트림 변경 · 순번 누락', steps: ['현재 상태를 REST로 다시 조회', '스냅샷 기준으로 화면 정합성 회복'] },
    { label: '중복 · 이미 본 이벤트', steps: ['이미 적용한 ID와 지나간 순번은 반영하지 않음'] },
  ] }, details: [
    { heading: '이벤트보다 스냅샷이 복구 기준', paragraphs: ['WebSocket 이벤트는 현재 화면을 빨리 갱신하기 위한 신호입니다. 이벤트에 담긴 스트림 ID와 순번을 로컬 기준과 비교하고, 누락되거나 스트림이 바뀌면 REST 스냅샷으로 다시 맞춥니다.'] },
    { heading: '통신이 끊겨도 현재 상태를 읽는다', paragraphs: ['동기화 호출이 이미 진행 중이면 중복해서 스냅샷을 요청하는 대신 다시 확인할 필요를 표시했습니다. 연결이 어려운 동안에는 주기적인 REST 조회를 사용해 서버 상태를 반영합니다.'] },
  ] },
  integrity: { role: '그룹 가입과 정원 제어 설계·개발', diagram: { title: '정원과 활성 소속이 각각 보호하는 조건', kind: 'comparison', columns: [
    { label: '남은 자리를 두 회원이 요청', steps: ['남은 정원이 있을 때만 인원 증가', '정원이 찬 뒤 도착한 요청은 가입 거절'] },
    { label: '같은 회원이 두 그룹에 요청', steps: ['활성 멤버십 유일성 제약', '멤버십 생성에 실패하면 인원 변경도 함께 롤백'] },
  ] }, details: [
    { heading: '한 번의 조회만으로는 경쟁을 막을 수 없다', paragraphs: ['정원 조회와 가입을 떼어 놓으면 두 요청이 같은 빈자리를 볼 수 있습니다. 정원 확인을 변경 조건에 포함시켜 DB에 적용하고, 사용자 기준의 활성 소속은 별도 제약으로 맡겼습니다.'] },
  ] },
  contract: { role: '설계 문서 책임 정리와 변경 검토', diagram: { title: '같은 정보의 복제에서 책임 구분으로', kind: 'comparison', columns: [
    { label: '중복 정의', steps: ['업무 규칙과 API 계약이 여러 문서에 반복', '변경 때 복사본을 함께 고쳐야 함'] },
    { label: '책임 분리', steps: ['고유 ID를 유지하고 문서마다 맡을 범위를 정리', '후속 작업에서 원본 링크로 참조하는 원칙 제안'] },
  ] }, details: [
    { heading: '변경 영향까지 팀에 전달', paragraphs: ['문서별 책임을 정하면서 기능 식별자를 유지했습니다. 명세가 바뀌는 이슈에서는 변경할 조건과 영향을 받는 구현 작업을 함께 짚었습니다. 운영 규칙과 화면이 다른 해석을 갖지 않도록 참조할 기준을 연결했습니다.'] },
  ] },
  reservation: { role: '동시성 제어 직접 구현 · 팀 통합 결과 게시', diagram: { title: '같은 방을 예약하는 요청 A와 B', kind: 'lanes', columns: [
    { label: '요청 A', steps: ['같은 방의 행 잠금 획득', '겹치는 확정 예약 검사', '예약 저장 후 커밋'] },
    { label: '요청 B', steps: ['같은 방의 행 잠금 시도', '잠금 대기', 'A 커밋 이후 잠금 획득', '새 예약과의 겹침을 확인해 거절'] },
  ] }, details: [
    { heading: '예약이 아직 없을 때도 잠글 수 있는 행', paragraphs: ['겹치는 예약 행을 잠그는 방식은 첫 예약처럼 대상이 없을 때 같은 방의 요청을 직렬화하기 어렵습니다. 이미 존재하는 방 행을 먼저 잠그고 같은 JDBC 연결에서 확정 예약의 겹침 검사, 금액 계산, 저장을 수행했습니다.'] },
    { heading: '연속 시간은 허용하고 다른 방은 병렬로', paragraphs: ['기존 예약의 끝과 새 요청의 시작이 같은 경우는 겹침에서 제외했습니다. 방별로 잠금을 잡으므로 다른 방의 예약은 별도 트랜잭션으로 진행할 수 있습니다.'] },
  ] },
};

interface AdditionalCase extends ProjectCase { project: string }
const extraCases: AdditionalCase[] = [
  {
    project: 'creature', id: 'photo-retention', title: '실패한 사진 정리를 다음 작업에서 격리', outlineTitle: '사진 삭제 하나가 실패하면?',
    summary: '실패 항목이 후속 정리를 계속 밀어내는 위험을 다뤘습니다.',
    problem: '재시도 항목을 앞에서 계속 처리하면 삭제가 실패하는 사진이 다른 정리를 지연시킬 수 있었습니다.',
    decision: '재시도와 신규 처리 기회를 나누고, 대상의 실행권과 만료를 확인했습니다. 파일 I/O를 DB 트랜잭션 밖에서 처리하고 결과 확정 전에 소유권을 다시 확인했습니다.',
    verification: 'PR에 기록한 선택 테스트에서 사진 정리 61건과 스케줄러 회귀 33건이 통과했습니다.',
    role: '스케줄러·파일 정리 경합 설계 및 검증',
    details: [
      { heading: '새 작업과 재시도의 진행 기회를 분리', paragraphs: ['실패가 반복되는 항목이 배치의 앞을 계속 채우는 문제를 막기 위해 신규 처리와 재시도를 나눴습니다. 실행을 맡은 작업자가 장시간 I/O 중에도 소유권을 확인할 수 있도록 항목별 실행권과 만료 시점을 관리했습니다.'] },
      { heading: '삭제와 DB 확정 사이에서 권한을 다시 확인', paragraphs: ['파일 삭제를 DB 잠금 안에 넣으면 느린 저장소가 다른 처리까지 붙잡습니다. 파일 I/O를 밖에서 처리하고 결과를 기록하기 직전에 소유권을 확인해, 만료된 실행이 최신 상태를 덮어쓰는 경로를 줄였습니다.'] },
    ],
    diagram: { title: '삭제 한 건의 실행권과 실패 경로', kind: 'timeline', columns: [
      { label: '실행권 확보', steps: ['만료된 실행권 또는 처리 가능한 항목 선별'] },
      { label: '파일 I/O', steps: ['삭제 결과 확인', '실행권을 잃으면 완료 확정 중단'] },
      { label: '결과 분리', steps: ['성공은 완료 기록', '실패는 이후 재시도 대상으로 분리'] },
    ] },
    evidence: [{ label: '검증 기록 PR #86', url: creature + '/pull/86' }],
  },
  {
    project: 'creature', id: 'payment', title: '테스트 PG 결제 확정과 환불 결과 복구', outlineTitle: '결제 결과가 늦게 오면?',
    summary: '외부 알림의 도착 순서와 관계없이 서버가 확인한 상태를 지급·환불의 기준으로 삼았습니다.',
    problem: '브라우저 복귀, Webhook 재시도, 관리자 환불의 결과가 서로 다른 시점에 도착할 수 있었습니다.',
    decision: '구매는 서버가 PG 상태와 주문 정보를 대조한 뒤 확정하고, 이미 반영된 주문에 다시 지급하지 않도록 했습니다. 팀원이 구현한 환불 흐름은 외부 호출이 불명확하면 PG 조회로 최종 결과를 판별합니다.',
    verification: '테스트 PG 환경에서 팀은 구매·환불과 중복·역순 알림, 환불 처리 중 장착 제한을 확인했습니다.',
    role: '본인 · 결제 검증·Webhook과 상점 연동 / 팀원 · 환불 서비스 구현',
    diagram: { title: '결제 확인과 환불 결과의 상태 전이', kind: 'states', columns: [], transitions: [
      { from: '결제 대기', trigger: '서버가 주문과 PG 결제 상태를 대조', to: '결제 확정 · 아이템 지급' },
      { from: '결제 확정', trigger: '같은 결제 알림이 다시 도착', to: '기존 지급 유지' },
      { from: '환불 요청', trigger: '외부 응답이 불명확해 결과 보류', to: 'PG 상태 재조회' },
      { from: 'PG 상태 재조회', trigger: '외부 취소 여부를 확인', to: '실제 결과에 맞춰 상태 반영' },
    ] },
    details: [
      { heading: '누가 사실을 확정하는가', paragraphs: ['프론트엔드의 결제 결과 화면은 사용자의 진행을 안내합니다. 지급 판단은 서버에서 주문의 실제 상태와 외부 결제 기록을 비교한 결과를 기준으로 했습니다.'] },
      { heading: '응답 시간과 거래 상태의 분리', paragraphs: ['환불 호출에 타임아웃이 생겨도 외부 취소가 진행됐을 수 있습니다. 팀원 구현은 응답 지연을 거래 실패로 간주하지 않고 외부 상태를 다시 조회해 시스템의 기록을 맞추는 흐름을 사용했습니다.'] },
    ],
    evidence: [
      { label: '결제 검증·Webhook PR #71', url: creature + '/pull/71' },
      { label: '상점 연동 PR #110', url: creature + '/pull/110' },
      { label: '팀원 환불 서비스 PR #98', url: creature + '/pull/98' },
      { label: '테스트 PG QA-03', url: creatureRef + 'test-results/QA-03-payment-refund.md' },
    ],
  },
  {
    project: 'creature', id: 'season-header', title: '시즌 타이머 갱신 문제를 코드 리뷰에서 발견', outlineTitle: '시즌이 끝났는데 헤더는 그대로',
    summary: '팀원의 PR에서 최초 실행과 이후 갱신이 같은 플래그에 묶여 있던 동작을 추적했습니다.',
    problem: '공통 헤더가 처음 받은 시즌 정보만 사용해 시간을 다시 계산했습니다. 시즌이 바뀌어도 새 시즌을 조회하거나 기존 타이머를 교체할 경로가 없었습니다.',
    decision: '재조회 시점과 타이머 정리를 분리해 달라고 요청했습니다. 팀원은 시즌 추적기를 별도 모듈로 옮기고 시즌 종료·페이지 진입·탭 복귀에 최신 정보를 확인하는 경로를 추가했습니다.',
    verification: '수정 코드를 재리뷰해 중복 조회 방지, 타이머 정리, 이전 요청 결과 무효화를 대조하고 승인했습니다.',
    role: '본인 · 최초 리뷰·수정 요청·재리뷰 승인 / 팀원 · 코드 구현',
    diagram: { title: '시즌이 바뀌는 순간의 수정 전후', kind: 'comparison', columns: [
      { label: '수정 전', steps: ['헤더가 처음 한 번만 시즌 조회', '시즌이 끝나도 이전 데이터로 시간 계산', '새 시즌으로 교체하는 경로 없음'] },
      { label: '팀원 수정 후', steps: ['종료·진입·탭 복귀 시 최신 시즌 조회', '이전 타이머와 오래된 응답 정리', '최신 정보로 카운트다운 교체'] },
    ] },
    details: [
      { heading: '중복 실행 방지와 갱신 가능성은 다른 문제', paragraphs: ['최초 실행 플래그가 같은 타이머를 여러 번 만드는 것까지는 막았습니다. 다만 그 값이 새 시즌 조회까지 막는다는 점을 동작 순서로 설명해, 타이머의 수명과 조회 시점을 나눌 수 있게 했습니다.'] },
      { heading: '같은 리뷰에서 확인한 공통 UI의 경계', paragraphs: ['비로그인 사용자에게 인증이 필요한 시즌 API를 요청하는 흐름과, 사용자 정보 조회 실패가 로그인 같은 공개 페이지 표시를 막는 흐름도 코드에서 짚었습니다. 재리뷰에서 인증 상태에 따른 조회 분기와 공개 화면의 오류 처리 방향을 확인했습니다.'] },
    ],
    evidence: [
      { label: '최초 리뷰 · 수정 요청', url: creature + '/pull/95#issuecomment-6848395011' },
      { label: '수정 코드 재리뷰 · 승인', url: creature + '/pull/95#issuecomment-6905448441' },
    ],
  },
  {
    project: 'creature', id: 'qa', title: '부화 전 퀘스트 완료 차단을 QA 후속 작업으로 정리', outlineTitle: '기간이 남았는데 왜 완료가 막힐까?',
    summary: 'QA에서 발견된 실패를 시즌 상태, 그룹 상태, 화면 안내의 세 가지 변경 조건으로 나눴습니다.',
    problem: '공통 시즌과 퀘스트 기간이 유효해도, 그룹이 부화 준비 상태이면 완료 요청이 막혔습니다. 화면에는 실제 거절 사유와 다른 기간 종료 안내가 떴습니다.',
    decision: '이슈에 공통 시즌·퀘스트 기간·그룹 상태를 분리해 판단하고 준비 중인 그룹에서도 유효한 완료와 보상을 허용하는 조건을 정리했습니다. 수정 PR은 체크인과 퀘스트 처리의 공통 조건 및 화면 오류 안내를 함께 다뤘습니다.',
    verification: '등록한 이슈와 병합된 PR에 업무 규칙·API 계약·서버와 화면 변경, 퀘스트 및 오류 정책 테스트가 연결돼 있습니다.',
    role: '본인 · 이슈 등록·담당 및 수정 PR 제출 / 팀 · 서버·화면 수정 통합',
    diagram: { title: '부화 상태와 퀘스트 기간을 분리한 검증', kind: 'timeline', columns: [
      { label: '공통 조건', steps: ['시즌과 퀘스트 기간이 유효한지 확인'] },
      { label: '그룹 조건', steps: ['준비 중 또는 활성 그룹에서 완료 허용', '종료한 그룹의 완료는 거절'] },
      { label: '화면 반영', steps: ['성공 시 보상 반영', '거절 시 업무 사유를 구분해 표시'] },
    ] },
    details: [
      { heading: '조건 하나를 없애는 대신 판단을 분리', paragraphs: ['공통 시즌만 검사하면 이미 끝난 그룹까지 허용될 수 있었습니다. 이슈의 완료 조건에 그룹의 허용 상태와 실제 기간 종료를 따로 명시해 서버 판단과 화면 메시지를 맞췄습니다.'] },
    ],
    evidence: [
      { label: 'QA 후속 이슈 #135', url: creature + '/issues/135' },
      { label: '병합된 수정 PR #137', url: creature + '/pull/137' },
    ],
  },
  {
    project: 'study-room', id: 'refund-state', title: '관리자 환불 요청의 중복 처리 방지', outlineTitle: '한 환불을 두 번 처리하면?',
    summary: '환불을 처리하기 전에 요청 행을 잠그고 현재 상태를 확인했습니다.',
    problem: '동일한 환불 요청을 관리자가 동시에 처리하면 이전 상태를 기준으로 결과가 덮일 수 있었습니다.',
    decision: '관리자 권한을 검사한 뒤 한 트랜잭션에서 환불 행을 잠그고, 요청 상태에서만 승인 또는 거절을 허용했습니다.',
    verification: '관리자 환불 PR에서 요청 상태에만 전이를 허용하고, 한 건의 변경을 확인한 뒤 커밋하는 흐름을 코드로 확인할 수 있습니다.',
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
    verification: '회원 환불 PR에 회원의 데이터 소유권 확인과 환불 요청 처리 흐름이 기록돼 있습니다.',
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
  creature: ['scheduler', 'photo-retention', 'websocket', 'integrity', 'payment', 'contract', 'season-header', 'qa'],
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
