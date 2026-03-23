export const Key: Record<string, string[]> = {
  Left: ['KeyA', 'ArrowLeft'],
  Right: ['KeyD', 'ArrowRight'],
};

export type KeyAction = keyof typeof Key;

const Keys = new Map<KeyAction, boolean>();

export const getKeyPress = (key: KeyAction): boolean => {
  const pressed = Keys.get(key);
  Keys.set(key, false);
  return pressed || false;
};

const handleKeydown = (e: KeyboardEvent) => {
  const entry = Object.entries(Key).find(([, codes]) => codes.includes(e.code));
  if (!entry) return;
  Keys.set(entry[0] as KeyAction, true);
};

export const initBinds = (): void => {
  window.addEventListener('keydown', handleKeydown);
};

export const destroyBinds = (): void => {
  window.removeEventListener('keydown', handleKeydown);
};
