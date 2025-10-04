import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  UserPlus,
  Search,
  RefreshCw,
  TrendingUp,
  Brain,
  Target,
  BarChart3,
  Network,
  Zap,
  Activity,
  Lightbulb,
  TrendingDown,
  AlertCircle,
  Calendar,
  Moon,
  Sun,
  MessageCircle,
  Send,
  Bot,
  User
} from 'lucide-react';
import './App.css';

const API_BASE = 'http://localhost:3000';

function App() {
  const [contacts, setContacts] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('contacts');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    company: '',
    revenue: ''
  });

  // 🚀 NEW AI-POWERED STATE 🚀
  const [aiInsights, setAiInsights] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [relationshipMap, setRelationshipMap] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [wsConnection, setWsConnection] = useState(null);

  // 🌙 DARK MODE STATE 🚀
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('crm-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  // 🤖 AI CHATBOX STATE 🚀
  const [showChatbox, setShowChatbox] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "👋 Hi! I'm your AI CRM Assistant! Ask me anything about your contacts, analytics, or get insights!",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 🌙 DARK MODE TOGGLE FUNCTION 🚀
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('crm-dark-mode', JSON.stringify(newMode));
    
    // Add smooth transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  };

  // 🤖 AI CHAT FUNCTIONS 🚀
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setIsTyping(true);

    try {
      // Call backend AI chat endpoint
      const response = await axios.post(`${API_BASE}/ai-chat`, {
        message: currentInput
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.data.response,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Sorry, I encountered an error. Please try again!',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };


  // Fetch contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/contacts?limit=50`);
      setContacts(response.data.contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch top clients
  const fetchTopClients = async () => {
    try {
      const response = await axios.get(`${API_BASE}/top-clients?limit=10`);
      setTopClients(response.data.top);
    } catch (error) {
      console.error('Error fetching top clients:', error);
    }
  };

  // 🚀 NEW AI-POWERED FETCH FUNCTIONS 🚀
  const fetchAiInsights = async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai-insights`);
      setAiInsights(response.data);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_BASE}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/recommendations`);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchRelationshipMap = async () => {
    try {
      const response = await axios.get(`${API_BASE}/relationship-map`);
      setRelationshipMap(response.data);
    } catch (error) {
      console.error('Error fetching relationship map:', error);
    }
  };

  const predictRevenue = async (contactId) => {
    try {
      const response = await axios.get(`${API_BASE}/predict-revenue/${contactId}`);
      return response.data;
    } catch (error) {
      console.error('Error predicting revenue:', error);
      return null;
    }
  };

  // WebSocket connection
  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:3000');
      
      ws.onopen = () => {
        console.log('🔌 WebSocket connected');
        setWsConnection(ws);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'new_contact') {
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'success',
            message: `New contact added: ${data.data.name}`,
            timestamp: new Date()
          }]);
        }
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setWsConnection(null);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsConnection(null);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  };

  // Add new contact
  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const contactData = {
        ...newContact,
        revenue: parseFloat(newContact.revenue) || 0
      };
      
      const response = await axios.post(`${API_BASE}/contacts`, contactData);
      setContacts(prev => [response.data, ...prev]);
      setNewContact({ name: '', email: '', company: '', revenue: '' });
      setShowAddForm(false);
      
      // Refresh all data
      fetchContacts();
      fetchTopClients();
      fetchAiInsights();
      fetchAnalytics();
      fetchRecommendations();
      fetchRelationshipMap();
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchContacts();
    fetchTopClients();
    fetchAiInsights();
    fetchAnalytics();
    fetchRecommendations();
    fetchRelationshipMap();
    connectWebSocket();

    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, []);

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Users className="logo-icon" />
            <h1>CRM Assistant</h1>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <UserPlus size={20} />
              Add Contact
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                fetchContacts();
                fetchTopClients();
                fetchAiInsights();
                fetchAnalytics();
                fetchRecommendations();
                fetchRelationshipMap();
              }}
            >
              <RefreshCw size={20} />
              Refresh
            </button>
            <button 
              className={`dark-mode-toggle ${isDarkMode ? 'dark' : 'light'}`}
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className={`ai-chatbox-toggle ${showChatbox ? 'active' : ''}`}
              onClick={() => setShowChatbox(!showChatbox)}
              title="AI Assistant"
            >
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <nav className="tabs">
          <button 
            className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <Users size={20} />
            All Contacts ({contacts.length})
          </button>
          <button 
            className={`tab ${activeTab === 'top-clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('top-clients')}
          >
            <TrendingUp size={20} />
            Top Clients
          </button>
          <button 
            className={`tab ${activeTab === 'ai-insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-insights')}
          >
            <Brain size={20} />
            AI Insights
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={20} />
            Analytics
          </button>
          <button 
            className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            <Target size={20} />
            Recommendations
          </button>
          <button 
            className={`tab ${activeTab === 'network' ? 'active' : ''}`}
            onClick={() => setActiveTab('network')}
          >
            <Network size={20} />
            Network Map
          </button>
        </nav>

        <div className="content">
          {activeTab === 'contacts' && (
            <div className="contacts-section">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="loading">Loading contacts...</div>
              ) : (
                <div className="contacts-grid">
                  {filteredContacts?.map(contact => (
                    <div key={contact.id} className="contact-card">
                      <div className="contact-avatar">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="contact-info">
                        <h3>{contact.name}</h3>
                        <p className="contact-email">{contact.email}</p>
                        <p className="contact-company">{contact.company}</p>
                        <div className="contact-meta">
                          <span className="revenue">${contact.revenue?.toLocaleString() || '0'}</span>
                          <span className="date">{formatDate(contact.created_at)}</span>
                        </div>
                        {contact.aiScore && (
                          <div className="ai-score">
                            <Brain size={14} />
                            AI Score: {contact.aiScore}/100
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'top-clients' && (
            <div className="top-clients-section">
              <h2>Top Clients by Revenue</h2>
              <div className="clients-stats">
                <div className="stat-card">
                  <span className="stat-number">{topClients?.length || 0}</span>
                  <span className="stat-label">Top Clients</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">${topClients?.reduce((sum, client) => sum + (client.revenue || 0), 0)?.toLocaleString() || '0'}</span>
                  <span className="stat-label">Total Revenue</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">${Math.round(topClients?.reduce((sum, client) => sum + (client.revenue || 0), 0) / (topClients?.length || 1))?.toLocaleString() || '0'}</span>
                  <span className="stat-label">Average Revenue</span>
                </div>
              </div>
              <div className="clients-list">
                {topClients?.map((client, index) => (
                  <div key={client.id} className="client-card">
                    <div className="client-rank">#{index + 1}</div>
                    <div className="client-info">
                      <h3>{client.name}</h3>
                      <p className="client-email">{client.email}</p>
                      <p className="client-company">{client.company}</p>
                      <div className="revenue-amount">${client.revenue?.toLocaleString()}</div>
                      <div className="client-score">AI Score: {Math.round((client.revenue || 0) / 300)}</div>
                    </div>
                    <div className="client-badge">
                      {index === 0 && <span className="badge gold">🥇 Top Performer</span>}
                      {index === 1 && <span className="badge silver">🥈 High Value</span>}
                      {index === 2 && <span className="badge bronze">🥉 Premium</span>}
                      {index > 2 && <span className="badge standard">⭐ Valuable</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai-insights' && aiInsights && (
            <div className="ai-insights-section">
              <h2>AI-Powered Insights</h2>
              <div className="insights-grid">
                <div className="insight-card">
                  <div className="insight-header">
                    <Brain className="insight-icon" />
                    <h3>Contact Intelligence</h3>
                  </div>
                  <div className="insight-stats">
                    <div className="stat">
                      <span className="stat-number">{aiInsights?.totalContacts || 0}</span>
                      <span className="stat-label">Total Contacts</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{aiInsights?.averageScore || 0}</span>
                      <span className="stat-label">Avg AI Score</span>
                    </div>
                  </div>
                </div>

                <div className="insight-card">
                  <div className="insight-header">
                    <TrendingUp className="insight-icon" />
                    <h3>Top Performers</h3>
                  </div>
                  <div className="performers-list">
                    {aiInsights.topPerformers?.slice(0, 3).map((performer, index) => (
                      <div key={performer?.id || index} className="performer-item">
                        <div className="performer-rank">#{index + 1}</div>
                        <div className="performer-info">
                          <span className="performer-name">{performer?.name || 'Unknown'}</span>
                          <span className="performer-score">Score: {performer?.aiScore || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="insight-card">
                  <div className="insight-header">
                    <Target className="insight-icon" />
                    <h3>Revenue Predictions</h3>
                  </div>
                  <div className="predictions-list">
                    {aiInsights.revenuePredictions?.slice(0, 3).map((prediction, index) => (
                      <div key={prediction?.id || index} className="prediction-item">
                        <div className="prediction-name">{prediction?.name || 'Unknown'}</div>
                        <div className="prediction-confidence">
                          <span className="current">${prediction?.currentRevenue?.toLocaleString() || '$0'}</span>
                          <span className="predicted">→ ${prediction?.predictedRevenue?.toLocaleString() || '$0'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="insight-card">
                  <div className="insight-header">
                    <Activity className="insight-icon" />
                    <h3>Trends & Patterns</h3>
                  </div>
                  <div className="trends-list">
                    {aiInsights.trends?.map((trend, index) => (
                      <div key={index} className="trend-item">
                        <span className="trend-label">{trend?.label || 'Unknown'}</span>
                        <span className="trend-value">{trend?.value || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && analytics && (
            <div className="analytics-section">
              <h2>Deep Analytics</h2>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Overview</h3>
                  <div className="analytics-stats">
                    <div className="stat">
                      <span className="stat-value">{analytics?.overview?.totalContacts || 0}</span>
                      <span className="stat-text">Total Contacts</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">${analytics?.overview?.totalRevenue?.toLocaleString() || '$0'}</span>
                      <span className="stat-text">Total Revenue</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">${analytics?.overview?.averageRevenue?.toLocaleString() || '$0'}</span>
                      <span className="stat-text">Average Revenue</span>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>Revenue Distribution</h3>
                  <div className="distribution-chart">
                    {analytics.revenueDistribution?.map((range, index) => (
                      <div key={index} className="distribution-bar">
                        <div className="range-label">{range?.range || 'Unknown'}</div>
                        <div className="range-bar">
                          <div 
                            className="range-fill" 
                            style={{ width: `${((range.count || 0) / (analytics?.overview?.totalContacts || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <div className="range-count">{range?.count || 0}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>Company Types</h3>
                  <div className="company-types">
                    {analytics.companyTypes?.map((type, index) => (
                      <div key={index} className="type-item">
                        <span className="type-name">{type?.type || 'Unknown'}</span>
                        <span className="type-count">{type?.count || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>Key Insights</h3>
                  <div className="insights-list">
                    {analytics.insights?.map((insight, index) => (
                      <div key={index} className="insight-item">
                        <Lightbulb size={16} />
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && recommendations && (
            <div className="recommendations-section">
              <h2>AI Recommendations</h2>
              <div className="recommendations-grid">
                <div className="recommendation-card urgent">
                  <div className="recommendation-header">
                    <AlertCircle className="recommendation-icon" />
                    <h3>Immediate Actions</h3>
                  </div>
                  <div className="recommendations-list">
                    {recommendations.immediateActions?.map((rec, index) => (
                      <div key={index} className="recommendation-item">
                        <div className="recommendation-action">{rec?.action || 'No action specified'}</div>
                        <div className="recommendation-reason">{rec?.reason || 'No reason specified'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recommendation-card medium">
                  <div className="recommendation-header">
                    <Calendar className="recommendation-icon" />
                    <h3>This Week</h3>
                  </div>
                  <div className="recommendations-list">
                    {recommendations.thisWeek?.map((rec, index) => (
                      <div key={index} className="recommendation-item">
                        <div className="recommendation-action">{rec?.action || 'No action specified'}</div>
                        <div className="recommendation-reason">{rec?.reason || 'No reason specified'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recommendation-card low">
                  <div className="recommendation-header">
                    <Target className="recommendation-icon" />
                    <h3>This Month</h3>
                  </div>
                  <div className="recommendations-list">
                    {recommendations.thisMonth?.map((rec, index) => (
                      <div key={index} className="recommendation-item">
                        <div className="recommendation-action">{rec?.action || 'No action specified'}</div>
                        <div className="recommendation-reason">{rec?.reason || 'No reason specified'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recommendation-card strategic">
                  <div className="recommendation-header">
                    <Brain className="recommendation-icon" />
                    <h3>Strategic Insights</h3>
                  </div>
                  <div className="strategic-insights">
                    {recommendations.strategicInsights?.map((insight, index) => (
                      <div key={index} className="strategic-item">
                        <Lightbulb size={16} />
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'network' && relationshipMap && (
            <div className="network-section">
              <h2>Relationship Network Map</h2>
              <div className="network-visualization">
                <div className="network-stats">
                  <div className="network-stat">
                    <span className="stat-number">{relationshipMap?.stats?.totalNodes || 0}</span>
                    <span className="stat-label">Contacts</span>
                  </div>
                  <div className="network-stat">
                    <span className="stat-number">{relationshipMap?.stats?.totalConnections || 0}</span>
                    <span className="stat-label">Connections</span>
                  </div>
                  <div className="network-stat">
                    <span className="stat-number">{relationshipMap?.stats?.companies || 0}</span>
                    <span className="stat-label">Clusters</span>
                  </div>
                </div>
                
                <div className="network-nodes">
                  {/* Connection lines */}
                  <svg className="connection-lines" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    {relationshipMap.connections?.slice(0, 20).map((connection, index) => {
                      const fromNode = relationshipMap.nodes?.find(n => n.id === connection.from);
                      const toNode = relationshipMap.nodes?.find(n => n.id === connection.to);
                      
                      if (!fromNode || !toNode) return null;
                      
                      const fromIndex = relationshipMap.nodes?.findIndex(n => n.id === connection.from) || 0;
                      const toIndex = relationshipMap.nodes?.findIndex(n => n.id === connection.to) || 0;
                      
                      const angle1 = (fromIndex * 2 * Math.PI) / Math.min(relationshipMap.nodes?.length || 8, 8);
                      const angle2 = (toIndex * 2 * Math.PI) / Math.min(relationshipMap.nodes?.length || 8, 8);
                      const radius = 120;
                      
                      const x1 = Math.cos(angle1) * radius + 200;
                      const y1 = Math.sin(angle1) * radius + 150;
                      const x2 = Math.cos(angle2) * radius + 200;
                      const y2 = Math.sin(angle2) * radius + 150;
                      
                      return (
                        <line
                          key={index}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={`rgba(102, 126, 234, ${connection.strength * 0.6})`}
                          strokeWidth={connection.strength * 2}
                          strokeDasharray={connection.type === 'strategic' ? '5,5' : 'none'}
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Network nodes */}
                  {relationshipMap.nodes?.slice(0, 8).map((node, index) => {
                    // Calculate position for better visualization
                    const angle = (index * 2 * Math.PI) / Math.min(relationshipMap.nodes?.length || 8, 8);
                    const radius = 120;
                    const x = Math.cos(angle) * radius + 200;
                    const y = Math.sin(angle) * radius + 150;
                    
                    return (
                      <div 
                        key={node?.id || index} 
                        className={`network-node ${(node?.score || 0) > 70 ? 'high-value' : (node?.score || 0) > 40 ? 'medium-value' : 'low-value'}`}
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          position: 'absolute'
                        }}
                      >
                        <div className="node-name">{node?.name || 'Unknown'}</div>
                        <div className="node-company">{node?.company || 'No Company'}</div>
                        <div className="node-score">Score: {node?.score || 0}</div>
                        <div className="node-revenue">${node?.revenue?.toLocaleString() || '0'}</div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="connection-legend">
                  <div className="legend-item">
                    <div className="legend-color high-value"></div>
                    <span>High Value (70+)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color medium-value"></div>
                    <span>Medium Value (40-70)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color low-value"></div>
                    <span>Low Value (&lt;40)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 🤖 AI CHATBOX 🚀 */}
      {showChatbox && (
        <div className="ai-chatbox">
          <div className="chatbox-header">
            <div className="chatbox-title">
              <Bot size={20} />
              <span>AI Assistant</span>
            </div>
            <button 
              className="chatbox-close"
              onClick={() => setShowChatbox(false)}
            >
              ×
            </button>
          </div>
          
          <div className="chatbox-messages">
            {chatMessages?.map(message => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'ai' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message ai typing">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <form className="chatbox-input" onSubmit={handleChatSubmit}>
            <input
              type="text"
              placeholder="Ask me anything about your CRM..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="chat-input"
            />
            <button type="submit" className="chat-send">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Contact</h2>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddContact} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={newContact.company}
                  onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Revenue</label>
                <input
                  type="number"
                  value={newContact.revenue}
                  onChange={(e) => setNewContact({...newContact, revenue: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications?.map(notification => (
            <div key={notification.id} className="notification">
              <span>{notification.message}</span>
              <button 
                className="notification-close"
                onClick={() => setNotifications(prev => 
                  prev.filter(n => n.id !== notification.id)
                )}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
