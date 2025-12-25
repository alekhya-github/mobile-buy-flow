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
      // Return dynamic mock data for development
      await this.simulateDelay(300);
      console.log("🖥️ Returning dynamic mock server info");

      const now = new Date();
      const startTime = new Date(now.getTime() - Math.random() * 86400000); // Random start time within last day
      const uptimeMs = now.getTime() - startTime.getTime();
      const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60));
      const uptimeMinutes = Math.floor(
        (uptimeMs % (1000 * 60 * 60)) / (1000 * 60)
      );

      // Generate dynamic instance info
      const instanceTypes = ["t3.micro", "t3.small", "t3.medium", "t3.large"];
      const regions = ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"];
      const azSuffixes = ["a", "b", "c"];

      const selectedRegion =
        regions[Math.floor(Math.random() * regions.length)];
      const selectedAZ =
        selectedRegion +
        azSuffixes[Math.floor(Math.random() * azSuffixes.length)];
      const selectedInstance =
        instanceTypes[Math.floor(Math.random() * instanceTypes.length)];

      return {
        ...mockServerInfo,
        hostname:
          window.location.hostname === "localhost"
            ? `ip-172-31-${Math.floor(Math.random() * 255)}-${Math.floor(
                Math.random() * 255
              )}`
            : window.location.hostname,
        instanceId: `i-${Math.random().toString(16).substr(2, 16)}`,
        region: selectedRegion,
        availabilityZone: selectedAZ,
        instanceType: selectedInstance,
        publicIp:
          window.location.hostname === "localhost"
            ? `54.${Math.floor(Math.random() * 255)}.${Math.floor(
                Math.random() * 255
              )}.${Math.floor(Math.random() * 255)}`
            : window.location.hostname,
        privateIp: `172.31.${Math.floor(Math.random() * 255)}.${Math.floor(
          Math.random() * 255
        )}`,
        loadBalancer: `mobile-app-alb-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        environment:
          window.location.hostname === "localhost"
            ? "development"
            : "production",
        serverTime: now.toISOString(),
        uptime: `${uptimeHours} hours ${uptimeMinutes} minutes`,
        version: "1.0.0",
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

  // Get essential client info for AWS deployment validation
  static getClientInfo() {
    return {
      requestTime: new Date().toISOString(),
      clientIP: "Client IP (available in AWS logs)",
      userAgent: navigator.userAgent.split(" ")[0], // Just browser name
      platform: navigator.platform,
      protocol: window.location.protocol,
      host: window.location.host,
      port:
        window.location.port ||
        (window.location.protocol === "https:" ? "443" : "80"),
      onLine: navigator.onLine,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
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
