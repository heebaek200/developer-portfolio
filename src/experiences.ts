import { cases as originalCases, type Case } from './content';

interface ExperienceGroup {
  id: string;
  title: string;
  summary: string;
  items: Case[];
}

const legacy = originalCases.find(({ id }) => id === 'legacy')!;
const workflow = originalCases.find(({ id }) => id === 'workflow')!;

export const experiences: ExperienceGroup[] = [
  {
    id: 'professional', title: '현업 개발', summary: '업무 시스템을 만들고 운영하면서 성능, 반복 구현, 데이터 경계를 개선했습니다.',
    items: [
      {
        ...legacy,
        decision: '남은 팀원이 유지할 수 있도록 출력 요구와 기존 입출력 형식을 정리하고, PHP로 다시 구현했습니다. 중복 처리와 불필요한 변환을 줄였습니다.',
        verification: 'Excel 체크리스트로 기존 동작을 수동 확인했습니다. 약 1만 건의 CSV 처리 프로그램에 대한 비교이며, Excel 출력 전체 응답 시간과는 범위가 다릅니다.',
      },
      {
        id: 'metadata-core', title: '메타데이터 기반 업무 화면 공통화', outlineTitle: '화면마다 검증을 다시 짤까?',
        summary: '반복되는 업무 화면이 DB 정의를 공통으로 참조하도록 구성했습니다.',
        problem: '비슷한 입력 규칙과 오류 메시지를 화면마다 작성하면 변경이 빠지고 검증 방식이 달라졌습니다.',
        decision: '서버 검증과 화면 필드가 메타데이터를 참조하게 하고 관리 GUI를 만들었습니다. 고객별 변경을 상속에 맡겼을 때는 공통 변경이 전파되지 않는 한계를 경험했습니다.',
        verification: '공통 기반 구축과 운영 경험에 해당합니다. 반복 작업 감소율을 수치로 제시할 자료는 없습니다.', evidence: [],
      },
      {
        id: 'lunch-order', title: '출근 흐름에 연결한 사내 도시락 신청', outlineTitle: '출근 기록에서 도시락까지',
        summary: '이미 쓰고 있던 타임카드에 신청을 붙이고 당일 집계와 전달을 연결했습니다.',
        problem: '직원이 신청하고 담당자가 수량을 확인해 업체에 전달하는 과정이 나뉘어 있었습니다.',
        decision: '기존 타임카드에 신청·취소를 붙이고 PHP·PostgreSQL로 집계해 태블릿에 표시했습니다. 정해진 시각에는 업체 전달 흐름으로 연결했습니다.',
        verification: '사옥 직원과 제가 실제로 사용했습니다. 사용자 수나 절감 시간은 수치화하지 않았습니다.', evidence: [],
      },
      {
        id: 'tenant-boundary', title: '공유 DB에서 고객사 데이터 경계 보호', outlineTitle: '고객사 경계는 어디서 지킬까?',
        summary: '개별 조회마다 조건을 기억해야 하는 구조에서 데이터 격리 검증을 보강했습니다.',
        problem: '고객사별 데이터가 한 시스템에 있어 조회 로직마다 범위를 일관되게 적용해야 했습니다.',
        decision: '고객사별 조회 조건을 검증하고, 후속 Laravel 버전에서는 공통 조회 조건으로 반복 누락 위험을 줄이는 방향을 취했습니다.',
        verification: '현업 유지보수와 후속 개선 방향입니다. 전체 경로의 적용이나 개인 단독 구현으로 범위를 확대하지 않습니다.', evidence: [],
      },
    ],
  },
  {
    id: 'productivity', title: '개발 생산성', summary: '저장소 초기화, 팀 규칙과 AI 활용, 리뷰 병목을 하나의 개발 흐름으로 다뤘습니다.',
    items: [
      {
        id: 'bootstrapper', title: '팀 GitHub 환경 초기화 자동화', outlineTitle: '새 프로젝트, 환경부터 자동화',
        summary: '반복되는 협업 환경 설정을 팀이 다시 사용할 수 있는 도구로 만들었습니다.',
        problem: '저장소, Wiki, 프로젝트 보드, Ruleset을 따로 구성하면 시간이 들고 설정이 어긋날 수 있었습니다.',
        decision: '협업 공간 설정과 선택적인 기본 프로젝트 생성을 두 단계로 구성하고, 팀이 생성 결과와 수동 작업 항목을 확인할 수 있게 했습니다.',
        verification: '공개 저장소와 GUI 사용 흐름으로 구현 내용을 확인할 수 있습니다. 작업 시간 절감량은 별도로 측정하지 않았습니다.',
        evidence: [{ label: 'GitHub Project Bootstrapper', url: 'https://github.com/heebaek200/github-project-bootstrapper' }],
      },
      { ...workflow, verification: '공동 육성 당시 초기화 도구와 AMALITE·SPEAR를 적용했습니다. 이슈 단위 명세·구현·리뷰를 다루는 STEYR는 다음 팀 프로젝트 준비 중 새로 정립했습니다.' },
      {
        id: 'review-bottleneck', title: 'AI 병렬 개발의 코드 리뷰 병목', outlineTitle: '코드는 빨라졌는데 리뷰는?',
        summary: '구현을 병렬화하면서 검토가 새 병목이 되는 상황을 다뤘습니다.',
        problem: '여러 작업이 동시에 끝나면 결과의 맥락을 복원하고 리뷰할 시간이 오히려 부족해졌습니다.',
        decision: '팀 PR을 우선 검토하고 진행이 끊기는 지점은 짧은 체크리스트로 남겼습니다. 팀 내 리뷰 분산은 후속 개선 방향으로 잡았습니다.',
        verification: '팀 운영에서 사용한 대응입니다. 리뷰 처리량 개선율을 별도로 측정하지 않았습니다.', evidence: [],
      },
    ],
  },
  {
    id: 'product-data', title: '제품·데이터', summary: '콘텐츠 운영에서 사용자 반응을 읽고 데이터를 활용해 제작 우선순위를 바꿨습니다.',
    items: [
      {
        id: 'channel-discovery', title: '채널 비교로 사용자 관심 파악', outlineTitle: '사람들은 무엇을 눌렀나?',
        summary: '약 200개 채널의 제목·썸네일·조회수 흐름을 비교했습니다.',
        problem: '관심이 높은 소재를 감각만으로 고르면 선택 과정을 재현하기 어려웠습니다.',
        decision: '여러 채널의 주제, 제목, 썸네일과 사용자 반응을 기록해 소재 후보를 비교했습니다.',
        verification: '콘텐츠 선별에 사용한 관찰 방식입니다. 조회수 변화를 해당 작업의 단독 효과로 해석하지 않습니다.', evidence: [],
      },
      {
        id: 'production-discovery', title: '데이터 도구로 제작 탐색 범위 줄이기', outlineTitle: '영상 전체를 볼 필요가 있을까?',
        summary: '반응이 집중된 구간을 먼저 찾고 사람이 실제 영상을 확인했습니다.',
        problem: '긴 영상과 채팅을 처음부터 확인하면 편집할 장면을 찾는 시간이 길었습니다.',
        decision: '공개 Python 채팅 분석 도구로 후보 구간을 좁히고, Google Sheets와 SQLite로 자료를 정리했습니다.',
        verification: '기존 도구를 제작 흐름에 결합한 경험입니다. 해당 분석 도구 자체를 개발한 것으로 표시하지 않습니다.', evidence: [],
      },
      {
        id: 'resource-allocation', title: '콘텐츠 성과 부진 후 제작 우선순위 재조정', outlineTitle: '공들인 영상이 안 됐을 때',
        summary: '제작 시간을 다시 배분하고 소재와 편집 방식을 조정했습니다.',
        problem: '제작에 오래 걸린 영상이 예상만큼 반응을 얻지 못했습니다.',
        decision: '기존 사용자 반응을 다시 보고 소재를 고른 뒤, 편집과 썸네일에 쓰는 시간을 조정했습니다.',
        verification: '사용자 반응을 바탕으로 제작 우선순위를 바꾼 사례입니다. 외부 검증이 없는 성과 수치는 사용하지 않았습니다.', evidence: [],
      },
    ],
  },
];
