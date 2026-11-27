export interface Evidence {
  label: string;
  url: string;
}

export interface Case {
  id: string;
  title: string;
  outlineTitle: string;
  summary: string;
  problem: string;
  decision: string;
  verification: string;
  evidence: Evidence[];
  details?: { heading: string; paragraphs: string[] }[];
}

export interface Project {
  id: string;
  title: string;
  period: string;
  team: string;
  stack: string;
  summary: string;
  evidence: Evidence[];
}

const creature = 'https://github.com/heebaek200/shared-creature-game';
const study = 'https://github.com/heebaek200/study_room_reservation';

export const profile = {
  name: '이희백',
  role: '풀스택 웹 개발자',
  headline: ['소프트웨어를 만들고,', '팀이 만드는 방식도 개선합니다.'],
  introduction: '일본 IT 기업에서 6년 6개월간 업무 시스템을 개발하고 유지보수했습니다. 화면과 검증 로직을 공통화했던 경험을 바탕으로, 지금은 팀의 작업 환경부터 명세·구현·리뷰·검증이 이어지는 개발 과정까지 설계합니다.',
  github: 'https://github.com/heebaek200',
};

export const projects: Project[] = [
  {
    id: 'creature', title: '다 같이 키우는 생명체', period: '2026년 11월 · 약 3.5주',
    team: '4인 팀 · 팀장 겸 개발자', stack: 'Spring Boot · MySQL · Vite · WebSocket',
    summary: '구성원들이 퀘스트를 수행하고 공동 생명체를 성장시키는 웹 서비스입니다.',
    evidence: [
      { label: '프로젝트 소스', url: creature },
      { label: '칸반 캡처', url: creature + '/blob/main/docs/images/github-projects-kanban.png' },
      { label: '일일 리포트 캡처', url: creature + '/blob/main/docs/images/github-discussions-reports.png' },
      { label: 'QA 기록', url: creature + '/tree/main/docs/test-results' },
    ],
  },
  {
    id: 'study-room', title: '스터디룸 예약 관리 시스템', period: '2026.09.11–09.16',
    team: '3인 팀 · 팀장 겸 개발자', stack: 'Java 21 · JDK HttpServer · JDBC · MySQL',
    summary: '스터디룸 예약·취소와 관리자 환불 처리를 연결한 웹 서비스입니다.',
    evidence: [
      { label: '실행 화면 및 소스', url: study },
      { label: '통합 테스트 리포트', url: 'https://heebaek200.github.io/study_room_reservation/' },
      { label: '예약 동시성 PR #33', url: study + '/pull/33' },
    ],
  },
];

export const cases: Case[] = [
  {
    id: 'contract', title: '설계 문서의 책임과 변경 범위 정리', summary: '기능 규칙과 계약을 담당 문서에서 확인할 수 있도록 정리했습니다.',
    outlineTitle: '문서가 둘, 정답도 둘?',
    problem: '같은 계약이 여러 설계 문서에 반복되면 수정할 때 일부 내용이 남아 구현 기준이 달라질 수 있었습니다.',
    decision: '문서마다 책임을 정하고 기존 식별자를 유지했습니다. 다른 문서에서는 필요한 계약의 원본을 참조하도록 정리했습니다.',
    verification: '설계 리팩터링 PR에 변경 범위를 남겼습니다. 이후 API 단일 원본 적용은 개선 방향으로 남았습니다.',
    evidence: [{ label: '설계 문서 정리 PR #46', url: creature + '/pull/46' }],
  },
  {
    id: 'legacy', title: '레거시 CSV 처리 프로그램 재설계', summary: '기존 출력 요구와 입력 형식을 보존하면서 팀이 유지할 수 있는 PHP 프로그램으로 다시 구현했습니다.',
    outlineTitle: '팀이 유지할 수 있는 CSV 처리',
    problem: '기존 프로그램은 담당자 퇴사 후 유지보수가 어려웠고, 데이터에 따라 출력 품질 문제가 발생했습니다.',
    decision: '기존 출력 요구를 확인하고 팀에서 유지보수할 수 있는 PHP로 재구현했습니다. 중복 처리와 불필요한 데이터 변환을 줄였습니다.',
    verification: 'Excel 체크리스트로 기존 동작을 수동 검증했습니다. 시간은 CSV 처리 프로그램 기준입니다.', evidence: [],
  },
  {
    id: 'scheduler', title: '서버 재시작을 고려한 예약 작업', summary: '프로세스가 중단돼도 처리 대상을 다시 확인할 수 있도록 설계했습니다.',
    outlineTitle: '서버가 꺼지면 작업은?',
    problem: '실행 시점을 메모리에만 의존하면 중단 중 만료된 작업을 놓칠 수 있었습니다.',
    decision: '저장된 상태를 기준으로 복구 대상을 확인하고 예약 작업과 정리 작업의 영향을 분리해 검토했습니다.',
    verification: 'QA-02에서는 동시 중복 요청에도 실제 작업이 한 번만 실행됐습니다. PR #86에는 local·dev 환경의 기동 복구와 부분 실패 복구 검증을 별도로 기록했습니다.',
    evidence: [
      { label: '재시작 정책 결정', url: creature + '/issues/24#issuecomment-6653782943' },
      { label: '스케줄러 QA 기록', url: creature + '/blob/main/docs/test-results/QA-02-rewards-scheduler.md' },
      { label: 'PR #86 기동·복구 검증', url: creature + '/pull/86#issuecomment-6809447816' },
    ],
  },
  {
    id: 'websocket', title: 'WebSocket 재연결과 상태 복구', summary: '재접속 시 서버의 현재 상태를 다시 확인하는 흐름을 구성했습니다.',
    outlineTitle: '소켓이 끊겼다. 그다음은?',
    problem: '연결이 끊긴 동안 발생한 이벤트를 클라이언트가 놓칠 수 있었습니다.',
    decision: 'REST 스냅샷으로 현재 상태를 확인하고 WebSocket 이벤트로 이후 변경을 받는 방식을 사용했습니다.',
    verification: '팀 QA에서 WebSocket 연결 장애 중 REST 조회로 현재 상태가 반영되는 동작을 확인했습니다.',
    evidence: [{ label: 'WebSocket PR #90', url: creature + '/pull/90' }, { label: '팀 QA 기록', url: creature + '/tree/main/docs/test-results' }],
  },
  {
    id: 'integrity', title: '동시 가입에서 그룹 정원과 단일 소속 보호', summary: '정원과 사용자당 활성 그룹 한 개라는 서로 다른 규칙을 DB 변경과 함께 지켰습니다.',
    outlineTitle: '정원이 한 자리 남았을 때',
    problem: '남은 자리를 여러 사람이 동시에 요청하거나, 같은 사용자가 서로 다른 그룹에 동시에 가입할 수 있었습니다.',
    decision: '그룹의 정원 변경과 멤버십 생성을 한 트랜잭션으로 처리하고, 활성 소속의 유일성을 DB 제약으로 보호했습니다.',
    verification: 'MySQL 통합 검증에서 남은 한 자리에 동시 요청한 경우 한 명만 가입했고, 같은 사용자의 두 그룹 동시 요청에서도 활성 소속이 하나 남았습니다.',
    evidence: [
      { label: '그룹 가입 PR #45', url: creature + '/pull/45' },
      { label: '가입 제한 QA-01', url: creature + '/blob/main/docs/test-results/QA-01-auth-group.md' },
    ],
  },
  {
    id: 'reservation', title: '같은 스터디룸의 동시 예약 제어', summary: '동일 공간의 잠금과 시간 겹침 재검사를 한 트랜잭션으로 묶었습니다.',
    outlineTitle: '동시 예약 8건, 성공 1건',
    problem: '같은 공간에서 겹치는 시간으로 동시에 요청하면 두 요청이 모두 예약 가능하다고 판단할 수 있었습니다.',
    decision: '공간 행을 잠그고 같은 트랜잭션 내에서 시간 겹침을 재확인했습니다.',
    verification: '저장된 팀 통합 테스트 리포트에서 같은 공간·시간대 동시 요청 8건 중 1건이 성공했습니다.',
    evidence: [{ label: '통합 테스트 리포트', url: 'https://heebaek200.github.io/study_room_reservation/' }, { label: 'PR #33', url: study + '/pull/33' }],
  },
];

export const career = [
  ['2014.07–2020.12', '일본 IT 기업 · 시스템 엔지니어', '물류·창고 SaaS 유지보수, 고객사별 기능 확장, 공통 검증·화면 기반 개발'],
  ['약 6년', '영상 편집 및 콘텐츠 운영', '콘텐츠 기획·제작, 사용자 반응 분석, 데이터 기반 작업 효율화'],
  ['2026.07–현재', '풀스택 개발자 교육', 'Java와 Spring Boot 기반 웹 개발, 팀 프로젝트 관리 및 AI 기반 개발 절차 설계'],
];

export const credentials = ['정보처리기사 · 2014년 최종 합격', 'JLPT N1 · 2021년 취득', 'PCCP Java Lv.3 · 2026년'];
export const skills = [
  ['현재 주력', 'Java, JavaScript, SQL, HTML/CSS'],
  ['팀 프로젝트', 'Spring Boot, Spring Data JPA, MySQL, Vite, WebSocket'],
  ['과거 실무', 'PHP, FuelPHP, Laravel, jQuery, PostgreSQL'],
  ['참조 기반 구현·실습', 'React, TypeScript, GitHub Actions, Docker, AWS'],
  ['협업과 검증', 'Git, GitHub Issues·Projects·PR, API 설계, 테스트 결과 검토'],
  ['콘텐츠와 언어', '일본어 업무 커뮤니케이션, Premiere Pro, After Effects, Excel·Sheets'],
];
