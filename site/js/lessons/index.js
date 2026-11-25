const CACHE = new Map();

export async function getSubjectLessons(subjectId) {
  if (CACHE.has(subjectId)) return CACHE.get(subjectId);
  try {
    const mod = await import(`./${subjectId}.js`);
    const list = Array.isArray(mod.default) ? mod.default : [];
    CACHE.set(subjectId, list);
    return list;
  } catch (err) {
    console.warn('[Ulduz Lessons] failed to load', subjectId, err);
    return [];
  }
}

export async function findTopicLesson(subjectId, topicName) {
  const list = await getSubjectLessons(subjectId);
  if (!list.length) return null;
  if (!topicName) return list[0];
  const exact = list.find((l) => l.topic === topicName);
  if (exact) return exact;
  const low = String(topicName).toLowerCase();
  const partial = list.find((l) => l.topic.toLowerCase().includes(low) || low.includes(l.topic.toLowerCase()));
  return partial || list[0];
}
