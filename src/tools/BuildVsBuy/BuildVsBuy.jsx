import { useState, useEffect } from 'react';
import { PageLayout, Tile, TitleBar, Button, WelcomeBanner, ToggleBox } from '@toolkit-pm/design-system/components';
import BuildVsBuyGrid from './components/BuildVsBuyGrid';
import DomainModal from './components/DomainModal';
import Recommendations from './components/Recommendations';
import { defaultDomains } from './utils/defaultDomains';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './utils/storage';
import { useTour } from './hooks/useTour';
import 'shepherd.js/dist/css/shepherd.css';
import './BuildVsBuy.css';
import './components/Tour.css';

const seoFaqItems = [
  {
    question: 'What is a build vs buy framework?',
    answer:
      'A build vs buy framework helps product and engineering teams decide whether to build a capability internally, buy a third-party solution, or run further discovery first.',
  },
  {
    question: 'How do you decide between build vs buy?',
    answer:
      'Plot each capability by strategic importance and implementation complexity. High-strategic and low-complexity areas are often strong build candidates, while low-strategic and high-complexity areas are often better buy candidates.',
  },
  {
    question: 'When should product teams build in-house?',
    answer:
      'Build in-house when a capability is core to your competitive advantage, requires unique workflows, or creates long-term strategic leverage that off-the-shelf tools cannot match.',
  },
  {
    question: 'When is buying a tool the better option?',
    answer:
      'Buying is often better when speed matters, the capability is not differentiating, and a mature solution already solves most requirements with acceptable integration effort.',
  },
];

function BuildVsBuy() {
  const [domains, setDomains] = useState([]);
  const [nextId, setNextId] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [showExamples, setShowExamples] = useState(false);
  const { startTour } = useTour();

  useEffect(() => {
    const previousTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute('content') || '';
    const canonical = document.querySelector('link[rel="canonical"]');
    const previousCanonical = canonical?.getAttribute('href') || '';

    document.title = 'Build vs Buy Framework Tool | Product Management Toolkit';

    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Use this build vs buy framework tool to map capabilities on a decision matrix, evaluate strategic fit, and make faster product and engineering investment decisions.'
      );
    } else {
      const createdMeta = document.createElement('meta');
      createdMeta.setAttribute('name', 'description');
      createdMeta.setAttribute(
        'content',
        'Use this build vs buy framework tool to map capabilities on a decision matrix, evaluate strategic fit, and make faster product and engineering investment decisions.'
      );
      document.head.appendChild(createdMeta);
    }

    if (canonical) {
      canonical.setAttribute('href', 'https://practicalpm.tools/tools/build-vs-buy');
    } else {
      const createdCanonical = document.createElement('link');
      createdCanonical.setAttribute('rel', 'canonical');
      createdCanonical.setAttribute('href', 'https://practicalpm.tools/tools/build-vs-buy');
      document.head.appendChild(createdCanonical);
    }

    const schemaId = 'build-vs-buy-schema';
    const existingSchema = document.getElementById(schemaId);
    if (existingSchema) existingSchema.remove();

    const schema = document.createElement('script');
    schema.id = schemaId;
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: 'Build vs Buy Framework Tool',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          url: 'https://practicalpm.tools/tools/build-vs-buy',
          description: 'Interactive build vs buy decision matrix for product and engineering teams.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          creator: {
            '@type': 'Organization',
            name: 'The PM Toolkit',
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: seoFaqItems.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    });
    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      const currentMetaDescription = document.querySelector('meta[name="description"]');
      if (currentMetaDescription) {
        if (previousDescription) {
          currentMetaDescription.setAttribute('content', previousDescription);
        } else {
          currentMetaDescription.remove();
        }
      }
      const currentCanonical = document.querySelector('link[rel="canonical"]');
      if (currentCanonical) {
        if (previousCanonical) {
          currentCanonical.setAttribute('href', previousCanonical);
        } else {
          currentCanonical.remove();
        }
      }
      const injectedSchema = document.getElementById(schemaId);
      if (injectedSchema) injectedSchema.remove();
    };
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved && saved.domains && saved.domains.length > 0) {
      setDomains(saved.domains);
      setNextId(saved.nextId || 6);
      setShowExamples(false);
    } else {
      setShowExamples(true);
    }
  }, []);

  // Save to localStorage whenever domains change
  useEffect(() => {
    if (domains.length > 0) {
      saveToLocalStorage({ domains, nextId });
    }
  }, [domains, nextId]);

  const handleOpenModal = () => {
    setEditingDomain(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDomain(null);
  };

  const handleSaveDomain = (domainData) => {
    if (editingDomain) {
      setDomains(domains.map(d => 
        d.id === editingDomain.id 
          ? { ...d, name: domainData.name, description: domainData.description }
          : d
      ));
    } else {
      const newDomain = {
        id: nextId,
        name: domainData.name,
        description: domainData.description,
        x: 4.5,
        y: 4.5,
      };
      setDomains([...domains, newDomain]);
      setNextId(nextId + 1);
    }
    handleCloseModal();
  };

  const handleUpdateDomain = (id, updates) => {
    setDomains(domains.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const handleDeleteDomain = (id) => {
    setDomains(domains.filter(d => d.id !== id));
  };

  const handleSelectDomain = (domain) => {
    setEditingDomain(domain);
    setIsModalOpen(true);
  };

  const handleLoadExamples = () => {
    setDomains(defaultDomains);
    setNextId(6);
    setShowExamples(false);
  };

  const handleGenerateExample = () => {
    if (domains.length > 0 && !window.confirm('Replace current domains with example data?')) {
      return;
    }
    handleLoadExamples();
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      clearLocalStorage();
      setDomains([]);
      setNextId(6);
      setShowExamples(true);
    }
  };

  return (
    <PageLayout>
      <TitleBar
        title="Build vs Buy"
        actions={
          <>
            <Button variant="walkthrough" onClick={startTour}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <text x="8" y="11.5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor">?</text>
              </svg>
              Walkthrough
            </Button>
            <Button variant="secondary" onClick={handleGenerateExample}>
              Generate Example
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Reset All Data
            </Button>
          </>
        }
      />

      <Tile className="build-vs-buy-seo-banner">
        <p className="seo-kicker">Build vs Buy Decision Matrix</p>
        <h1>Build vs Buy Framework for Product and Engineering Decisions</h1>
        <p className="seo-summary">
          Use this build vs buy tool to score each capability by strategic importance and implementation complexity,
          then prioritize what to build in-house, buy off-the-shelf, or validate before investing.
        </p>
        <ul className="seo-points">
          <li>Map domains visually on a practical build-vs-buy matrix.</li>
          <li>Surface recommendations based on domain positioning.</li>
          <li>Share clearer rationale with cross-functional stakeholders.</li>
        </ul>
      </Tile>

      {showExamples && (
        <WelcomeBanner
          title="Welcome!"
          description="Start by loading example domains to see how the framework works, or add your own domains."
          actionLabel="Load Example Domains"
          onAction={handleLoadExamples}
          className="welcome-banner"
        />
      )}

      <Tile className="grid-section">
        <div className="grid-header">
          <h2>Domain Mapping</h2>
          <Button variant="add" onClick={handleOpenModal}>
            + Add Domain
          </Button>
        </div>
        <BuildVsBuyGrid
          domains={domains}
          onUpdateDomain={handleUpdateDomain}
          onSelectDomain={handleSelectDomain}
        />
      </Tile>

      {domains.length > 0 && (
        <Recommendations domains={domains} />
      )}

      <Tile className="build-vs-buy-faq-section">
        <h2>Build vs Buy Framework FAQs</h2>
        <div className="faq-list">
          {seoFaqItems.map((faq) => (
            <ToggleBox key={faq.question} title={faq.question} className="build-vs-buy-faq-item">
              <p>{faq.answer}</p>
            </ToggleBox>
          ))}
        </div>
      </Tile>

      <DomainModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDomain}
        onDelete={handleDeleteDomain}
        editingDomain={editingDomain}
      />
    </PageLayout>
  );
}

export default BuildVsBuy;
