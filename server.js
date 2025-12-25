const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve React build files
app.use(express.static(path.join(__dirname, "build")));

// Get IMDSv2 token (required for newer EC2 instances)
async function getIMDSToken() {
  return new Promise((resolve) => {
    const options = {
      hostname: "169.254.169.254",
      path: "/latest/api/token",
      method: "PUT",
      timeout: 2000,
      headers: {
        "X-aws-ec2-metadata-token-ttl-seconds": "21600",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });

    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
    req.end();
  });
}

// Function to fetch AWS metadata (supports both IMDSv1 and IMDSv2)
async function fetchMetadata(endpoint, token) {
  return new Promise((resolve) => {
    const options = {
      hostname: "169.254.169.254",
      path: `/latest/meta-data/${endpoint}`,
      method: "GET",
      timeout: 2000,
      headers: token ? { "X-aws-ec2-metadata-token": token } : {},
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data.trim() || "Not Available"));
    });

    req.on("error", () => resolve("Not Available"));
    req.on("timeout", () => {
      req.destroy();
      resolve("Not Available");
    });
    req.end();
  });
}

// API endpoint to get server info
app.get("/api/server-info", async (req, res) => {
  try {
    // Get IMDSv2 token first
    const token = await getIMDSToken();

    const [instanceId, publicIp, privateIp, availabilityZone] =
      await Promise.all([
        fetchMetadata("instance-id", token),
        fetchMetadata("public-ipv4", token),
        fetchMetadata("local-ipv4", token),
        fetchMetadata("placement/availability-zone", token),
      ]);

    res.json({
      instanceId,
      publicIp,
      privateIp,
      availabilityZone,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch server info" });
  }
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
