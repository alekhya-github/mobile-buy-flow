const express = require("express");
const path = require("path");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve React build files
app.use(express.static(path.join(__dirname, "build")));

// Function to fetch AWS metadata
async function fetchMetadata(endpoint) {
  return new Promise((resolve) => {
    const req = http.get(
      `http://169.254.169.254/latest/meta-data/${endpoint}`,
      { timeout: 2000 },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data.trim() || "Not Available"));
      }
    );
    req.on("error", () => resolve("Not Available"));
    req.on("timeout", () => {
      req.destroy();
      resolve("Not Available");
    });
  });
}

// API endpoint to get server info
app.get("/api/server-info", async (req, res) => {
  try {
    const [instanceId, publicIp, privateIp, availabilityZone] =
      await Promise.all([
        fetchMetadata("instance-id"),
        fetchMetadata("public-ipv4"),
        fetchMetadata("local-ipv4"),
        fetchMetadata("placement/availability-zone"),
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
