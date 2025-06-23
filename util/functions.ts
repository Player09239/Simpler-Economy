const Server = require('./server');
const User = require('./data');

export async function calculate_earned(base: number, currency: string, user: string): Promise<number> {
    const s = await Server.findOne({ userId: user });
    if (!s || !s.vault) return base

    if (currency === 'cookies') {
        return base * (1 + (s.vault.cookies * 0.000002));
    } else if (currency === 'gems') {
        return base * (1 + (s.vault.gems * 0.000002));
    }
    return base
}