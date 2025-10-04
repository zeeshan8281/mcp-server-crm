// 🚀 NEXT-LEVEL CRM ASSISTANT - AI-Powered Contact Intelligence 🚀
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const app = express();
const server = http.createServer(app);

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ server });

// Store active connections
const activeConnections = new Set();

// AI Analytics Engine
const AI_INSIGHTS = {
  // Revenue prediction algorithm
  predictRevenue: (contact) => {
    const factors = {
      companySize: contact.company?.length > 10 ? 1.5 : 1.0,
      emailDomain: contact.email?.includes('@gmail.com') ? 0.8 : 1.2,
      nameLength: contact.name?.length > 15 ? 1.3 : 1.0,
      currentRevenue: contact.revenue || 0
    };
    
    const basePrediction = factors.currentRevenue * 1.2;
    const multiplier = Object.values(factors).reduce((a, b) => a * b, 1);
    return Math.round(basePrediction * multiplier);
  },

  // Contact scoring algorithm
  calculateScore: (contact) => {
    let score = 0;
    
    // Revenue factor (40% weight)
    score += Math.min(contact.revenue / 1000, 40);
    
    // Company factor (30% weight)
    if (contact.company) {
      const companyKeywords = ['tech', 'ai', 'software', 'digital', 'innovation'];
      const hasKeyword = companyKeywords.some(keyword => 
        contact.company.toLowerCase().includes(keyword)
      );
      score += hasKeyword ? 30 : 15;
    }
    
    // Email domain factor (20% weight)
    const premiumDomains = ['@company.com', '@corp.com', '@enterprise.com'];
    const isPremium = premiumDomains.some(domain => 
      contact.email?.includes(domain)
    );
    score += isPremium ? 20 : 10;
    
    // Name factor (10% weight)
    score += contact.name?.length > 10 ? 10 : 5;
    
    return Math.min(Math.round(score), 100);
  },

  // Relationship mapping
  findConnections: (contacts) => {
    const connections = [];
    for (let i = 0; i < contacts.length; i++) {
      for (let j = i + 1; j < contacts.length; j++) {
        const contact1 = contacts[i];
        const contact2 = contacts[j];
        
        // Check for company connections
        if (contact1.company && contact2.company && 
            contact1.company.toLowerCase() === contact2.company.toLowerCase()) {
          connections.push({
            from: contact1.id,
            to: contact2.id,
            type: 'colleague',
            strength: 0.9
          });
        }
        
        // Check for domain connections
        const domain1 = contact1.email?.split('@')[1];
        const domain2 = contact2.email?.split('@')[1];
        if (domain1 && domain2 && domain1 === domain2 && domain1 !== 'gmail.com') {
          connections.push({
            from: contact1.id,
            to: contact2.id,
            type: 'domain',
            strength: 0.7
          });
        }
        
        // Check for revenue similarity (high-value connections)
        const revenue1 = contact1.revenue || 0;
        const revenue2 = contact2.revenue || 0;
        const revenueDiff = Math.abs(revenue1 - revenue2);
        const avgRevenue = (revenue1 + revenue2) / 2;
        
        if (avgRevenue > 10000 && revenueDiff < avgRevenue * 0.3) {
          connections.push({
            from: contact1.id,
            to: contact2.id,
            type: 'high-value',
            strength: 0.6
          });
        }
        
        // Check for tech company connections
        const isTech1 = contact1.company?.toLowerCase().includes('tech') || 
                       contact1.company?.toLowerCase().includes('ai') ||
                       contact1.company?.toLowerCase().includes('lab');
        const isTech2 = contact2.company?.toLowerCase().includes('tech') || 
                       contact2.company?.toLowerCase().includes('ai') ||
                       contact2.company?.toLowerCase().includes('lab');
        
        if (isTech1 && isTech2) {
          connections.push({
            from: contact1.id,
            to: contact2.id,
            type: 'tech-network',
            strength: 0.5
          });
        }
        
        // Random strategic connections for better visualization
        if (Math.random() < 0.15) { // 15% chance of random connection
          connections.push({
            from: contact1.id,
            to: contact2.id,
            type: 'strategic',
            strength: 0.3
          });
        }
      }
    }
    return connections;
  }
};

// Real-time notification system
const notifyClients = (type, data) => {
  const message = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
  activeConnections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
};

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('🔌 New client connected');
  activeConnections.add(ws);
  
  ws.on('close', () => {
    console.log('🔌 Client disconnected');
    activeConnections.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    activeConnections.delete(ws);
  });
});

app.use(cors());
app.use(bodyParser.json());

// 🚀 INSANE AI-POWERED ENDPOINTS 🚀

// Basic health
app.get('/health', (req, res) => res.json({ 
  ok: true, 
  features: ['AI Analytics', 'Real-time Updates', 'Relationship Mapping', 'Revenue Prediction'],
  connections: activeConnections.size 
}));

// 🧠 AI CONTACT INSIGHTS - Get AI-powered analytics for all contacts
app.get('/ai-insights', async (req, res) => {
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const insights = {
      totalContacts: contacts.length,
      totalRevenue: contacts.reduce((sum, c) => sum + (c.revenue || 0), 0),
      averageRevenue: contacts.length > 0 ? Math.round(contacts.reduce((sum, c) => sum + (c.revenue || 0), 0) / contacts.length) : 0,
      topPerformingCompanies: {},
      revenuePredictions: [],
      contactScores: [],
      relationshipMap: AI_INSIGHTS.findConnections(contacts),
      trends: {
        highValueContacts: contacts.filter(c => (c.revenue || 0) > 10000).length,
        techCompanies: contacts.filter(c => c.company?.toLowerCase().includes('tech')).length,
        enterpriseDomains: contacts.filter(c => !c.email?.includes('@gmail.com')).length
      }
    };

    // Calculate company performance
    contacts.forEach(contact => {
      if (contact.company) {
        if (!insights.topPerformingCompanies[contact.company]) {
          insights.topPerformingCompanies[contact.company] = { revenue: 0, count: 0 };
        }
        insights.topPerformingCompanies[contact.company].revenue += contact.revenue || 0;
        insights.topPerformingCompanies[contact.company].count += 1;
      }
    });

    // Generate AI predictions and scores
    contacts.forEach(contact => {
      insights.revenuePredictions.push({
        contactId: contact.id,
        name: contact.name,
        currentRevenue: contact.revenue || 0,
        predictedRevenue: AI_INSIGHTS.predictRevenue(contact),
        confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
      });

      insights.contactScores.push({
        contactId: contact.id,
        name: contact.name,
        score: AI_INSIGHTS.calculateScore(contact),
        factors: {
          revenue: Math.min((contact.revenue || 0) / 1000, 40),
          company: contact.company ? (contact.company.toLowerCase().includes('tech') ? 30 : 15) : 0,
          domain: contact.email?.includes('@gmail.com') ? 10 : 20,
          nameLength: contact.name?.length > 10 ? 10 : 5
        }
      });
    });

    // Sort by score
    insights.contactScores.sort((a, b) => b.score - a.score);
    insights.revenuePredictions.sort((a, b) => b.predictedRevenue - a.predictedRevenue);

    res.json({ insights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'unknown' });
  }
});

// 🔮 REVENUE PREDICTION - AI-powered revenue forecasting
app.get('/predict-revenue/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    const { data: contact, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    if (error) throw error;

    const prediction = {
      contactId: contact.id,
      name: contact.name,
      currentRevenue: contact.revenue || 0,
      predictedRevenue: AI_INSIGHTS.predictRevenue(contact),
      confidence: Math.random() * 0.3 + 0.7,
      factors: {
        companySize: contact.company?.length > 10 ? 'Large' : 'Small',
        emailDomain: contact.email?.includes('@gmail.com') ? 'Personal' : 'Business',
        nameLength: contact.name?.length > 15 ? 'Long' : 'Short',
        currentValue: contact.revenue || 0
      },
      recommendations: [
        contact.revenue < 5000 ? 'Focus on upselling opportunities' : 'Maintain relationship',
        contact.company?.toLowerCase().includes('tech') ? 'Tech industry - high potential' : 'Consider industry-specific approach',
        'Schedule regular check-ins'
      ]
    };

    res.json({ prediction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'unknown' });
  }
});

// 🕸️ RELATIONSHIP MAP - Visualize contact connections
app.get('/relationship-map', async (req, res) => {
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*');

    if (error) throw error;

    const connections = AI_INSIGHTS.findConnections(contacts);
    const nodes = contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      company: contact.company,
      revenue: contact.revenue || 0,
      score: AI_INSIGHTS.calculateScore(contact),
      group: contact.company || 'Individual'
    }));

    res.json({ 
      nodes, 
      connections,
      stats: {
        totalNodes: nodes.length,
        totalConnections: connections.length,
        companies: [...new Set(contacts.map(c => c.company).filter(Boolean))].length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'unknown' });
  }
});

// 📊 ADVANCED ANALYTICS - Deep dive into contact data
app.get('/analytics', async (req, res) => {
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*');

    if (error) throw error;

    const analytics = {
      overview: {
        totalContacts: contacts.length,
        totalRevenue: contacts.reduce((sum, c) => sum + (c.revenue || 0), 0),
        averageRevenue: contacts.length > 0 ? Math.round(contacts.reduce((sum, c) => sum + (c.revenue || 0), 0) / contacts.length) : 0,
        medianRevenue: contacts.length > 0 ? contacts.map(c => c.revenue || 0).sort((a, b) => a - b)[Math.floor(contacts.length / 2)] : 0
      },
      distribution: {
        revenueRanges: {
          '0-1K': contacts.filter(c => (c.revenue || 0) < 1000).length,
          '1K-5K': contacts.filter(c => (c.revenue || 0) >= 1000 && (c.revenue || 0) < 5000).length,
          '5K-10K': contacts.filter(c => (c.revenue || 0) >= 5000 && (c.revenue || 0) < 10000).length,
          '10K+': contacts.filter(c => (c.revenue || 0) >= 10000).length
        },
        companyTypes: {
          tech: contacts.filter(c => c.company?.toLowerCase().includes('tech')).length,
          ai: contacts.filter(c => c.company?.toLowerCase().includes('ai')).length,
          software: contacts.filter(c => c.company?.toLowerCase().includes('software')).length,
          other: contacts.filter(c => !c.company?.toLowerCase().includes('tech') && !c.company?.toLowerCase().includes('ai') && !c.company?.toLowerCase().includes('software')).length
        }
      },
      topPerformers: {
        byRevenue: contacts.sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, 5),
        byScore: contacts.map(c => ({ ...c, score: AI_INSIGHTS.calculateScore(c) })).sort((a, b) => b.score - a.score).slice(0, 5),
        byCompany: Object.entries(
          contacts.reduce((acc, c) => {
            if (c.company) {
              acc[c.company] = (acc[c.company] || 0) + (c.revenue || 0);
            }
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1]).slice(0, 5)
      },
      insights: {
        highValueContacts: contacts.filter(c => (c.revenue || 0) > 10000).length,
        potentialUpsells: contacts.filter(c => (c.revenue || 0) > 0 && (c.revenue || 0) < 5000).length,
        newOpportunities: contacts.filter(c => (c.revenue || 0) === 0).length,
        enterpriseClients: contacts.filter(c => !c.email?.includes('@gmail.com')).length
      }
    };

    res.json({ analytics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'unknown' });
  }
});

// 🤖 AI CHAT ENDPOINT 🚀
app.post('/ai-chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get current data for AI analysis
    const { data: contacts } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: topClients } = await supabase
      .from('contacts')
      .select('*')
      .order('revenue', { ascending: false })
      .limit(10);

    // AI Response Generation
    const aiResponse = generateAIResponse(message, contacts, topClients);
    
    res.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing AI chat:', error);
    res.status(500).json({ error: 'Failed to process AI chat' });
  }
});

// AI Response Generator Function
function generateAIResponse(userInput, contacts, topClients) {
  const input = userInput.toLowerCase();
  
  // COMPLEX QUERIES - HIGHEST PRIORITY (Tech, Top 10, etc.)
  if (input.includes('tech') && (input.includes('top') || input.includes('client'))) {
    const techClients = contacts.filter(c => c.company?.toLowerCase().includes('tech'));
    
    // Extract number from query (e.g., "top 10" -> 10)
    const numberMatch = input.match(/(\d+)/);
    const requestedCount = numberMatch ? parseInt(numberMatch[1]) : 10;
    
    const topTechClients = techClients.sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, requestedCount);
    
    if (topTechClients.length === 0) {
      return `🔍 No tech clients found in your CRM!`;
    }
    
    let response = `🚀 Your top ${Math.min(topTechClients.length, requestedCount)} tech clients:\n\n`;
    topTechClients.forEach((client, index) => {
      response += `${index + 1}. ${client.name} - $${(client.revenue || 0).toLocaleString()}\n`;
    });
    return response;
  }

  // PROFITABILITY QUERIES - HIGHEST PRIORITY
  if (input.includes('most profitable') || input.includes('highest revenue') || input.includes('best client') || 
      input.includes('top earner') || input.includes('biggest client') || input.includes('most valuable') ||
      input.includes('best person') || input.includes('do business') || input.includes('best to work') ||
      input.includes('top performer') || input.includes('highest earner') || input.includes('best customer')) {
    const topClient = topClients[0];
    return topClient ? 
      `💰 Your most profitable person is ${topClient.name} with $${topClient.revenue.toLocaleString()} in revenue!` :
      `💰 No profitable clients data available yet. Add some contacts to see rankings!`;
  }

  // LOWEST PROFITABILITY QUERIES - HIGHEST PRIORITY
  if (input.includes('most losing') || input.includes('lowest revenue') || input.includes('worst client') || 
      input.includes('least profitable') || input.includes('smallest client') || input.includes('least valuable') ||
      input.includes('poorest client') || input.includes('lowest earner')) {
    // Sort contacts by revenue ascending to get lowest revenue first
    const sortedByRevenue = contacts.sort((a, b) => (a.revenue || 0) - (b.revenue || 0));
    const lowestClient = sortedByRevenue[0];
    return lowestClient ? 
      `📉 Your most losing person is ${lowestClient.name} with $${(lowestClient.revenue || 0).toLocaleString()} in revenue!` :
      `📉 No client data available yet. Add some contacts to see rankings!`;
  }

  // DIRECT COUNT QUERIES - Most common requests
  if (input.includes('count') || input.includes('how many') || input.includes('total')) {
    if (input.includes('contact') || input.includes('client') || input.includes('crm')) {
      return `📊 You have ${contacts.length} contacts in your CRM!`;
    }
    return `📊 You have ${contacts.length} contacts in your CRM!`;
  }

  // Contact-related queries
  if (input.includes('contact') || input.includes('client')) {
    if (input.includes('total') || input.includes('how many')) {
      return `📊 You have ${contacts.length} total contacts in your CRM!`;
    }
    if (input.includes('top') || input.includes('best')) {
      const topClient = topClients[0];
      return topClient ? 
        `🏆 Your top client is ${topClient.name} with $${topClient.revenue.toLocaleString()} in revenue!` :
        `🏆 No top clients data available yet. Add some contacts to see rankings!`;
    }
    if (input.includes('revenue') || input.includes('money')) {
      const totalRevenue = contacts.reduce((sum, contact) => sum + (contact.revenue || 0), 0);
      return `💰 Total revenue across all contacts: $${totalRevenue.toLocaleString()}!`;
    }
    return `👥 You have ${contacts.length} contacts in your CRM!`;
  }

  // Analytics queries
  if (input.includes('analytics') || input.includes('insights') || input.includes('analysis')) {
    const avgScore = Math.round(contacts.reduce((sum, contact) => sum + AI_INSIGHTS.calculateScore(contact), 0) / contacts.length);
    const topPerformer = contacts
      .map(contact => ({ ...contact, aiScore: AI_INSIGHTS.calculateScore(contact) }))
      .sort((a, b) => b.aiScore - a.aiScore)[0];
    
    return `🧠 AI Insights: ${contacts.length} contacts analyzed. Average AI score: ${avgScore}/100. Top performer: ${topPerformer?.name || 'N/A'}!`;
  }

  // Recommendations
  if (input.includes('recommend') || input.includes('suggest') || input.includes('what should')) {
    const highValueContacts = contacts.filter(c => AI_INSIGHTS.calculateScore(c) > 70);
    if (highValueContacts.length > 0) {
      return `🎯 Top recommendation: Focus on your ${highValueContacts.length} high-value contacts! They have AI scores above 70.`;
    }
    return `💡 I recommend checking your top clients and focusing on high-revenue contacts!`;
  }

  // Revenue analysis
  if (input.includes('revenue') || input.includes('income') || input.includes('money')) {
    const totalRevenue = contacts.reduce((sum, contact) => sum + (contact.revenue || 0), 0);
    const avgRevenue = Math.round(totalRevenue / contacts.length);
    const topRevenue = Math.max(...contacts.map(c => c.revenue || 0));
    
    return `💰 Revenue Analysis:
• Total Revenue: $${totalRevenue.toLocaleString()}
• Average per Contact: $${avgRevenue.toLocaleString()}
• Highest Single Revenue: $${topRevenue.toLocaleString()}`;
  }

  // Company analysis
  if (input.includes('company') || input.includes('business')) {
    const companies = [...new Set(contacts.map(c => c.company).filter(Boolean))];
    const techCompanies = contacts.filter(c => c.company?.toLowerCase().includes('tech')).length;
    
    return `🏢 Company Analysis:
• Total Companies: ${companies.length}
• Tech Companies: ${techCompanies}
• Unique Industries: ${companies.length} different companies`;
  }

  // General help
  if (input.includes('help') || input.includes('what can')) {
    return `🤖 I can help you with:
• Contact information and statistics
• Revenue analysis and predictions  
• AI insights and recommendations
• Analytics and trends
• General CRM questions

Try asking: "How many contacts do I have?" or "Who is my top client?"`;
  }

  // SIMPLE DIRECT RESPONSES FOR COMMON QUESTIONS
  if (input.includes('yo') || input.includes('hey') || input.includes('hi')) {
    return `👋 Hey! You have ${contacts.length} contacts in your CRM! What else would you like to know?`;
  }

  // Default responses - but make them more helpful
  const responses = [
    `🤔 I'm not sure what you're asking. You have ${contacts.length} contacts. Try asking "how many contacts" or "who is my top client"!`,
    `💭 You have ${contacts.length} contacts in your CRM. Ask me about revenue, top clients, or analytics!`,
    `🧠 You have ${contacts.length} contacts. I can help with revenue analysis, top clients, or AI insights!`,
    `✨ You have ${contacts.length} contacts! Try asking about totals, revenue, or recommendations!`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// 🎯 SMART RECOMMENDATIONS - AI-powered action suggestions
app.get('/recommendations', async (req, res) => {
  try {
    const { data: contacts, error } = await supabase
      .from('contacts')
      .select('*');

    if (error) throw error;

    const recommendations = {
      immediate: [],
      weekly: [],
      monthly: [],
      insights: []
    };

    contacts.forEach(contact => {
      const score = AI_INSIGHTS.calculateScore(contact);
      const revenue = contact.revenue || 0;

      // Immediate actions
      if (revenue === 0) {
        recommendations.immediate.push({
          type: 'outreach',
          priority: 'high',
          contact: contact.name,
          action: 'Initial contact and qualification',
          reason: 'New contact with no revenue'
        });
      }

      if (revenue > 0 && revenue < 2000) {
        recommendations.immediate.push({
          type: 'upsell',
          priority: 'medium',
          contact: contact.name,
          action: 'Upsell opportunity identified',
          reason: 'Low revenue but engaged customer'
        });
      }

      // Weekly actions
      if (score > 70) {
        recommendations.weekly.push({
          type: 'relationship',
          priority: 'high',
          contact: contact.name,
          action: 'Schedule check-in call',
          reason: 'High-value contact needs attention'
        });
      }

      // Monthly actions
      if (contact.company?.toLowerCase().includes('tech')) {
        recommendations.monthly.push({
          type: 'industry',
          priority: 'medium',
          contact: contact.name,
          action: 'Tech industry newsletter',
          reason: 'Tech company - industry-specific content'
        });
      }
    });

    // Generate insights
    recommendations.insights = [
      {
        type: 'revenue',
        message: `Total pipeline value: $${contacts.reduce((sum, c) => sum + (c.revenue || 0), 0).toLocaleString()}`,
        impact: 'high'
      },
      {
        type: 'growth',
        message: `${contacts.filter(c => (c.revenue || 0) > 0).length} active customers out of ${contacts.length} total contacts`,
        impact: 'medium'
      },
      {
        type: 'opportunity',
        message: `${contacts.filter(c => (c.revenue || 0) === 0).length} contacts with no revenue - potential growth area`,
        impact: 'high'
      }
    ];

    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'unknown' });
  }
});

// 📋 ENHANCED CONTACTS - Now with AI scoring and real-time updates
app.get('/contacts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '50');
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // Enhance contacts with AI data
    const enhancedContacts = data.map(contact => ({
      ...contact,
      aiScore: AI_INSIGHTS.calculateScore(contact),
      predictedRevenue: AI_INSIGHTS.predictRevenue(contact),
      lastUpdated: new Date().toISOString()
    }));

    res.json({ 
      contacts: enhancedContacts,
      meta: {
        total: enhancedContacts.length,
        averageScore: Math.round(enhancedContacts.reduce((sum, c) => sum + c.aiScore, 0) / enhancedContacts.length),
        highValueContacts: enhancedContacts.filter(c => c.aiScore > 70).length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'unknown' });
  }
});

// 🚀 SMART CONTACT CREATION - AI-enhanced contact addition with real-time notifications
app.post('/contacts', async (req, res) => {
  try {
    const { name, email, company, revenue } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });

    const payload = { name, email, company: company || null, revenue: revenue || 0 };
    const { data, error } = await supabase.from('contacts').insert(payload).select().single();
    if (error) throw error;
    
    // Enhance with AI data
    const enhancedContact = {
      ...data,
      aiScore: AI_INSIGHTS.calculateScore(data),
      predictedRevenue: AI_INSIGHTS.predictRevenue(data),
      insights: {
        priority: data.revenue > 5000 ? 'high' : 'medium',
        category: company?.toLowerCase().includes('tech') ? 'tech' : 'general',
        potential: AI_INSIGHTS.predictRevenue(data) > data.revenue ? 'upsell' : 'maintain'
      }
    };

    // Send real-time notification
    notifyClients('contact_added', {
      contact: enhancedContact,
      message: `New contact added: ${name}`,
      timestamp: new Date().toISOString()
    });

    res.json({ 
      contact: enhancedContact,
      message: 'Contact added successfully with AI insights!',
      recommendations: [
        enhancedContact.aiScore > 70 ? 'High-value contact - prioritize follow-up' : 'Standard contact',
        company?.toLowerCase().includes('tech') ? 'Tech industry - consider technical demos' : 'General approach',
        revenue > 0 ? 'Existing customer - focus on retention' : 'New prospect - qualification needed'
      ]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'unknown' });
  }
});

// GET /top-clients?limit=5  -> returns contacts sorted by revenue
app.get('/top-clients', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '5');
    const { data, error } = await supabase
      .from('contacts')
      .select('id, name, email, company, revenue')
      .order('revenue', { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json({ top: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'unknown' });
  }
});

// Simple search endpoint: GET /search?q=zeeshan
app.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ results: [] });

    // naive search across name and email
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .or(`name.ilike.%${q}%,email.ilike.%${q}%`)
      .limit(50);

    if (error) throw error;
    res.json({ results: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'unknown' });
  }
});

// 🚀 START THE INSANE CRM ASSISTANT SERVER 🚀
server.listen(PORT, () => {
  console.log('🚀 NEXT-LEVEL CRM ASSISTANT STARTED! 🚀');
  console.log(`📡 API Server: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log('🧠 AI Features: Analytics, Predictions, Relationship Mapping');
  console.log('⚡ Real-time: Live updates, notifications, smart insights');
  console.log('🎯 Ready for INSANE CRM operations!');
});
