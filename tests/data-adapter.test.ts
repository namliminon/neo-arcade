import { describe, it, expect, beforeEach } from 'vitest';
import { dataAdapter } from '../lib/store/data-adapter';

describe('Data Adapter & Auth System', () => {
  beforeEach(() => {
    dataAdapter.resetMockState();
  });

  it('allows default admin login', async () => {
    const res = await dataAdapter.login('admin@arcade.dev', 'Admin@123456');
    expect(res.user?.role).toBe('admin');
    expect(res.user?.username).toBe('admin');
  });

  it('registers new user and gives starter coins', async () => {
    const reg = await dataAdapter.register('player_one', 'p1@test.com', 'Pass1234');
    expect(reg.user?.role).toBe('user');
    expect(reg.user?.coins).toBe(100);
  });

  it('prevents banned user from logging in with a ban reason', async () => {
    const reg = await dataAdapter.register('testuser', 'test@user.com', 'Pass1234');
    expect(reg.user).toBeDefined();

    // Admin bans user with reason
    await dataAdapter.setUserBanStatus(reg.user!.id, true, 'Gian lận điểm số');

    // Login must fail
    const loginRes = await dataAdapter.login('test@user.com', 'Pass1234');
    expect(loginRes.error).toContain('Tài khoản của bạn đã bị khóa');
    expect(loginRes.banReason).toBe('Gian lận điểm số');
  });

  it('unbans user and allows subsequent login', async () => {
    const reg = await dataAdapter.register('reformed_user', 'reformed@user.com', 'Pass1234');
    await dataAdapter.setUserBanStatus(reg.user!.id, true, 'Vi phạm tạm thời');

    const unban = await dataAdapter.setUserBanStatus(reg.user!.id, false);
    expect(unban.is_banned).toBe(false);

    const loginRes = await dataAdapter.login('reformed@user.com', 'Pass1234');
    expect(loginRes.user?.is_banned).toBe(false);
  });
});
