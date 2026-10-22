// 목록형 콘텐츠의 공개 조회 (CNT-R02). 03~08 페이지는 getCollection 대신 이것을 쓴다.
import { getCollection } from 'astro:content';
import { isPublic } from './content-filter';

type ListCollection = 'work' | 'lab' | 'encyclopedia' | 'writing';

export function getPublished<C extends ListCollection>(collection: C) {
  return getCollection(collection, (entry) => isPublic(entry, import.meta.env.PROD));
}
