import { useState, useEffect } from 'react'
import { Button, Modal, ModalActions, PageLayout, Tile, TitleBar, StatDisplay } from '@toolkit-pm/design-system/components'
import { InitiativeList } from './components/InitiativeList'
import { WaterfallChart } from './components/WaterfallChart'
import { ConfigModal } from './components/ConfigModal'
import {
  loadWaterfalls,
  saveWaterfall,
  createDefaultWaterfall,
  clearWaterfalls,
} from './services/storage'
import { formatValue } from './utils/formatting'
import './Waterfall.css'

function Waterfall() {
  const [waterfall, setWaterfall] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false)

  useEffect(() => {
    const savedWaterfalls = loadWaterfalls()
    
    if (savedWaterfalls.length === 0) {
      const defaultWaterfall = createDefaultWaterfall('Waterfall 1', 'number', 'USD')
      setWaterfall(defaultWaterfall)
      saveWaterfall(defaultWaterfall, 0)
    } else {
      // Selector removed: always load the first persisted waterfall.
      setWaterfall(savedWaterfalls[0])
    }
    
    setIsLoading(false)
  }, [])

  const handleWaterfallUpdate = (updatedWaterfall) => {
    setWaterfall(updatedWaterfall)
    saveWaterfall(updatedWaterfall, 0)
  }

  const handleInitiativesUpdate = (initiatives) => {
    const updatedWaterfall = { ...waterfall, initiatives }
    handleWaterfallUpdate(updatedWaterfall)
  }

  const handleGenerateExample = () => {
    if (
      waterfall &&
      waterfall.initiatives.length > 0 &&
      !window.confirm('Replace current waterfall data with an example scenario?')
    ) {
      return
    }

    const example = {
      ...createDefaultWaterfall('Q3 Revenue Plan', 'currency', 'USD'),
      baseline: 1000000,
      target: 1300000,
      initiatives: [
        { id: `initiative-${Date.now()}-1`, name: 'Price optimization', valueChange: 120000 },
        { id: `initiative-${Date.now()}-2`, name: 'Onboarding improvements', valueChange: 90000 },
        { id: `initiative-${Date.now()}-3`, name: 'Channel expansion', valueChange: 180000 },
        { id: `initiative-${Date.now()}-4`, name: 'Support automation', valueChange: -40000 },
      ],
    }

    setWaterfall(example)
    saveWaterfall(example, 0)
  }

  const handleReset = () => {
    if (!window.confirm('Reset all saved waterfalls and start with a blank chart?')) {
      return
    }
    clearWaterfalls()
    const defaultWaterfall = createDefaultWaterfall('Waterfall 1', 'number', 'USD')
    setWaterfall(defaultWaterfall)
    saveWaterfall(defaultWaterfall, 0)
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="waterfall-loading-state">
          <p>Loading...</p>
        </div>
      </PageLayout>
    )
  }

  if (!waterfall) {
    return (
      <PageLayout>
        <div className="waterfall-loading-state">
          <p>Waterfall unavailable. Please refresh the page.</p>
        </div>
      </PageLayout>
    )
  }

  const totalChange = waterfall.initiatives.reduce(
    (sum, item) => sum + item.valueChange,
    0
  )
  const finalValue = waterfall.baseline + totalChange
  const deltaToTarget = waterfall.target !== null
    ? finalValue - waterfall.target
    : totalChange
  const deltaPrefix = deltaToTarget >= 0 ? '+' : ''
  const deltaLabel = waterfall.target !== null ? 'Vs Target' : 'Change'
  const deltaDescription = waterfall.target !== null
    ? (deltaToTarget >= 0 ? 'Above target' : 'Below target')
    : 'From start'

  return (
    <PageLayout>
      <TitleBar
        title="Waterfall Visualization"
        actions={(
          <>
            <Button variant="walkthrough" onClick={() => setIsWalkthroughOpen(true)}>
              Walkthrough
            </Button>
            <Button variant="secondary" onClick={handleGenerateExample}>
              Generate Example
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Reset All Data
            </Button>
          </>
        )}
      />

      <div className="waterfall-workspace">
        <Tile className="stats-strip" compact>
          <StatDisplay
            label="Starting Value"
            value={formatValue(waterfall.baseline, waterfall.metricType, waterfall.currency)}
          />
          <StatDisplay
            label="Final Value"
            value={formatValue(finalValue, waterfall.metricType, waterfall.currency)}
          />
          <StatDisplay
            label={deltaLabel}
            value={`${deltaPrefix}${formatValue(deltaToTarget, waterfall.metricType, waterfall.currency)}`}
            description={deltaDescription}
            color={deltaToTarget >= 0 ? 'var(--success)' : 'var(--error)'}
          />
          {waterfall.target !== null && (
            <StatDisplay
              label="Target"
              value={formatValue(waterfall.target, waterfall.metricType, waterfall.currency)}
            />
          )}
        </Tile>

        <Tile className="chart-panel">
          <WaterfallChart
            initiatives={waterfall.initiatives}
            baseline={waterfall.baseline}
            target={waterfall.target}
            metricType={waterfall.metricType}
            currency={waterfall.currency}
            waterfallName={waterfall.name}
            isReverse={waterfall.isReverse}
            onConfigClick={() => setIsConfigModalOpen(true)}
          />
        </Tile>
      </div>

      <InitiativeList
        initiatives={waterfall.initiatives}
        onUpdate={handleInitiativesUpdate}
        metricType={waterfall.metricType}
        currency={waterfall.currency}
        isReverse={waterfall.isReverse}
      />

      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        waterfall={waterfall}
        onUpdate={handleWaterfallUpdate}
      />

      <Modal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        title="Waterfall Walkthrough"
      >
        <p>Use this workflow to model change from baseline to outcome.</p>
        <ol className="waterfall-walkthrough-list">
          <li>Start with Generate Example to see a complete realistic waterfall.</li>
          <li>Edit initiatives and reorder them to match your delivery sequence.</li>
          <li>Open chart settings to adjust baseline, target, metric, and direction.</li>
          <li>Use Reset All Data to clear local storage and start from scratch.</li>
        </ol>
        <ModalActions onCancel={() => setIsWalkthroughOpen(false)} cancelLabel="Close" />
      </Modal>
    </PageLayout>
  )
}

export default Waterfall
