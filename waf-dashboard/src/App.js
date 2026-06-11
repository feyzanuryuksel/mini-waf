import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './App.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/logs');
      setLogs(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error("SIEM Bağlantı Hatası:", error);
    }
  };

  const calculateStats = (data) => {
    const counts = {};
    data.forEach(log => {
      counts[log.attackType] = (counts[log.attackType] || 0) + 1;
    });
    setStats(Object.keys(counts).map(key => ({ name: key, value: counts[key] })));
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const COLORS = ['#da1e28', '#0f62fe', '#009f9f', '#ff832b'];

  const getSeverity = (type) => {
    if (type.includes('SQL') || type.includes('XSS')) return { label: 'High', color: '#da1e28' };
    if (type.includes('Path')) return { label: 'Medium', color: '#ff832b' };
    return { label: 'Low', color: '#0043ce' };
  };

  const renderCustomizedLabel = ({ name, value }) => {
    return `${name}: ${value}`;
  };

  return (
    <div className="App">
      <div className="main-content">
        
        {/* TOP NAV - İSİM GÜNCELLENDİ */}
        <div className="top-nav">
          <div className="nav-brand">
             SIEM | <span className="console-text">WAF_CONSOLE</span>
          </div>
          <div className="nav-info">
            Status: <span style={{color: '#24a148'}}>● ONLINE</span> | Last Refresh: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* DASHBOARD WIDGETS */}
        <div className="dashboard-grid">
          <div className="grid-item">
            <h3 className="widget-title">EVENT DISTRIBUTION (By Type)</h3>
            <div style={{ height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie 
                    data={stats} 
                    innerRadius={60} 
                    outerRadius={80} 
                    dataKey="value" 
                    stroke="none"
                    label={renderCustomizedLabel}
                    isAnimationActive={false} // YANIP SÖNMEYİ ENGELLEMEK İÇİN ANİMASYON KAPATILDI
                  >
                    {stats.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: '#262626', border: '1px solid #393939', color: '#fff'}} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid-item">
            <h3 className="widget-title">SYSTEM SUMMARY</h3>
            <div className="health-metrics">
              <div className="metric"><span>Events Analyzed:</span> <strong>{logs.length}</strong></div>
              <div className="metric"><span>Active Rules:</span> <strong style={{color: '#0f62fe'}}>14 (Hardened)</strong></div>
              <div className="metric"><span>Database:</span> <span style={{color: '#24a148'}}>Connected</span></div>
              <div className="alert-box">
                <span className="alert-tag">MONITORING:</span> Traffic is being intercepted via Proxy Port 3002.
              </div>
            </div>
          </div>
        </div>

        {/* LOG ACTIVITY TABLE */}
        <div className="log-activity-panel">
          <h3 className="widget-title">REAL-TIME LOG ACTIVITY</h3>
          <div className="table-wrapper">
            <table className="qradar-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Severity</th>
                  <th>Source IP</th>
                  <th>Attack Type</th>
                  <th>Payload Preview</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const sev = getSeverity(log.attackType);
                  return (
                    <tr key={log._id}>
                      <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td>
                        <span className="severity-bar" style={{backgroundColor: sev.color}}></span>
                        {sev.label}
                      </td>
                      <td className="ip-text">{log.ip}</td>
                      <td>{log.attackType}</td>
                      <td className="payload-text">{log.payload}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;