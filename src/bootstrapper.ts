import type { Capture, Diagram } from './casebook';
import type { Evidence } from './content';

const repository = 'https://github.com/heebaek200/github-project-bootstrapper';

/** 개인 도구의 목록, 상세, 인쇄에 공통으로 쓰는 개요. */
export const bootstrapper = {
  id: 'bootstrapper',
  title: 'GitHub Project Bootstrapper',
  period: '2026년 9월 최초 공개',
  team: '개인 프로젝트 · 기획·설계·검증',
  stack: 'Windows PowerShell 5.1 · WPF · GitHub CLI',
  summary: '저장소, Wiki, Projects와 팀원 권한을 같은 기준으로 준비하는 Windows GUI 도구입니다.',
};

export const bootstrapperSteps = [
  ['실행 전 확인', 'Git·gh 설치와 활성 계정, Projects 접근 권한과 템플릿을 확인합니다. VBS 실행 파일에서 WPF GUI를 엽니다.'],
  ['저장소 만들기', '개인 계정에 공개 저장소를 준비하고 기본 파일·설계 초안·Ruleset·Pages를 구성합니다. Spring Boot가 필요하면 Initializr에서 Java 21·Gradle 기반을 만들어 로컬 H2와 개발 MySQL 설정 예시를 준비합니다.'],
  ['Wiki Home 수동 생성', 'GitHub에서 Home을 한 번 만들면 Wiki Git 저장소가 생깁니다. 이 지점을 기준으로 자동화 단계를 나눴습니다.'],
  ['협업 환경 구성', 'Wiki 템플릿, Discussions, Projects의 상태·라벨·날짜·보기와 선택한 팀원의 쓰기 권한을 구성합니다.'],
  ['팀에서 마무리', '필요하면 Project 설정에서 기본 저장소를 직접 지정합니다. Discussions 카테고리와 첫 일일 리포트는 팀이 준비합니다.'],
];

export const bootstrapperDecisions = [
  ['UTF-8 JSON', 'Windows PowerShell 5.1에서 출력 인코딩과 JSON 해석이 어긋나는 문제를 확인했습니다. 필요한 값은 gh --jq로 추출하고 입출력 인코딩을 맞췄습니다.'],
  ['GraphQL 응답 확인', '보기 삭제 응답에 가정했던 필드가 없었습니다. 반환 스키마를 확인해 projectV2View의 id를 받도록 바꾸고 삭제 결과를 확인했습니다.'],
  ['Project 보기 교체 순서', '기존 보기를 먼저 삭제하면 신규 보기를 못 만들었을 때 작업 환경을 잃을 수 있습니다. 새 보기를 먼저 만들고 확인한 뒤 기존 보기를 제거하고 이름을 정리하도록 설계했습니다.'],
  ['활성 계정과 실행 기록', '실행할 계정은 gh에서 확인합니다. 인증값을 코드에 고정하지 않고 로컬 상태·실행 로그는 Git에서 제외합니다.'],
];

export const bootstrapperArchitecture: Diagram = {
  title: 'Windows GUI에서 GitHub 설정까지',
  kind: 'timeline',
  columns: [
    { label: '입력과 확인', steps: ['VBS로 시작', 'WPF GUI에서 대상 저장소·Project와 활성 계정 확인'] },
    { label: '로컬 구성', steps: ['PowerShell이 템플릿과 Git 작업 관리', '선택 시 Spring Initializr 호출'] },
    { label: 'GitHub 설정', steps: ['gh CLI로 REST·GraphQL 요청', '저장소 정책과 협업 환경 구성'] },
  ],
};

export const bootstrapperNotes: Capture[] = [
  { key: 'bootstrapper-source-list', extension: 'png', label: '초기 팀 개발 자료 목록', caption: '프로젝트 시작 절차, 개발 컨벤션과 설계 점검 항목을 따로 정리했습니다.' },
  { key: 'bootstrapper-design-notes', extension: 'png', label: '팀 개발 절차의 초기 메모', caption: '환경 준비, 공동 설계, 공통 개발, 업무 분담을 잇는 팀 작업 절차의 초안입니다.' },
];

export const bootstrapperProof: Evidence[] = [
  { label: 'Bootstrapper 사용법과 소스', url: repository },
  { label: 'PowerShell 실행 코드', url: repository + '/blob/main/TeamProjectStarter.ps1' },
  { label: '생성되는 Wiki 템플릿', url: repository + '/tree/main/wiki' },
  { label: '팀 코드 컨벤션 템플릿', url: repository + '/blob/main/templates/convention.md' },
  { label: '최초 공개 커밋', url: repository + '/commit/217c0a1' },
  { label: 'Spring Boot 초기화 확장', url: repository + '/commit/045b57e' },
];
