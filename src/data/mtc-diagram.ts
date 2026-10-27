// 16-case-diagrams (DGM-R03): Meet the Character 작동 구조도 데이터. 문구·숫자는 사이트 주인 포트폴리오 Artifact 원문
// (docs/specs/16-case-diagrams/source.md, tests/unit/diagram-sources.test.ts가 검사). 노드 좌표는 SystemDiagram.astro에 있다.
import { z } from 'astro/zod';

const text = z.string().min(1);
const nodeId = z.enum(['greet', 'speak', 'judge', 'childmem', 'world', 'skip', 'answer', 'react', 'farewell', 'analysis', 'extract', 'report']);
const pinId = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);

const schema = z
  .object({
    nodes: z.record(
      nodeId,
      z
        .object({
          stage: text,
          lane: text,
          title: text,
          does: text,
          input: text,
          output: text,
          next: text,
          pins: z.array(pinId).optional(),
          prompt: text.optional(),
        })
        .strict(),
    ),
    order: z.array(nodeId).length(12),
    decisions: z.array(z.object({ id: pinId, title: text, short: text, detail: text, node: nodeId }).strict()).length(5),
    examples: z
      .array(
        z
          .object({
            id: z.number().int().min(1).max(4),
            nodes: z.array(nodeId).min(1),
            heading: text,
            bubbles: z.array(z.object({ who: text, line: text, coco: z.boolean() }).strict()),
            note: text,
          })
          .strict(),
      )
      .length(4),
  })
  .strict();

export type MtcDiagram = z.infer<typeof schema>;
export type MtcNodeId = z.infer<typeof nodeId>;

export const mtcDiagram: MtcDiagram = schema.parse({
  nodes: {
    greet: { stage: '대화 시작', lane: '프롬프트', title: '먼저 인사', does: 'Coco가 먼저 인사하고 쉬운 질문 하나를 던져 대화를 엽니다.', input: 'Coco 페르소나 · 세계관 · 아이 수준', output: '인사 문장 (표정은 Surprised로 고정)', next: '→ 아이 차례 시작', prompt: 'AI_CHAT_GREETING' },
    speak: { stage: '대화 중 · 아이 차례마다', lane: '화면', title: '아이가 말함', does: '아이가 음성으로 말합니다. 이 말이 매 턴 판단의 출발점입니다.', input: '아이 음성', output: '아이가 한 말', next: '→ 기억이 필요한가?' },
    judge: {
      stage: '대화 중 · 아이 차례마다',
      lane: '프롬프트',
      title: '기억이 필요한가?',
      does: '아이가 말할 때마다, 대답 전에 기억을 찾아야 하는지 먼저 판단합니다. 취향 · 지난 이야기 · 가족/학교는 아이 기억에서, 캐릭터 · 마을 질문은 세계관에서 찾고, 맞장구 · 인사 · 작별은 검색 없이 바로 대답합니다.',
      input: '아이가 방금 한 말',
      output: '필요 여부 · 이유 한 문장 · 검색 문장 1개',
      next: '→ 아이 기억 / 세계관 검색 → 대답 생성',
      pins: [1, 4],
      prompt: 'RAG_JUDGE',
    },
    childmem: {
      stage: '저장소',
      lane: '저장소',
      title: '아이 기억',
      does: '대화에서 알게 된 내용을 아이별로 나눠 저장합니다. 아이 ID 조건 없이는 검색되지 않아, 다른 아이의 기억이 섞이지 않습니다.',
      input: '대화 후 정리된 기억',
      output: '다음 대화에서 그 아이의 기억만 (비슷한 기억 상위 3개 중 가장 가까운 1개)',
      next: '→ 다음 대화 · 다른 책에서도 → 기억이 필요한가?',
      pins: [2],
    },
    world: { stage: '저장소', lane: '저장소', title: '캐릭터 · 세계관 설정', does: '캐릭터별 정체성 · 배경 · 가족 · 성격과 마을 설정입니다. 모든 아이에게 공통입니다.', input: 'Harmony Hills 세계관 문서', output: '캐릭터 · 마을 질문에 필요한 설정', next: '→ 대답 생성' },
    skip: { stage: '대화 중 · 아이 차례마다', lane: '판단 결과', title: '검색 없이 바로', does: '맞장구 · 인사 · 작별처럼 기억이 필요 없는 말에는 검색을 건너뛰고 바로 대답합니다. 매 턴 검색하면 응답이 느려지고 비용이 늘기 때문입니다.', input: '아이가 방금 한 말', output: '—', next: '→ 대답 생성', pins: [1] },
    answer: { stage: '대화 중 · 아이 차례마다', lane: '프롬프트', title: '대답 생성', does: '공감하고 꼬리질문으로 대화를 이어 갑니다. 아이가 틀려도 대화 중에는 직접 고치지 않습니다.', input: '아이 말 · 찾은 기억 1개 · Coco 페르소나 · 세계관 · 아이 수준', output: '대답 문장 + 감정 1개 (Interested · Understand · Wonderful · Sad · Funny 중)', next: '→ 표정 · 목소리', prompt: 'AI_CHAT_CONVERSATION · Gemini 3 Flash' },
    react: { stage: '대화 중 · 아이 차례마다', lane: '화면', title: '표정 · 목소리', does: '앱이 감정 값으로 Coco의 표정을 바꾸고, 음성의 발음 단위에 입 모양을 맞춥니다. 캐릭터 상태는 입력 대기 → 응답 분석 → 감정 선택 → 말하기 → 다시 입력 대기로 돕니다.', input: '대답 문장 + 감정 1개', output: '표정 6가지 중 하나 · 립싱크 음성', next: '→ 다시 아이 차례', prompt: '앱 · Rive State Machine · Viseme 립싱크' },
    farewell: { stage: '대화 끝', lane: '프롬프트', title: '작별 인사', does: '오늘 나눈 이야기를 짚으며 작별합니다. 아이의 마지막 말에는 짧게 답합니다.', input: '오늘 대화', output: '작별 문장 + 감정 1개', next: '→ 대화 후 분석 · 기억 정리', prompt: 'AI_CHAT_FAREWELL · AI_CHAT_END' },
    analysis: { stage: '대화 후', lane: '프롬프트', title: '대화 유형 분석', does: '아이의 대화 방식을 8가지 유형으로 나누고, 유형마다 Coco의 감정 2개를 연결해 점수 대신 “Coco가 이렇게 느꼈다”로 돌려줍니다.', input: '대화 기록', output: '대화 유형 · Coco 감정 · 피드백 · 표현 팁', next: '→ 관계 리포트', prompt: 'DIALOGUE_ANALYSIS' },
    extract: { stage: '대화 후', lane: '프롬프트', title: '기억 정리', does: '새로 알게 된 내용을 바로 저장하지 않고, 비슷한 기존 기억을 먼저 찾아 추가 · 수정 · 유지 중 하나로 정리합니다. 같은 이야기를 반복해도 기억이 중복되지 않습니다.', input: '대화 기록 · 비슷한 기존 기억', output: '기억별 결정 + 이유, 선호 · 기분 꼬리표', next: '→ 아이 기억 저장 · 리포트 Remember me!', pins: [3], prompt: 'RAG_SEARCH → RAG_EXTRACTION' },
    report: { stage: '대화 후', lane: '화면', title: '관계 리포트', does: 'Coco의 감정 변화 · 피드백 · Remember me!를 보여 줍니다. 아이는 Coco가 무엇을 기억했는지 직접 확인하고 지울 수 있습니다.', input: '분석 결과 · 아이 기억', output: '관계 리포트 (Buddy Report)', next: '→ 아이 · 부모가 확인', pins: [5] },
  },
  order: ['greet', 'speak', 'judge', 'childmem', 'world', 'skip', 'answer', 'react', 'farewell', 'analysis', 'extract', 'report'],
  decisions: [
    { id: 1, title: '검색하기 전에, 검색이 필요한지부터 판단했습니다.', short: '검색하기 전에, 검색이 필요한지부터 판단', detail: '매 턴 기억을 찾으면 응답이 느려지고 비용이 늘어납니다. 판단 2,017회.', node: 'judge' },
    { id: 2, title: '기억 검색 범위를 항상 그 아이 본인으로 제한했습니다.', short: '검색 범위는 항상 그 아이 본인', detail: '아이 기억과 캐릭터 · 세계관 설정을 다른 저장소로 나눴습니다. 다른 아이 기억 사용 0건 / 665건.', node: 'childmem' },
    { id: 3, title: '기억을 바로 저장하지 않고, 기존 기억과 비교해 정리했습니다.', short: '바로 저장하지 않고 비교해 정리', detail: '추가 · 수정 · 유지 중 하나를 골라 같은 이야기가 중복되지 않게 했습니다. 아이 116명(79%)에게 기억 353개.', node: 'extract' },
    { id: 4, title: '판단마다 이유를 한 문장씩 남기게 했습니다.', short: '판단마다 이유 한 문장 기록', detail: '이 기록으로 헛검색 29% · 관련성 낮은 기억 18%를 찾았습니다.', node: 'judge' },
    { id: 5, title: '점수 대신 관계로 돌려주고, 기억은 아이가 직접 관리하게 했습니다.', short: '점수 대신 관계로, 기억은 아이가 관리', detail: 'Coco가 무엇을 기억했는지 리포트에 공개하고 아이가 지울 수 있게 해, 아동 서비스에서 ‘기억하는 AI’의 불안을 설계로 풀었습니다.', node: 'report' },
  ],
  examples: [
    { id: 1, nodes: ['speak'], heading: '활동 A · 책 「Cody and the Box」', bubbles: [{ who: '아이', line: "Ellie is a small dog, but she's smart. She plays soccer with me.", coco: false }], note: '아이가 자기 강아지 이야기를 꺼냅니다.' },
    { id: 2, nodes: ['extract', 'childmem'], heading: '활동 A가 끝난 뒤', bubbles: [], note: '대화가 끝나면 “강아지 이름은 Ellie”가 기억으로 정리되어 그 아이의 기억에 저장됩니다.' },
    { id: 3, nodes: ['speak', 'judge', 'childmem'], heading: '활동 B · 다른 책 「Slide!」', bubbles: [{ who: '아이', line: 'Do you remember my dog\'s name?', coco: false }], note: '지난 이야기를 묻는 말이라, 판단 단계가 그 아이의 기억을 검색합니다.' },
    { id: 4, nodes: ['answer', 'react'], heading: '활동 B · 다른 책 「Slide!」', bubbles: [{ who: 'Coco', line: "Yes! Your dog's name is Ellie.", coco: true }], note: '찾은 기억을 넣어 Coco의 말투로 대답합니다.' },
  ],
});
