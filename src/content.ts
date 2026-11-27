export interface Evidence {
  label: string;
  url: string;
}

export interface Case {
  id: string;
  title: string;
  summary: string;
  problem: string;
  decision: string;
  verification: string;
  evidence: Evidence[];
}

export interface Project {
  id: string;
  title: string;
  period: string;
  team: string;
  stack: string;
  summary: string;
  contribution: string;
  outcome: string;
  caseIds: string[];
  evidence: Evidence[];
  video?: Evidence;
  image?: Evidence;
}

const creature = 'https://github.com/heebaek200/shared-creature-game';
const study = 'https://github.com/heebaek200/study_room_reservation';
const studyAssets = 'https://raw.githubusercontent.com/heebaek200/study_room_reservation/42b3d827d467a3c968c21945e8baf4eaa333a289/docs/images/';

export const profile = {
  name: '이희백',
  role: '풀스택 웹 개발자',
  headline: '운영 경험을 바탕으로, 팀이 검증할 수 있게 개발합니다.',
  introduction: '일본 IT 기업에서 6년 6개월간 웹 애플리케이션을 개발하고 유지보수했습니다. 지금은 요구사항을 명세로 정리하고, AI를 활용해 구현한 결과를 리뷰와 테스트로 검증합니다.',
  github: 'https://github.com/heebaek200',
};

export const projects: Project[] = [
  {
    id: 'creature', title: '다 같이 키우는 생명체', period: '2026년 11월 · 약 3.5주',
    team: '4인 팀 · 팀장 겸 개발자', stack: 'Spring Boot · MySQL · Vite · WebSocket',
    summary: '구성원들이 퀘스트를 수행하고 공동 생명체를 성장시키는 웹 서비스입니다.',
    contribution: '팀의 공동 설계와 리뷰를 운영하고, 예약 작업 복구와 실시간 상태 동기화 설계에 참여했습니다.',
    outcome: '팀이 그룹·퀘스트·공동 성장과 테스트 환경의 구매·환불 흐름을 구현했습니다.',
    caseIds: ['workflow', 'contract', 'scheduler', 'websocket', 'integrity', 'qa'],
    video: { label: '생명체 성장 단계 시연', url: 'https://heebaek200.github.io/shared-creature-game/images/demos/21-creature-growth-showcase.mp4' },
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
    contribution: '팀 공동 설계와 리뷰를 진행하고, 동일 공간에서 예약이 겹치지 않도록 동시성 처리를 구현했습니다.',
    outcome: '팀 통합 테스트에서 같은 공간·시간대의 동시 요청 8건 중 1건이 성공했습니다.',
    caseIds: ['reservation'],
    image: { label: '스터디룸 예약 신청 화면 · 로컬 테스트', url: studyAssets + encodeURIComponent('3스터디룸 예약 신청 화면.png') },
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
    problem: '같은 계약이 여러 설계 문서에 반복되면 수정할 때 일부 내용이 남아 구현 기준이 달라질 수 있었습니다.',
    decision: '문서마다 책임을 정하고 기존 식별자를 유지했습니다. 다른 문서에서는 필요한 계약의 원본을 참조하도록 정리했습니다.',
    verification: '설계 리팩터링 PR에 변경 범위를 남겼습니다. 이후 API 단일 원본 적용은 개선 방향으로 남았습니다.',
    evidence: [{ label: '설계 문서 정리 PR #46', url: creature + '/pull/46' }],
  },
  {
    id: 'legacy', title: '레거시 CSV 처리 프로그램 재설계', summary: '약 1만 건의 CSV 처리 시간을 약 30초에서 약 3초로 줄였습니다.',
    problem: '기존 프로그램은 담당자 퇴사 후 유지보수가 어려웠고, 데이터에 따라 출력 품질 문제가 발생했습니다.',
    decision: '기존 출력 요구를 확인하고 팀에서 유지보수할 수 있는 PHP로 재구현했습니다. 중복 처리와 불필요한 데이터 변환을 줄였습니다.',
    verification: 'Excel 체크리스트로 기존 동작을 수동 검증했습니다. 시간은 CSV 처리 프로그램 기준입니다.', evidence: [],
  },
  {
    id: 'workflow', title: 'AI 구현을 팀이 검토할 수 있는 개발 절차', summary: '설계, 이슈, PR, 검증의 연결을 팀 작업 방식으로 정리했습니다.',
    problem: 'AI와 병렬로 작업할수록 요구사항의 최신 상태와 리뷰 대상을 놓치기 쉬웠습니다.',
    decision: '공동 설계와 공통 기반 작업을 분리하고, 팀이 이슈·칸반·리포트에서 작업과 완료 조건을 확인하게 했습니다.',
    verification: '공동 육성 프로젝트에는 초기화 도구와 AMALITE·SPEAR 절차를 적용했습니다. 슈타이어는 프로젝트 종료 뒤 다음 팀 프로젝트 준비 중 정립했습니다.',
    evidence: [{ label: '프로젝트 초기화 도구', url: 'https://github.com/heebaek200/github-project-bootstrapper' }],
  },
  {
    id: 'scheduler', title: '서버 재시작을 고려한 예약 작업', summary: '프로세스가 중단돼도 처리 대상을 다시 확인할 수 있도록 설계했습니다.',
    problem: '실행 시점을 메모리에만 의존하면 중단 중 만료된 작업을 놓칠 수 있었습니다.',
    decision: '저장된 상태를 기준으로 복구 대상을 확인하고 예약 작업과 정리 작업의 영향을 분리해 검토했습니다.',
    verification: '관련 PR에서 복구와 경합 조건을 검토했습니다. 실제 다중 서버 운영은 검증 범위 밖입니다.',
    evidence: [
      { label: '재시작 정책 결정', url: creature + '/issues/24#issuecomment-6653782943' },
      { label: '스케줄러 QA 기록', url: creature + '/blob/main/docs/test-results/QA-02-rewards-scheduler.md' },
    ],
  },
  {
    id: 'websocket', title: 'WebSocket 재연결과 상태 복구', summary: '재접속 시 서버의 현재 상태를 다시 확인하는 흐름을 구성했습니다.',
    problem: '연결이 끊긴 동안 발생한 이벤트를 클라이언트가 놓칠 수 있었습니다.',
    decision: 'REST 스냅샷으로 현재 상태를 확인하고 WebSocket 이벤트로 이후 변경을 받는 방식을 사용했습니다.',
    verification: '팀 QA에서 연결 장애 중 REST 조회를 확인했습니다. 자동 재연결과 조회 중단은 후속 검증이 필요한 항목입니다.',
    evidence: [{ label: 'WebSocket PR #90', url: creature + '/pull/90' }, { label: '팀 QA 기록', url: creature + '/tree/main/docs/test-results' }],
  },
  {
    id: 'integrity', title: '그룹 가입과 테스트 결제의 데이터 정합성', summary: '동시 가입과 결제 재시도에서 팀이 지켜야 할 조건을 확인했습니다.',
    problem: '가입이 동시에 처리되면 그룹 정원을 넘길 수 있고, 결제 알림이 중복되면 아이템을 두 번 지급할 수 있었습니다.',
    decision: '팀은 정원 변경과 활성 소속을 제약으로 보호하고, 결제 완료를 서버에서 확인한 뒤 지급하도록 구현했습니다.',
    verification: 'MySQL 가입 동시성 테스트와 테스트 PG QA 기록을 남겼습니다. 환불 처리는 팀원이 구현했으며 QA는 테스트 PG 환경에서 진행했습니다.',
    evidence: [
      { label: '그룹 가입 PR #45', url: creature + '/pull/45' },
      { label: '테스트 PG QA', url: creature + '/blob/main/docs/test-results/QA-03-payment-refund.md' },
    ],
  },
  {
    id: 'qa', title: '부화 전 퀘스트 완료 오류 대응', summary: 'QA에서 발견한 409 오류를 그룹 상태와 시즌 규칙을 분리해 수정했습니다.',
    problem: '시즌이 활성화됐어도 그룹이 부화 준비 중이면 마감 전 퀘스트 완료 요청이 차단됐습니다.',
    decision: '그룹 상태와 시즌 기간을 따로 검증하고, 화면에서 서버의 오류 사유를 보여주도록 수정했습니다.',
    verification: '수정 PR이 병합됐습니다. 수정 후 동일 브라우저 시나리오의 재검증 기록은 확인되지 않았습니다.',
    evidence: [{ label: 'QA 이슈 #135', url: creature + '/issues/135' }, { label: '수정 PR #137', url: creature + '/pull/137' }],
  },
  {
    id: 'reservation', title: '같은 스터디룸의 동시 예약 제어', summary: '동일 공간의 잠금과 시간 겹침 재검사를 한 트랜잭션으로 묶었습니다.',
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
