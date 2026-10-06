import { describe, it, expect } from 'vitest';
import packageJson from '../package.json';

describe('Project Setup', () => {
  it('includes required core dependencies', () => {
    expect(packageJson.dependencies).toHaveProperty('next');
    expect(packageJson.dependencies).toHaveProperty('framer-motion');
    expect(packageJson.dependencies).toHaveProperty('lucide-react');
    expect(packageJson.dependencies).toHaveProperty('@supabase/supabase-js');
  });
});
