export interface ServerInfo {
  instanceId: string;
  publicIp: string;
  privateIp: string;
  availabilityZone: string;
  serverTime: string;
}

export class ServerInfoService {
  static async getServerInfo(): Promise<ServerInfo> {
    try {
      const response = await fetch("/api/server-info");

      if (!response.ok) {
        throw new Error("Failed to fetch server info");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching server info:", error);
      return {
        instanceId: "Not Available",
        publicIp: "Not Available",
        privateIp: "Not Available",
        availabilityZone: "Not Available",
        serverTime: new Date().toISOString(),
      };
    }
  }
}

export default ServerInfoService;
