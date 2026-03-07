import { Button, IconButton, Badge, TabBar } from '@toolkit-pm/design-system/components'
import './WaterfallTabs.css'

const metricTypeLabels = {
  currency: '$',
  percentage: '%',
  number: '#',
}

const metricTypeColors = {
  currency: '#10b981',
  percentage: '#ff8c42',
  number: '#f59e0b',
}

export function WaterfallTabs({
  waterfalls,
  activeIndex,
  onTabClick,
  onAddWaterfall,
  onDeleteWaterfall,
}) {
  const canAddMore = waterfalls.length < 3

  const tabs = waterfalls.map((waterfall, index) => ({
    id: waterfall.id,
    label: waterfall.name,
    badge: (
      <Badge
        color={metricTypeColors[waterfall.metricType]}
        title={waterfall.metricType}
      >
        {metricTypeLabels[waterfall.metricType]}
      </Badge>
    ),
    index,
  }))

  const activeTabId = waterfalls[activeIndex]?.id
  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  return (
    <div className="waterfall-tabs">
      <div className="waterfall-tabs-layout">
        <TabBar
          tabs={tabs}
          activeTab={activeTabId}
          onTabChange={(id) => {
            const selected = tabs.find((tab) => tab.id === id)
            if (selected) onTabClick(selected.index)
          }}
          className="waterfall-tabbar"
        />
        <div className="waterfall-tab-actions">
          {waterfalls.length > 1 && activeTab && (
            <IconButton
              icon="×"
              label="Delete active waterfall"
              variant="danger"
              size="sm"
              onClick={() => onDeleteWaterfall(activeTab.index)}
            />
          )}
          {canAddMore && (
            <Button variant="add" onClick={onAddWaterfall} title="Add waterfall">
              + Add
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
