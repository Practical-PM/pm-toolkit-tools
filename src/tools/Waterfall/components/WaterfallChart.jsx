import { useEffect, useRef, useMemo } from 'react'
import * as d3 from 'd3'
import { IconButton } from '@toolkit-pm/design-system/components'
import { formatValue } from '../utils/formatting'
import './WaterfallChart.css'

export function WaterfallChart({
  initiatives,
  baseline,
  target,
  metricType,
  currency,
  waterfallName,
  isReverse,
  onConfigClick,
}) {
  const svgRef = useRef(null)
  const fontFamily = useMemo(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--font-body').trim() || "'Fugaz One', cursive"
  }, [])

  const chartColors = useMemo(
    () => ({
      error: getComputedStyle(document.documentElement).getPropertyValue('--error').trim() || 'rgb(239, 68, 68)',
      success: getComputedStyle(document.documentElement).getPropertyValue('--success').trim() || 'rgb(16, 185, 129)',
      warning: getComputedStyle(document.documentElement).getPropertyValue('--warning').trim() || 'rgb(245, 158, 11)',
      textPrimary: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || 'rgb(243, 244, 246)',
      textSecondary: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || 'rgb(209, 213, 219)',
      textTertiary: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() || 'rgb(156, 163, 175)',
      borderMedium: getComputedStyle(document.documentElement).getPropertyValue('--border-medium').trim() || 'rgb(71, 85, 105)',
    }),
    []
  )

  const chartData = useMemo(() => {
    const data = []
    let currentY = baseline

    // Baseline bar is hidden, but we still use baseline as the starting point for initiatives
    // if (baseline !== 0) {
    //   // Baseline should start from 0 (top) and extend to the baseline value
    //   data.push({
    //     name: 'Baseline',
    //     value: baseline,
    //     cumulative: baseline,
    //     startY: 0,
    //     endY: baseline,
    //   })
    //   currentY = baseline
    // }

    initiatives.forEach((initiative) => {
      const startY = currentY
      currentY += initiative.valueChange
      data.push({
        name: initiative.name,
        value: initiative.valueChange,
        cumulative: currentY,
        startY,
        endY: currentY,
      })
    })

    return data
  }, [initiatives, baseline])

  const { minValue, maxValue } = useMemo(() => {
    const values = [baseline]
    // Include all cumulative values from initiatives
    chartData.forEach((d) => {
      values.push(d.startY, d.endY, d.cumulative)
    })
    if (target !== null) {
      values.push(target)
    }
    const max = Math.max(...values)
    const min = Math.min(...values)
    // Add padding (10% of range) for better visualization, but don't force to zero
    const range = max - min
    const padding = range * 0.1
    return { minValue: min - padding, maxValue: max + padding }
  }, [chartData, baseline, target])

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // D3 margin convention
    const margin = { top: 60, right: 40, bottom: 120, left: 80 }
    const chartHeight = 500
    const numBars = chartData.length

    // Calculate chart width adaptively
    const minBarWidth = 60
    const barSpacing = 20
    const minChartWidth = 600
    const chartWidth = Math.max(
      minChartWidth,
      numBars * (minBarWidth + barSpacing) + margin.left + margin.right + (target ? 120 : 0)
    )

    const innerWidth = chartWidth - margin.left - margin.right
    const innerHeight = chartHeight - margin.top - margin.bottom

    // Set SVG dimensions
    svg.attr('width', chartWidth).attr('height', chartHeight).attr('viewBox', `0 0 ${chartWidth} ${chartHeight}`)

    // Create scales
    const yScale = d3.scaleLinear().domain([minValue, maxValue]).range([innerHeight, 0])

    // X scale using scaleBand for better control
    const xScale = d3
      .scaleBand()
      .domain(chartData.map((_, i) => i.toString()))
      .range([0, innerWidth])
      .paddingInner(0.2)
      .paddingOuter(0.1)

    // Main group with margin transform
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Y-axis using D3 axis generator
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => formatValue(Number(d), metricType, currency))
      .tickSizeInner(0)
      .tickSizeOuter(0)

    const yAxisGroup = g.append('g').call(yAxis)

    // Style Y-axis
    yAxisGroup.select('.domain').attr('stroke', chartColors.borderMedium).attr('stroke-width', 2)
    yAxisGroup.selectAll('.tick line').remove()
    yAxisGroup
      .selectAll('.tick text')
      .attr('fill', chartColors.textTertiary)
      .attr('font-size', 12)
      .attr('font-weight', 500)
      .attr('font-family', fontFamily)

    // X-axis line
    g.append('line')
      .attr('x1', 0)
      .attr('y1', innerHeight)
      .attr('x2', innerWidth)
      .attr('y2', innerHeight)
      .attr('stroke', chartColors.borderMedium)
      .attr('stroke-width', 2)

    // Bars using D3 data binding
    const bars = g
      .selectAll('.bar-group')
      .data(chartData)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (_d, i) => {
        const x = xScale(i.toString())
        return x !== undefined ? `translate(${x}, 0)` : 'translate(0, 0)'
      })

    bars.each(function (d) {
      const barGroup = d3.select(this)
      const isBaseline = d.name === 'Baseline'
      const isPositive = d.value >= 0
      const bandwidth = xScale.bandwidth()
      
      // Calculate bar position: In SVG, Y increases downward
      // For positive values: bar extends upward (from startY to endY, where endY > startY)
      // For negative values: bar extends downward (from startY to endY, where endY < startY)
      // The bar should always start at startY (the previous cumulative) and extend to endY (the new cumulative)
      const barStartY = yScale(d.startY) // SVG Y coordinate for start (previous cumulative)
      const barEndY = yScale(d.endY)     // SVG Y coordinate for end (new cumulative)
      const barHeight = Math.abs(barStartY - barEndY)
      // barY is the top of the bar in SVG coordinates (smaller Y value = higher on screen)
      const barY = Math.min(barStartY, barEndY)

      // Bar color logic: in reverse mode, negative values (reductions) are good (green)
      let barColor = chartColors.warning
      if (!isBaseline) {
        if (isReverse) {
          // Reverse mode: negative = good (green), positive = bad (red)
          barColor = isPositive ? chartColors.error : chartColors.success
        } else {
          // Normal mode: positive = good (green), negative = bad (red)
          barColor = isPositive ? chartColors.success : chartColors.error
        }
      }

      // Bar rectangle
      barGroup
        .append('rect')
        .attr('y', barY)
        .attr('width', bandwidth)
        .attr('height', barHeight)
        .attr('fill', barColor)
        .attr('rx', 4)
        .attr('class', 'waterfall-bar')

      // Value label on bar - always show sign for clarity
      if (d.value !== 0) {
        const sign = d.value >= 0 ? '+' : ''
        barGroup
          .append('text')
          .attr('x', bandwidth / 2)
          .attr('y', barY - 8)
          .attr('text-anchor', 'middle')
          .attr('font-size', 13)
          .attr('fill', chartColors.textPrimary)
          .attr('font-weight', 700)
          .attr('font-family', fontFamily)
          .text(sign + formatValue(d.value, metricType, currency))
      }

      // X-axis label (rotated and wrapped)
      const labelGroup = barGroup
        .append('g')
        .attr('transform', `translate(${bandwidth / 2}, ${innerHeight + 50}) rotate(-45)`)

      const words = d.name.split(' ')
      const maxCharsPerLine = 12
      const lines = []
      let currentLine = ''

      words.forEach((word) => {
        if (currentLine === '') {
          currentLine = word
        } else if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
          currentLine += ' ' + word
        } else {
          lines.push(currentLine)
          currentLine = word
        }
      })
      if (currentLine) {
        lines.push(currentLine)
      }

      const labelText = labelGroup
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('font-size', 14)
        .attr('fill', chartColors.textSecondary)
        .attr('font-weight', 500)
        .attr('font-family', fontFamily)
        .attr('class', 'x-axis-label')

      lines.forEach((line, lineIndex) => {
        labelText
          .append('tspan')
          .attr('x', 0)
          .attr('dy', lineIndex === 0 ? '0' : '1.2em')
          .attr('text-anchor', 'middle')
          .text(line)
      })
    })

    // Connecting lines between bars
    if (chartData.length > 1) {
      g.selectAll('.connector')
        .data(chartData.slice(0, -1))
        .enter()
        .append('line')
        .attr('class', 'connector')
        .attr('x1', (_d, i) => {
          const x = xScale(i.toString())
          return x !== undefined ? x + xScale.bandwidth() : 0
        })
        .attr('y1', (d) => yScale(d.cumulative))
        .attr('x2', (_d, i) => {
          const x = xScale((i + 1).toString())
          return x !== undefined ? x : 0
        })
        .attr('y2', (d) => yScale(d.cumulative))
        .attr('stroke', chartColors.textTertiary)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4 4')
    }

    // Target line
    if (target !== null) {
      const targetGroup = g.append('g').attr('class', 'target-line')
      const targetY = yScale(target)

      targetGroup
        .append('line')
        .attr('x1', 0)
        .attr('y1', targetY)
        .attr('x2', innerWidth)
        .attr('y2', targetY)
        .attr('stroke', chartColors.warning)
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '8 4')
        .attr('opacity', 0.8)

      const targetLabelText = `Target: ${formatValue(target, metricType, currency)}`
      const targetLabelWidth = targetLabelText.length * 7 + 20
      targetGroup
        .append('text')
        .attr('x', innerWidth + 10)
        .attr('y', targetY + 4)
        .attr('font-size', 13)
        .attr('fill', chartColors.warning)
        .attr('font-weight', 700)
        .attr('font-family', fontFamily)
        .text(targetLabelText)

      // Adjust chart width if target label needs more space
      if (targetLabelWidth > 40) {
        const newChartWidth = chartWidth + (targetLabelWidth - 40)
        svg.attr('width', newChartWidth).attr('viewBox', `0 0 ${newChartWidth} ${chartHeight}`)
      }
    }
  }, [chartData, baseline, target, metricType, currency, minValue, maxValue, isReverse, fontFamily, chartColors])

  return (
    <div className="waterfall-chart">
      <div className="chart-header">
        <div className="chart-header-left">
          <h2 className="ds-type">{waterfallName}</h2>
        </div>
        {onConfigClick && (
          <IconButton
            icon="⚙"
            label="Configure waterfall"
            variant="default"
            className="chart-config-button"
            onClick={onConfigClick}
          />
        )}
      </div>
      <div className="chart-container">
        <svg ref={svgRef} className="chart-svg" />
      </div>
    </div>
  )
}
