// Phone data types
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

// AWS EC2 Metadata Service URLs
const AWS_METADATA_BASE = "http://169.254.169.254/latest/meta-data";
const AWS_METADATA_ENDPOINTS = {
  instanceId: `${AWS_METADATA_BASE}/instance-id`,
  instanceType: `${AWS_METADATA_BASE}/instance-type`,
  region: `${AWS_METADATA_BASE}/placement/region`,
  availabilityZone: `${AWS_METADATA_BASE}/placement/availability-zone`,
  publicIp: `${AWS_METADATA_BASE}/public-ipv4`,
  privateIp: `${AWS_METADATA_BASE}/local-ipv4`,
  hostname: `${AWS_METADATA_BASE}/hostname`,
};

// Server Info Service
export class ServerInfoService {
  // Fetch AWS EC2 metadata
  private static async fetchAWSMetadata(
    endpoint: string
  ): Promise<string | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(endpoint, {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const text = await response.text();
      return text.trim() || null;
    } catch (error) {
      console.warn(`Failed to fetch AWS metadata from ${endpoint}:`, error);
      return null;
    }
  }

  // Get server information from AWS or backend
  static async getServerInfo(): Promise<ServerInfo> {
    const serverInfo: ServerInfo = {
      hostname: window.location.hostname || "Not Available",
      environment:
        window.location.hostname === "localhost" ? "development" : "production",
      serverTime: new Date().toISOString(),
    };

    try {
      console.log("🔍 Fetching server information from AWS EC2 metadata...");

      // Try to get AWS EC2 metadata
      const [
        instanceId,
        instanceType,
        region,
        availabilityZone,
        publicIp,
        privateIp,
        hostname,
      ] = await Promise.allSettled([
        this.fetchAWSMetadata(AWS_METADATA_ENDPOINTS.instanceId),
        this.fetchAWSMetadata(AWS_METADATA_ENDPOINTS.instanceType),
        this.fetchAWSMetadata(AWS_METADATA_ENDPOINTS.region),
        this.fetchAWSMetadata(AWS_METADATA_ENDPOINTS.availabilityZone),
        this.fetchAWSMetadata(AWS_METADATA_ENDPOINTS.publicIp),
        this.fetchAWSMetadata(AWS_METADATA_ENDPOINTS.privateIp),
        this.fetchAWSMetadata(AWS_METADATA_ENDPOINTS.hostname),
      ]);

      // Populate real AWS data if available
      if (instanceId.status === "fulfilled" && instanceId.value) {
        serverInfo.instanceId = instanceId.value;
      } else {
        serverInfo.instanceId = "Not Available";
      }

      if (instanceType.status === "fulfilled" && instanceType.value) {
        serverInfo.instanceType = instanceType.value;
      } else {
        serverInfo.instanceType = "Not Available";
      }

      if (region.status === "fulfilled" && region.value) {
        serverInfo.region = region.value;
      } else {
        serverInfo.region = "Not Available";
      }

      if (availabilityZone.status === "fulfilled" && availabilityZone.value) {
        serverInfo.availabilityZone = availabilityZone.value;
      } else {
        serverInfo.availabilityZone = "Not Available";
      }

      if (publicIp.status === "fulfilled" && publicIp.value) {
        serverInfo.publicIp = publicIp.value;
      } else {
        serverInfo.publicIp = "Not Available";
      }

      if (privateIp.status === "fulfilled" && privateIp.value) {
        serverInfo.privateIp = privateIp.value;
      } else {
        serverInfo.privateIp = "Not Available";
      }

      if (hostname.status === "fulfilled" && hostname.value) {
        serverInfo.hostname = hostname.value;
      }

      // Try to get additional info from backend API if available
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const apiResponse = await fetch("/api/server-info", {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (apiResponse.ok) {
          const backendData = await apiResponse.json();

          // Merge backend data with AWS metadata
          if (backendData.uptime) {
            serverInfo.uptime = backendData.uptime;
          } else {
            serverInfo.uptime = "Not Available";
          }

          if (backendData.loadBalancer) {
            serverInfo.loadBalancer = backendData.loadBalancer;
          } else {
            serverInfo.loadBalancer = "Not Available";
          }

          if (backendData.version) {
            serverInfo.version = backendData.version;
          } else {
            serverInfo.version = "Not Available";
          }

          console.log("✅ Retrieved server info from AWS + Backend API");
        } else {
          throw new Error(`API response not ok: ${apiResponse.status}`);
        }
      } catch (apiError) {
        console.warn("Backend API not available, using AWS metadata only");
        serverInfo.uptime = "Not Available";
        serverInfo.loadBalancer = "Not Available";
        serverInfo.version = "Not Available";
      }

      console.log("✅ Server info retrieval completed");
      return serverInfo;
    } catch (error) {
      console.error("Failed to retrieve server information:", error);

      // Return basic info if everything fails
      return {
        hostname: window.location.hostname || "Not Available",
        instanceId: "Not Available",
        region: "Not Available",
        availabilityZone: "Not Available",
        instanceType: "Not Available",
        publicIp: "Not Available",
        privateIp: "Not Available",
        loadBalancer: "Not Available",
        environment:
          window.location.hostname === "localhost"
            ? "development"
            : "production",
        serverTime: new Date().toISOString(),
        uptime: "Not Available",
        version: "Not Available",
      };
    }
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
