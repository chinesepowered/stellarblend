import { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { motion } from 'framer-motion'
import { PieChart, Move } from 'lucide-react'
import type { Position } from '../types'

interface PortfolioAllocationProps {
  positions: Position[]
  onUpdate: (positions: Position[]) => void
}

interface DragItem {
  type: string
  id: string
  index: number
}

function AllocationItem({ position, index, movePosition, positions }: {
  position: Position
  index: number
  movePosition: (dragIndex: number, hoverIndex: number) => void
  positions: Position[]
}) {
  const [{ isDragging }, drag] = useDrag({
    type: 'position',
    item: { type: 'position', id: position.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'position',
    hover: (item: DragItem) => {
      if (item.index !== index) {
        movePosition(item.index, index)
        item.index = index
      }
    },
  })

  const totalValue = positions.reduce((sum: number, p: Position) => sum + p.totalValue, 0)
  const percentage = (position.totalValue / totalValue) * 100

  return (
    <motion.div
      ref={(node: HTMLDivElement | null) => {
        drag(drop(node))
      }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-gray-300 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <Move className="w-4 h-4 text-gray-400" />
        <div>
          <h4 className="font-medium text-gray-900">{position.asset}</h4>
          <p className="text-sm text-gray-500">${position.totalValue.toLocaleString()}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">{percentage.toFixed(1)}%</p>
        <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export function PortfolioAllocation({ positions, onUpdate }: PortfolioAllocationProps) {
  const [localPositions, setLocalPositions] = useState(positions)

  const movePosition = (dragIndex: number, hoverIndex: number) => {
    const newPositions = [...localPositions]
    const draggedPosition = newPositions[dragIndex]
    newPositions.splice(dragIndex, 1)
    newPositions.splice(hoverIndex, 0, draggedPosition)
    
    setLocalPositions(newPositions)
    onUpdate(newPositions)
  }

  const totalValue = localPositions.reduce((sum, pos) => sum + pos.totalValue, 0)

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Portfolio Allocation</h2>
          <p className="text-gray-600">Drag to reorder positions</p>
        </div>
        <PieChart className="w-6 h-6 text-primary-600" />
      </div>

      <div className="space-y-3 mb-6">
        {localPositions.map((position, index) => (
          <AllocationItem
            key={position.id}
            position={position}
            index={index}
            movePosition={movePosition}
            positions={localPositions}
          />
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Total Portfolio Value</span>
          <span className="text-xl font-bold text-gray-900">${totalValue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}