import { ProxyService } from './proxy.service';

describe('ProxyService', () => {
  let proxyService: ProxyService;

  beforeEach(() => {
    process.env.PROXIES = 'proxy1.com,proxy2.com';
    process.env.PROXY_USERNAME = 'username';
    process.env.PROXY_PASSWORD = 'password';
    process.env.PROXY_PORT = '1234';
  });

  it('should throw an error if no PROXIES are found', () => {
    delete process.env.PROXIES;

    expect(() => new ProxyService()).toThrow('No PROXIES found');
  });

  it('should throw an error if PROXY_USERNAME or PROXY_PASSWORD is not set', () => {
    delete process.env.PROXY_USERNAME;

    expect(() => new ProxyService()).toThrow('PROXY_USERNAME or PROXY_PASSWORD not set');
  });

  it('should return a proxy URL in the expected format', () => {
    proxyService = new ProxyService();
    const proxyUrl = proxyService.getProxy();
    expect(proxyUrl).toMatch(/http:\/\/proxy[12]\.com:1234/);
  });

  it('should randomly select a proxy from the pool', () => {
    proxyService = new ProxyService();
    const proxies = new Set<string>();

    // Call getProxy multiple times to check randomness
    for (let i = 0; i < 10; i++) {
      proxies.add(proxyService.getProxy());
    }

    expect(proxies.size).toBeGreaterThan(1);
  });
});
