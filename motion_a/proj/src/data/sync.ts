import { SyncCardData } from '../web/SyncCard';
import { STORY } from './story';
export const syncCard: SyncCardData = {
  title: 'INVOICE SYNC',
  number: STORY.inv,
  tag: 'Rev 2',
  customer: 'Restoran Selera Kampung',
  sub: 'RM 3,053.90 · SO-2026-00312',
  targets: [
    { name: 'SQL Account', mark: 'SQL', status: 'Synced' },
    { name: 'AutoCount', mark: 'AC', status: 'Synced' },
  ],
  noteLabel: 'BILLING ADDRESS UPDATED',
  note: 'HQ · Bandar Puchong Jaya',
  pill: 'Synced · 10:08 AM',
};
