import { useState } from 'react'
import {
  Tile,
  Button,
  IconButton,
  EmptyState,
  Input,
} from '@toolkit-pm/design-system/components'
import { formatValue, parseValue, getInputStep, getValueChangeLabel } from '../utils/formatting'
import './InitiativeList.css'

export function InitiativeList({
  initiatives,
  onUpdate,
  metricType,
  currency,
  isReverse,
}) {
  const [editingId, setEditingId] = useState(null)
  const [editingField, setEditingField] = useState(null)
  const [editingValue, setEditingValue] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleAdd = () => {
    const newInitiative = {
      id: `initiative-${Date.now()}`,
      name: 'New Initiative',
      valueChange: 0,
    }
    onUpdate([...initiatives, newInitiative])
    setEditingId(newInitiative.id)
    setEditingField('name')
  }

  const handleMoveUp = (index) => {
    if (index === 0) return
    const newInitiatives = [...initiatives]
    const temp = newInitiatives[index]
    newInitiatives[index] = newInitiatives[index - 1]
    newInitiatives[index - 1] = temp
    onUpdate(newInitiatives)
  }

  const handleMoveDown = (index) => {
    if (index === initiatives.length - 1) return
    const newInitiatives = [...initiatives]
    const temp = newInitiatives[index]
    newInitiatives[index] = newInitiatives[index + 1]
    newInitiatives[index + 1] = temp
    onUpdate(newInitiatives)
  }

  const handleDelete = (id) => {
    onUpdate(initiatives.filter((item) => item.id !== id))
  }

  const handleUpdate = (id, field, value) => {
    onUpdate(
      initiatives.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const handleNameBlur = (id, value) => {
    const trimmed = value.trim()
    if (trimmed) {
      handleUpdate(id, 'name', trimmed)
    } else {
      const original = initiatives.find((i) => i.id === id)
      if (original) {
        handleUpdate(id, 'name', original.name)
      }
    }
    setEditingId(null)
    setEditingField(null)
  }

  const handleValueChangeBlur = (id, value) => {
    const numValue = parseValue(value, metricType)
    handleUpdate(id, 'valueChange', numValue)
    setEditingId(null)
    setEditingField(null)
  }

  return (
    <Tile className="initiative-list">
      <div className="initiative-list-header">
        <div className="header-left">
          <IconButton
            icon={isCollapsed ? '▶' : '▼'}
            label={isCollapsed ? 'Expand' : 'Collapse'}
            variant="default"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
          <h2 className="ds-type">Initiatives</h2>
        </div>
        <Button variant="add" onClick={handleAdd}>
          + Add Initiative
        </Button>
      </div>

      {!isCollapsed && (
        <>
          <div className="initiatives-container">
            {initiatives.length === 0 ? (
              <EmptyState
                message='No initiatives yet. Click "Add Initiative" to get started.'
                actionLabel="Add Initiative"
                onAction={handleAdd}
              />
            ) : (
              <ul className="initiatives-list">
                {initiatives.map((item, index) => (
                  <li key={item.id} className="initiative-item">
                    <div className="initiative-number">{index + 1}</div>
                    <div className="initiative-content">
                      {editingId === item.id && editingField === 'name' ? (
                        <Input
                          type="text"
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onBlur={() => handleNameBlur(item.id, editingValue)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleNameBlur(item.id, editingValue)
                            } else if (e.key === 'Escape') {
                              setEditingId(null)
                              setEditingField(null)
                            }
                          }}
                          autoFocus
                          className="initiative-name-input"
                        />
                      ) : (
                        <h3
                          onClick={() => {
                            setEditingId(item.id)
                            setEditingField('name')
                            setEditingValue(item.name)
                          }}
                          className="initiative-name-editable"
                          title="Click to edit"
                        >
                          {item.name}
                        </h3>
                      )}
                      <div className="initiative-ratio">
                        <label>{getValueChangeLabel(metricType)}:</label>
                        {editingId === item.id && editingField === 'valueChange' ? (
                          <>
                            <Input
                              type="number"
                              step={getInputStep(metricType)}
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onBlur={() => handleValueChangeBlur(item.id, editingValue)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleValueChangeBlur(item.id, editingValue)
                                } else if (e.key === 'Escape') {
                                  setEditingId(null)
                                  setEditingField(null)
                                }
                              }}
                              autoFocus
                              className="initiative-ratio-input"
                              placeholder={isReverse ? 'Enter negative value for reduction' : ''}
                            />
                            {isReverse && (
                              <span className="reverse-hint">(Negative values = reductions)</span>
                            )}
                          </>
                        ) : (
                          <span
                            onClick={() => {
                              setEditingId(item.id)
                              setEditingField('valueChange')
                              setEditingValue(item.valueChange.toString())
                            }}
                            className="initiative-ratio-editable"
                            title="Click to edit"
                          >
                            {item.valueChange >= 0 ? '+' : ''}
                            {formatValue(item.valueChange, metricType, currency)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="initiative-actions">
                      <div className="reorder-buttons">
                        <IconButton
                          icon="↑"
                          label="Move up"
                          variant="primary"
                          size="sm"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                        />
                        <IconButton
                          icon="↓"
                          label="Move down"
                          variant="primary"
                          size="sm"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === initiatives.length - 1}
                        />
                      </div>
                      <IconButton
                        icon="×"
                        label="Delete initiative"
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </Tile>
  )
}
