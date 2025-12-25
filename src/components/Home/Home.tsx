import React, { useState, useEffect } from "react";
import ServerInfoService, {
  ServerInfo,
} from "../../services/realServerInfoService";
import "./Home.scss";

const Home: React.FC = () => {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServerInfo();
  }, []);

  const fetchServerInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await ServerInfoService.getServerInfo();
      setServerInfo(info);
    } catch (err) {
      setError("Failed to load server information");
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
            onClick={fetchServerInfo}
            disabled={loading}
            className="refresh-btn"
          >
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
        </div>

        {error && <div className="error-message">❌ {error}</div>}

        {serverInfo && (
          <div className="server-info-grid">
            <div className="info-card">
              <h4>☁️ EC2 Server Details</h4>
              <div className="info-row">
                <span className="label">Public IP:</span>
                <span className="value">{serverInfo.publicIp}</span>
              </div>
              <div className="info-row">
                <span className="label">Private IP:</span>
                <span className="value">{serverInfo.privateIp}</span>
              </div>
              <div className="info-row">
                <span className="label">Instance ID:</span>
                <span className="value">{serverInfo.instanceId}</span>
              </div>
              <div className="info-row">
                <span className="label">Availability Zone:</span>
                <span className="value">{serverInfo.availabilityZone}</span>
              </div>
              <div className="info-row">
                <span className="label">Server Time:</span>
                <span className="value">
                  {new Date(serverInfo.serverTime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
