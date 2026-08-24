import { useEffect, useRef, useState } from "react";
import * as Paho from "paho-mqtt";

export const useMQTT = (brokerUrl = "broker.hivemq.com", port = 8000, topic = "AKIoT/Switch") => {
  const clientRef = useRef<Paho.Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = new Paho.Client(brokerUrl, port, "webClient-" + Math.random());
    clientRef.current = client;

    client.onConnectionLost = () => {
      console.log("MQTT connection lost");
      setConnected(false);
    };

    client.onMessageArrived = (message) => {
      console.log("MQTT Message received:", message.payloadString);
    };

    client.connect({
      onSuccess: () => {
        console.log("Connected to MQTT broker");
        client.subscribe(topic);
        setConnected(true);
      },
      onFailure: (err) => {
        console.log("MQTT connection failed:", err);
      },
      reconnect: true,
    });

    return () => {
      client.disconnect();
    };
  }, [brokerUrl, port, topic]);

  const publish = (msg: string) => {
    if (!clientRef.current || !connected) return;
    const message = new Paho.Message(msg);
    message.destinationName = topic;
    clientRef.current.send(message);
    console.log("Published:", msg);
  };

  return { publish, connected };
};
