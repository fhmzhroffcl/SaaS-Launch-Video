import { Message } from '../chat/types';
import { DuoChatData } from '../duo/DuoChat';
import { me, maia, p, c, e, L, GAP } from './helpers';
import { scene1Chat } from './scene1';
import { scene2aChat, scene2bChat } from './scene2';
import { scene3Chat } from './scene3';
import { scene4Chat } from './scene4';

// Earlier messages from the same story are placed above each scene's own conversation so every screen is
// filled like a real scrolled chat (the list is bottom-anchored; the header naturally cuts the oldest bubble).
const cont = (msgs: Message[], prefix: string, firstGap = GAP): Message[] => msgs.map((m, i) => ({ ...m, id: prefix + i, ...(i === 0 ? { gapBefore: firstGap } : {}) }));
// firstGap nudges where the header cuts the oldest bubble so no text line is sliced in half.
const withHistory = (chat: DuoChatData, history: Message[], prefix: string, firstGap = GAP): DuoChatData => ({
  ...chat,
  messages: [...history.map((m, i) => ({ ...m, id: prefix + 'h' + i })), ...cont(chat.messages, prefix, firstGap)],
});

// Between scene 2 and scene 3 the admin confirms the rev 2 order.
const confirm: Message[] = [
  me('09:33', [p('ok confirm')], { tail: true, gapBefore: GAP }),
  maia('09:33', [p(L(e('✅'), ' ', c('SO-2026-00312'), ' (rev 2) confirmed.'), 'Synced to SQL Account.', 'Next: arrange delivery?')], { tail: true, gapBefore: GAP }),
];

export const scene2aFull = withHistory(scene2aChat, scene1Chat.messages, 's2a');
export const scene2bFull = withHistory(scene2bChat, scene2aFull.messages, 's2b', 26);
export const scene3Full = withHistory(scene3Chat, [...scene2bFull.messages, ...confirm], 's3');
export const scene4Full = withHistory(scene4Chat, scene3Full.messages, 's4');
