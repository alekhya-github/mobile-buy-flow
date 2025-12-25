import React, { useState, useEffect } from "react";
import ServerInfoService, {
  ServerInfo,
} from "../../services/realServerInfoService";
import "./Home.scss";

const Home: React.FC = () => {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [networkTiming, setNetworkTiming] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    const fetchServerInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch server info
        const info = await ServerInfoService.getServerInfo();
        setServerInfo(info);

        // Get network timing
        const timing = await ServerInfoService.getNetworkTiming();
        setNetworkTiming(timing);
      } catch (err) {
        setError("Failed to load server information");
        console.error("Error fetching server info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServerInfo();
  }, []);

  const refreshServerInfo = async () => {
    setLoading(true);
    try {
      const info = await ServerInfoService.getServerInfo();
      setServerInfo(info);
      setError(null);
    } catch (err) {
      setError("Failed to refresh server information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <h2>Mobile Buy Flow - Home</h2>
      <p>Welcome to the Mobile Phone App!</p>

      <div className="server-info-section">
        <div className="server-info-header">
          <h3>🖥️ Server Information</h3>
          <button
            onClick={refreshServerInfo}
            disabled={loading}
            className="refresh-btn"
          >
            {loading ? "🔄 Loading..." : "🔄 Refresh"}
          </button>
        </div>

        {error && <div className="error-message">❌ {error}</div>}

        {serverInfo && (
          <div className="server-info-grid">
            <div className="info-card primary-info">
              <h4>🌐 Primary Server Details</h4>
              <div className="info-row">
                <span className="label">Hostname:</span>
                <span className="value">{serverInfo.hostname}</span>
              </div>
              <div className="info-row">
                <span className="label">Environment:</span>
                <span className={`value environment-${serverInfo.environment}`}>
                  {serverInfo.environment.toUpperCase()}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Server Time:</span>
                <span className="value">
                  {new Date(serverInfo.serverTime).toLocaleString()}
                </span>
              </div>
              {serverInfo.uptime && (
                <div className="info-row">
                  <span className="label">Uptime:</span>
                  <span className="value">{serverInfo.uptime}</span>
                </div>
              )}
            </div>

            {serverInfo.instanceId && (
              <div className="info-card aws-info">
                <h4>☁️ AWS EC2 Details</h4>
                <div className="info-row">
                  <span className="label">Instance ID:</span>
                  <span className="value code">{serverInfo.instanceId}</span>
                </div>
                {serverInfo.region && (
                  <div className="info-row">
                    <span className="label">Region:</span>
                    <span className="value">{serverInfo.region}</span>
                  </div>
                )}
                {serverInfo.availabilityZone && (
                  <div className="info-row">
                    <span className="label">Availability Zone:</span>
                    <span className="value">{serverInfo.availabilityZone}</span>
                  </div>
                )}
                {serverInfo.instanceType && (
                  <div className="info-row">
                    <span className="label">Instance Type:</span>
                    <span className="value">{serverInfo.instanceType}</span>
                  </div>
                )}
              </div>
            )}

            {(serverInfo.publicIp ||
              serverInfo.privateIp ||
              serverInfo.loadBalancer) && (
              <div className="info-card network-info">
                <h4>🌍 Network Details</h4>
                {serverInfo.publicIp && (
                  <div className="info-row">
                    <span className="label">Public IP:</span>
                    <span className="value code">{serverInfo.publicIp}</span>
                  </div>
                )}
                {serverInfo.privateIp && (
                  <div className="info-row">
                    <span className="label">Private IP:</span>
                    <span className="value code">{serverInfo.privateIp}</span>
                  </div>
                )}
                {serverInfo.loadBalancer && (
                  <div className="info-row">
                    <span className="label">Load Balancer:</span>
                    <span className="value code">
                      {serverInfo.loadBalancer}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="toggle-details">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="toggle-btn"
          >
            {showDetails ? "🔼 Hide" : "🔽 Show"} Advanced Details
          </button>
        </div>

        {showDetails && (
          <div className="advanced-details">
            {networkTiming && (
              <div className="info-card timing-info">
                <h4>⚡ Network Performance</h4>
                <div className="info-row">
                  <span className="label">DNS Lookup:</span>
                  <span className="value">
                    {networkTiming.dnsLookup?.toFixed(2)}ms
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">TCP Connect:</span>
                  <span className="value">
                    {networkTiming.tcpConnect?.toFixed(2)}ms
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Server Response:</span>
                  <span className="value">
                    {networkTiming.serverResponse?.toFixed(2)}ms
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Total Load Time:</span>
                  <span className="value">
                    {networkTiming.totalLoadTime?.toFixed(2)}ms
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
