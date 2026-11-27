import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cases, projects } from '../src/content.ts';

test('프로젝트·사례 ID는 고유하고 상세 경로에 사용할 수 있다', () => {
  for (const entries of [projects, cases]) {
    const ids = entries.map(({ id }) => id);
    assert.equal(new Set(ids).size, ids.length);
    for (const id of ids) assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
});

test('공개 근거는 HTTPS와 설명을 사용한다', () => {
  for (const entry of [...projects, ...cases]) {
    for (const item of entry.evidence) {
      assert.equal(new URL(item.url).protocol, 'https:');
      assert.ok(item.label.trim());
    }
  }
});
