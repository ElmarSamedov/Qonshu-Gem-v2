export const getDeterministicChatId = (uid1: string, uid2: string) => {
  const clean = (id: string) => id.replace(/^(neighbor-seller-|neighbor-|business-|seller-)/, '');
  return [clean(uid1), clean(uid2)].sort().join('_');
};
