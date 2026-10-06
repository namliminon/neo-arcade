import { describe, it, expect, beforeEach } from 'vitest';
import { dataAdapter } from '../lib/store/data-adapter';

describe('Admin Management Operations', () => {
  beforeEach(() => {
    dataAdapter.resetMockState();
  });

  it('updates ban status and ban reason on user', async () => {
    const user = await dataAdapter.register('player1', 'p1@arcade.dev', 'Pass1234');
    expect(user.user).toBeDefined();

    const updated = await dataAdapter.setUserBanStatus(user.user!.id, true, 'Ngôn từ xúc phạm');
    expect(updated.is_banned).toBe(true);
    expect(updated.ban_reason).toBe('Ngôn từ xúc phạm');

    const unbanned = await dataAdapter.setUserBanStatus(user.user!.id, false);
    expect(unbanned.is_banned).toBe(false);
    expect(unbanned.ban_reason).toBe('');
  });

  it('retrieves all users for the admin table', async () => {
    const all = await dataAdapter.getAllUsers();
    expect(all.length).toBeGreaterThanOrEqual(4);
    expect(all.some(u => u.role === 'admin')).toBe(true);
  });
});
