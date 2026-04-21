import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BuildVsBuy from './tools/BuildVsBuy/BuildVsBuy';
import CognitiveLoad from './tools/CognitiveLoad/CognitiveLoad';
import DoubleDiamond from './tools/DoubleDiamond/DoubleDiamond';
import KanoModel from './tools/KanoModel/KanoModel';
import ProductCompetencies from './tools/ProductCompetencies/ProductCompetencies';
import StoryMap from './tools/StoryMap/StoryMap';
import TechDebtROI from './tools/TechDebtROI/TechDebtROI';
import Waterfall from './tools/Waterfall/Waterfall';
import CostOfDelay from './tools/CostOfDelay/CostOfDelay';
import UnitEconomics from './tools/UnitEconomics/UnitEconomics';
import BreadthVsDepth from './tools/BreadthVsDepth/BreadthVsDepth';
import './App.css';

function App() {
  return (
    <Router basename="/tools">
      <AppContent />
    </Router>
  );
}

function AppContent() {
  return (
    <div className="app practice-mode">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ToolsLanding />} />
          <Route path="/build-vs-buy" element={<BuildVsBuy />} />
          <Route path="/cognitive-load" element={<CognitiveLoad />} />
          <Route path="/double-diamond" element={<DoubleDiamond />} />
          <Route path="/kano-model" element={<KanoModel />} />
          <Route path="/product-competencies" element={<ProductCompetencies />} />
          <Route path="/story-map" element={<StoryMap />} />
          <Route path="/tech-debt-roi" element={<TechDebtROI />} />
          <Route path="/waterfall" element={<Waterfall />} />
          <Route path="/cost-of-delay" element={<CostOfDelay />} />
          <Route path="/unit-economics" element={<UnitEconomics />} />
          <Route path="/breadth-vs-depth" element={<BreadthVsDepth />} />
        </Routes>
      </main>

      <footer className="app-footer animate-slide-bottom stagger-4">
        <p className="ds-type">
          Part of <strong>The PM Toolkit</strong> - A collection of practical product management tools
        </p>
        <p className="footer-links ds-type">
          <a href="https://practicalpm.tools/" className="ds-type">&larr; Back to Toolkit</a>
          {" • "}
          <a href="https://github.com/Practical-PM" target="_blank" rel="noopener noreferrer" className="ds-type">
            Open Source on GitHub - Fork &amp; Download
          </a>
        </p>
        <div className="footer-social">
          <a href="https://www.linkedin.com/in/geranbutcher/" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn" aria-label="LinkedIn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="https://github.com/Practical-PM" target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub" aria-label="GitHub">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

function ToolsLanding() {
  const tools = [
    {
      id: 'breadth-vs-depth',
      title: 'Breadth vs Depth',
      description: 'Score whether to broaden into new segments or double down deeply where you already have traction.',
      icon: '🧭',
      path: '/breadth-vs-depth'
    },
    {
      id: 'build-vs-buy',
      title: 'Build vs Buy Decision Framework',
      description: 'Map your technical domains to strategic quadrants and make informed build/buy decisions.',
      icon: '🏗️',
      path: '/build-vs-buy'
    },
    {
      id: 'cognitive-load',
      title: 'Cognitive Load Calculator',
      description: 'Visualize and analyze team cognitive load across systems, collaborations, team size, and skillsets.',
      icon: '🧠',
      path: '/cognitive-load'
    },
    {
      id: 'double-diamond',
      title: 'Double Diamond',
      description: 'Structure decision making across discovery, definition, development, and test selection.',
      icon: '💎',
      path: '/double-diamond'
    },
    {
      id: 'kano-model',
      title: 'Kano Model - Musts, Wants, Exciters',
      description: 'See how feature fulfillment shifts user satisfaction across the Kano model.',
      icon: '📈',
      path: '/kano-model'
    },
    {
      id: 'product-competencies',
      title: 'Product Competencies Assessment',
      description: 'Self-assess PM competencies with an interactive radar chart and personalised insights.',
      icon: '🎯',
      path: '/product-competencies'
    },
    {
      id: 'story-map',
      title: 'Story Map',
      description: 'Visualize how features and themes evolve across iterations with activities, stories, and releases.',
      icon: '🗂️',
      path: '/story-map'
    },
    {
      id: 'tech-debt-roi',
      title: 'Tech Debt ROI Calculator',
      description: 'Quantify velocity drag, opportunity cost, and payback for technical debt investment decisions.',
      icon: '🧾',
      path: '/tech-debt-roi'
    },
    {
      id: 'waterfall',
      title: 'Waterfall Chart Visualization',
      description: 'Build interactive waterfall charts for any metric — currency, percentage, or raw numbers.',
      icon: '📊',
      path: '/waterfall'
    },
    {
      id: 'cost-of-delay',
      title: 'Cost of Delay and WSJF Prioritization',
      description: 'Quantify weekly delay cost, model scenarios, and rank opportunities using WSJF economics.',
      icon: '💸',
      path: '/cost-of-delay'
    },
    {
      id: 'unit-economics',
      title: 'Unit Economics',
      description: 'Understand fixed costs, variable costs, and P&L through break-even, LTV:CAC, and margin visualisations.',
      icon: '💰',
      path: '/unit-economics'
    }
  ];

  return (
    <div className="landing-page animate-fade-in">
      <div className="landing-header animate-fade-in stagger-1">
        <h1 className="ds-type">Tools</h1>
        <p className="landing-description ds-type">
          Interactive frameworks, canvases, and calculators to help you plan, prioritize, 
          and make better product decisions. Each tool includes explanations and hands-on components.
        </p>
      </div>

      <div className="tools-grid">
        {tools.map((tool, index) => (
          <Link key={tool.id} to={tool.path} className="tool-card ds-surface-card animate-fade-in" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
            <div className="tool-icon">{tool.icon}</div>
            <h3 className="tool-title ds-type">{tool.title}</h3>
            <p className="tool-description ds-type">{tool.description}</p>
            <div className="tool-link ds-type">
              Explore &rarr; 
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default App;
