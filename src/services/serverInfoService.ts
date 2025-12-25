// Server Info types
export interface ServerInfo {
  hostname: string;
  instanceId?: string;
  region?: string;
  availabilityZone?: string;
  instanceType?: string;
  publicIp?: string;
  privateIp?: string;
  loadBalancer?: string;
  environment: string;
  serverTime: string;
  uptime?: string;
  version?: string;
}

// Mock server info for development
const mockServerInfo: ServerInfo = {
  hostname: "localhost",
  instanceId: "i-1234567890abcdef0",
  region: "us-east-1",
  availabilityZone: "us-east-1a",
  instanceType: "t3.medium",
  publicIp: "10.0.0.127",
  privateIp: "172.31.32.123",
  loadBalancer: "mobile-app-alb-123456789",
  environment: "development",
  serverTime: new Date().toISOString(),
  uptime: "2 hours 15 minutes",
  version: "1.0.0",
};

// Configuration for server info
const USE_MOCK_SERVER_INFO = true; // Set to false for real AWS deployment
const SERVER_INFO_API_URL = "/api/server-info"; // Your actual server info endpoint

// Server Info Service
export class ServerInfoService {
  // Simulate network delay
  private static async simulateDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get server information
  static async getServerInfo(): Promise<ServerInfo> {
    if (USE_MOCK_SERVER_INFO) {
      // Return mock data for development
      await this.simulateDelay(300);
      console.log("🖥️ Returning mock server info");
      return {
        ...mockServerInfo,
        serverTime: new Date().toISOString(),
        uptime: `${Math.floor(Math.random() * 10)} hours ${Math.floor(
          Math.random() * 60
        )} minutes`,
      };
    }

    // Fetch real server info from AWS
    try {
      const response = await fetch(SERVER_INFO_API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const serverInfo: ServerInfo = await response.json();
      console.log("🖥️ Returning real server info from AWS");
      return serverInfo;
    } catch (error) {
      console.error("Error fetching server info:", error);

      // Fallback to basic info if server endpoint fails
      return {
        hostname: window.location.hostname,
        environment: "unknown",
        serverTime: new Date().toISOString(),
      };
    }
  }

  // Get browser/client info
  static getClientInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      clientTime: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      url: window.location.href,
      referrer: document.referrer || "Direct access",
    };
  }

  // Get network timing info (for load balancer analysis)
  static async getNetworkTiming(): Promise<any> {
    if ("performance" in window && "getEntriesByType" in performance) {
      const navigationEntries = performance.getEntriesByType("navigation");
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0] as PerformanceNavigationTiming;
        return {
          dnsLookup: nav.domainLookupEnd - nav.domainLookupStart,
          tcpConnect: nav.connectEnd - nav.connectStart,
          tlsHandshake:
            nav.secureConnectionStart > 0
              ? nav.connectEnd - nav.secureConnectionStart
              : 0,
          serverResponse: nav.responseEnd - nav.requestStart,
          totalLoadTime: nav.loadEventEnd - nav.fetchStart,
          domContentLoaded: nav.domContentLoadedEventEnd - nav.fetchStart,
        };
      }
    }
    return null;
  }
}

export default ServerInfoService;
