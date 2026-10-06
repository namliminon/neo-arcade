import { describe, it, expect, beforeEach } from 'vitest';
import { dataAdapter } from '../lib/store/data-adapter';

describe('Shop & Inventory System', () => {
  beforeEach(() => {
    dataAdapter.resetMockState();
  });

  it('deducts coins and equips item upon purchase', async () => {
    const user = await dataAdapter.register('buyer', 'b@arcade.dev', 'Pass1234');
    expect(user.user).toBeDefined();
    const startCoins = user.user!.coins; // 100 starter coins

    const purchase = await dataAdapter.buyShopItem(user.user!.id, 'skin-snake-cyber', 50);
    expect(purchase.success).toBe(true);
    expect(purchase.remainingCoins).toBe(startCoins - 50);

    const inventory = await dataAdapter.getUserInventory(user.user!.id);
    expect(inventory).toContainEqual(expect.objectContaining({ item_id: 'skin-snake-cyber' }));
  });

  it('rejects purchase if not enough coins', async () => {
    const user = await dataAdapter.register('poor_buyer', 'poor@arcade.dev', 'Pass1234');
    const purchase = await dataAdapter.buyShopItem(user.user!.id, 'skin-exclusive-gold', 500);
    expect(purchase.success).toBe(false);
    expect(purchase.error).toContain('Không đủ xu');
  });
});
