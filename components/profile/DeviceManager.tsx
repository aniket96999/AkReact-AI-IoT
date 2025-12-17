
import React, { useState } from 'react';
import { DeviceProfile } from '../../types';
import { Cpu, Wifi, Battery, RefreshCw, Trash2, Plus, Settings } from 'lucide-react';

const MOCK_DEVICES: DeviceProfile[] = [
  {
    id: 'd1',
    name: 'Greenhouse Hub A',
    deviceId: 'ESP8266_MAC_X45',
    firmwareVersion: 'v2.1.0',
    batteryStatus: 85,
    lastSyncTime: '2 mins ago',
    networkStatus: 'Online',
    sensors: [
      { type: 'Soil Moisture', status: 'Active', lastValue: '65%' },
      { type: 'DHT11 Temp', status: 'Active', lastValue: '24°C' },
      { type: 'DHT11 Humidity', status: 'Active', lastValue: '55%' },
      { type: 'LDR Light', status: 'Active', lastValue: '1200 Lux' }
    ]
  },
  {
    id: 'd2',
    name: 'Field Node 01',
    deviceId: 'ESP32_MAC_Y99',
    firmwareVersion: 'v1.0.4',
    batteryStatus: 30,
    lastSyncTime: '1 hour ago',
    networkStatus: 'Weak',
    sensors: [
      { type: 'Soil Moisture', status: 'Calibrating', lastValue: '--' },
      { type: 'Rain Sensor', status: 'Active', lastValue: 'Dry' }
    ]
  }
];

const DeviceManager: React.FC = () => {
  const [devices, setDevices] = useState<DeviceProfile[]>(MOCK_DEVICES);

  const handleDelete = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" /> Device Management
        </h3>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Device
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {devices.map((device) => (
          <div key={device.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-700 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-white">{device.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                    device.networkStatus === 'Online' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    device.networkStatus === 'Weak' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {device.networkStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">ID: {device.deviceId} • FW: {device.firmwareVersion} • Last Sync: {device.lastSyncTime}</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                   <Battery className={`w-4 h-4 ${device.batteryStatus < 20 ? 'text-red-400' : 'text-green-400'}`} />
                   <span className="text-sm font-medium">{device.batteryStatus}%</span>
                 </div>
                 <button className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                   <RefreshCw className="w-4 h-4" />
                 </button>
                  <button onClick={() => handleDelete(device.id)} className="p-2 hover:bg-red-500/20 rounded-full text-slate-400 hover:text-red-400 transition-colors">
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>
            </div>

            {/* Sensors List */}
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Connected Sensors</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {device.sensors.map((sensor, idx) => (
                <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700 flex justify-between items-center group">
                  <div>
                    <span className="text-sm text-slate-300 block font-medium">{sensor.type}</span>
                    <span className={`text-xs ${
                      sensor.status === 'Active' ? 'text-green-400' : 
                      sensor.status === 'Calibrating' ? 'text-yellow-400' : 'text-red-400'
                    }`}>{sensor.status}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-white">{sensor.lastValue}</span>
                    <button className="text-slate-600 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Settings className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceManager;
