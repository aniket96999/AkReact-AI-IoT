import { useEffect, useRef, useState } from "react";
import * as Paho from "paho-mqtt";

interface SensorData {
  airTemp: number | null;
  airHumidity: number | null;
  soilTemp: number;
  soilMoisture: number;
  light: number;
}

export const useMQTTSensor = (
  brokerUrl = "broker.hivemq.com",
  port = 8000,
  topic = "AKIoT/Sensors"
) => {
  const clientRef = useRef<Paho.Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    airTemp: null,
    airHumidity: null,
    soilTemp: 0,
    soilMoisture: 0,
    light: 0,
  });

  useEffect(() => {
    const client = new Paho.Client(
      brokerUrl,
      port,
      "webClient-" + Math.random()
    );

    clientRef.current = client;

    client.onConnectionLost = () => {
      console.log("MQTT connection lost");
      setConnected(false);
    };

    client.onMessageArrived = (msg) => {
      console.log("Sensor MQTT:", msg.payloadString);

      try {
        const data = JSON.parse(msg.payloadString);

        setSensorData({
          airTemp: isNaN(data.airTemp) ? null : data.airTemp,
          airHumidity: isNaN(data.airHumidity) ? null : data.airHumidity,
          soilTemp: data.soilTemp,
          soilMoisture: data.soilMoisture,
          light: data.light,
        });
      } catch (err) {
        console.log("Invalid JSON:", err);
      }
    };

    client.connect({
      onSuccess: () => {
        console.log("Connected to MQTT Sensor");
        client.subscribe(topic);
        setConnected(true);
      },
      onFailure: (err) => {
        console.log("MQTT connection failed:", err);
      },
      reconnect: true,
    });

    return () => client.disconnect();
  }, [brokerUrl, port, topic]);

  return { sensorData, connected };
};
