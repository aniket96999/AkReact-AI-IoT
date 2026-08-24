import React, { useEffect, useState } from "react";

// Load MQTT WebSocket client
import * as Paho from "paho-mqtt";

export default function SwitchPanel() {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create MQTT client
    const mqttClient = new Paho.Client(
      "broker.hivemq.com",
      8000,
      "webClient-" + Math.random()
    );

    // On message received
    mqttClient.onMessageArrived = (message) => {
      console.log("Received:", message.payloadString);
    };

    // On connection lost
    mqttClient.onConnectionLost = () => {
      console.log("MQTT Connection lost");
      setIsConnected(false);
    };

    // Connect
    mqttClient.connect({
      onSuccess: () => {
        console.log("Connected to MQTT");
        setIsConnected(true);
        mqttClient.subscribe("AKIoT/Switch");
      },
      onFailure: () => console.log("MQTT Connection Failed"),
    });

    setClient(mqttClient);
  }, []);

  // Send MQTT Command
  const sendCommand = (cmd) => {
    if (!client || !isConnected) return;

    const message = new Paho.Message(cmd);
    message.destinationName = "AKIoT/Switch";
    client.send(message);

    console.log("Sent:", cmd);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>ESP32 Switch Control Panel</h2>

      <div style={styles.status}>
        Status:{" "}
        <span style={{ color: isConnected ? "green" : "red" }}>
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div style={styles.grid}>
        {/* Device 1 */}
        <div style={styles.card}>
          <h3>Device 1</h3>
          <button style={styles.btnOn} onClick={() => sendCommand("D1_1")}>
            ON
          </button>
          <button style={styles.btnOff} onClick={() => sendCommand("D1_0")}>
            OFF
          </button>
        </div>

        {/* Device 2 */}
        <div style={styles.card}>
          <h3>Device 2</h3>
          <button style={styles.btnOn} onClick={() => sendCommand("D2_1")}>
            ON
          </button>
          <button style={styles.btnOff} onClick={() => sendCommand("D2_0")}>
            OFF
          </button>
        </div>

        {/* Device 3 */}
        <div style={styles.card}>
          <h3>Device 3</h3>
          <button style={styles.btnOn} onClick={() => sendCommand("D3_1")}>
            ON
          </button>
          <button style={styles.btnOff} onClick={() => sendCommand("D3_0")}>
            OFF
          </button>
        </div>

        {/* Device 4 */}
        <div style={styles.card}>
          <h3>Device 4</h3>
          <button style={styles.btnOn} onClick={() => sendCommand("D4_1")}>
            ON
          </button>
          <button style={styles.btnOff} onClick={() => sendCommand("D4_0")}>
            OFF
          </button>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------
// Simple inline styling
// --------------------------------------------
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial",
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  status: {
    marginBottom: "20px",
    fontSize: "18px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  card: {
    background: "#f3f3f3",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8pxAniketba(0,0,0,0.1)",
    textAlign: "center",
  },
  btnOn: {
    backgroundColor: "green",
    color: "white",
    padding: "10px",
    margin: "5px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "80px",
  },
  btnOff: {
    backgroundColor: "red",
    color: "white",
    padding: "10px",
    margin: "5px",
    borderRadius: "5px",
    cursor: "pointer",
    width: "80px",
  },
};
