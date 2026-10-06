import { describe, it, expect, beforeEach } from 'vitest';
import { dataAdapter } from '../lib/store/data-adapter';

describe('Data Adapter & Auth System', () => {
  beforeEach(() => {
    dataAdapter.resetMockState();
  });

  it('allows default admin login and persists in getCurrentUser', async () => {
    const res = await dataAdapter.login('admin@arcade.dev', 'Admin@123456');
    expect(res.user?.role).toBe('admin');
    expect(res.user?.username).toBe('admin');
    expect(dataAdapter.getCurrentUser()?.email).toBe('admin@arcade.dev');
  });

  it('registers new user with nickname and gives starter coins', async () => {
    const reg = await dataAdapter.register('Sát Thủ Neon', 'p1@test.com', 'Pass1234');
    expect(reg.user?.role).toBe('user');
    expect(reg.user?.username).toBe('Sát Thủ Neon');
    expect(reg.user?.nickname).toBe('Sát Thủ Neon');
    expect(reg.user?.coins).toBe(100);
    expect(dataAdapter.getCurrentUser()?.username).toBe('Sát Thủ Neon');
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

  it('requires valid logged-in userId to submit score to leaderboard', async () => {
    // Unauthenticated score submission should not be recorded
    await dataAdapter.submitScore('', 'Anonymous', 'snake', 500);
    const lb = await dataAdapter.getLeaderboard('snake');
    expect(lb.some(s => s.score === 500 && s.username === 'Anonymous')).toBe(false);

    // Authenticated score submission succeeds
    const reg = await dataAdapter.register('ProPlayer', 'pro@arcade.dev', 'Pass1234');
    await dataAdapter.submitScore(reg.user!.id, reg.user!.username, 'snake', 500);
    const updatedLb = await dataAdapter.getLeaderboard('snake');
    expect(updatedLb.some(s => s.score === 500 && s.username === 'ProPlayer')).toBe(true);
  });
});
