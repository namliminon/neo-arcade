import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('Production Artifacts', () => {
  it('verifies SQL schema exists and has valid table creation commands', () => {
    expect(fs.existsSync('supabase_schema.sql')).toBe(true);
    const sql = fs.readFileSync('supabase_schema.sql', 'utf8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS profiles');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS scores');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS game_rooms');
    expect(sql).toContain('is_banned BOOLEAN');
    expect(sql).toContain('ban_reason TEXT');
  });

  it('verifies deployment guide exists and contains Vercel and Supabase instructions', () => {
    expect(fs.existsSync('DEPLOYMENT_GUIDE.md')).toBe(true);
    const guide = fs.readFileSync('DEPLOYMENT_GUIDE.md', 'utf8');
    expect(guide).toContain('Vercel');
    expect(guide).toContain('Supabase');
    expect(guide).toContain('NEXT_PUBLIC_SUPABASE_URL');
  });
});
