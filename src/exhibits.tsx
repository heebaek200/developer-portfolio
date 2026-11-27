import { useId, useRef, useState } from 'react';
import type { Capture, Diagram } from './casebook';
import './exhibits.css';

/** Vite 정적 자산을 루트와 GitHub Pages 하위 경로에서 동일하게 찾는다. */
export function mediaPath(key: string, extension = 'webp') {
  return './evidence/' + key + '.' + extension;
}

/** 정지 프레임은 본문에 유지하고 확대 또는 시연은 요청 시에만 연다. */
function Exhibit({ item }: { item: Capture }) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [motionFailed, setMotionFailed] = useState(false);
  const imageSource = mediaPath(item.key, item.extension);

  function show() {
    setMotionFailed(false);
    setOpen(true);
    dialog.current?.showModal();
  }

  return <figure className="exhibit">
    {failed
      ? <p className="exhibit-unavailable" role="status">캡처를 불러오지 못했습니다.</p>
      : <button type="button" className="exhibit-trigger" ref={trigger} onClick={show} aria-label={item.label + (item.motion ? ' 시연 보기' : ' 이미지 확대')}>
        <img loading="lazy" decoding="async" src={imageSource} alt={item.label} onError={() => setFailed(true)} />
        <span className="exhibit-action" aria-hidden="true">{item.motion ? '시연 보기' : '이미지 확대'}</span>
      </button>}
    <figcaption><strong>{item.label}</strong><span>{item.caption}</span> <a href={item.source}>원본</a></figcaption>
    <dialog ref={dialog} className="exhibit-dialog" aria-labelledby={titleId} onClose={() => {
      setOpen(false);
      trigger.current?.focus();
    }}>
      <header><h2 id={titleId}>{item.label}</h2><form method="dialog"><button>닫기</button></form></header>
      {open && (item.motion
        ? motionFailed ? <p role="status">시연을 재생할 수 없습니다. <a href={item.source}>원본 보기</a></p>
          : <video controls playsInline preload="metadata" poster={imageSource} src={mediaPath(item.key, 'mp4')} aria-label={item.label + ' 녹화 화면'} onError={() => setMotionFailed(true)} />
        : <img src={imageSource} alt={item.label} />)}
    </dialog>
  </figure>;
}

/** 시연과 관리 증빙을 원본 출처와 함께 전시한다. */
export function Gallery({ items, kind = 'features' }: { items: Capture[]; kind?: 'features' | 'records' | 'setup' }) {
  return <div className="exhibit-grid" data-gallery={kind}>{items.map((item) => <Exhibit key={item.key} item={item} />)}</div>;
}

/** 성장 전체 영상은 선택한 시점에 로드하며 원본 링크를 유지한다. */
export function GrowthFilm() {
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);
  return <figure className="growth-film">
    {active
      ? failed ? <p role="status">영상을 불러오지 못했습니다.</p>
        : <video controls playsInline preload="metadata" poster={mediaPath('creature-showcase')} src={mediaPath('creature-showcase', 'mp4')} aria-label="생명체 성장 전체 시연" onError={() => setFailed(true)} />
      : <button type="button" className="film-trigger" onClick={() => setActive(true)}>
        <img loading="lazy" src={mediaPath('creature-showcase')} alt="세 종류의 크리처를 성장 단계별로 비교하는 팀의 시연 화면" />
        <span>성장 영상 열기</span>
      </button>}
    <figcaption>크리처 성장 단계 비교를 위해 팀이 제작한 시연 영상 · <a href="https://heebaek200.github.io/shared-creature-game/images/demos/21-creature-growth-showcase.mp4">원본 보기</a></figcaption>
  </figure>;
}

/** 순서·동시성·대안 비교를 실제 글자로 렌더링해 확대와 인쇄를 지원한다. */
export function DecisionDiagram({ diagram }: { diagram: Diagram }) {
  const caption = useId();
  const rowCount = Math.max(...diagram.columns.map(({ steps }) => steps.length));
  return <figure className="decision-diagram" data-kind={diagram.kind} aria-labelledby={caption}>
    <figcaption id={caption}>{diagram.title}</figcaption>
    {diagram.kind === 'lanes'
      ? <div className="table-scroll"><table className="sequence-table">
        <thead><tr>{diagram.columns.map((column) => <th key={column.label} scope="col">{column.label}</th>)}</tr></thead>
        <tbody>{Array.from({ length: rowCount }, (_, index) => <tr key={index}>
          {diagram.columns.map((column) => <td key={column.label}>{column.steps[index] ?? '—'}</td>)}
        </tr>)}</tbody>
      </table></div>
      : <ul className="decision-columns">{diagram.columns.map((column) => <li key={column.label}>
        <strong>{column.label}</strong>
        <ol>{column.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      </li>)}</ul>}
  </figure>;
}
