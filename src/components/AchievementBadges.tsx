import { motion } from 'framer-motion'
import { Trophy, Star, Target, Zap } from 'lucide-react'
import { mockAchievements } from '../services/mockData'

interface AchievementBadgesProps {
  totalValue: number
  positionCount: number
}

export function AchievementBadges({ totalValue, positionCount }: AchievementBadgesProps) {
  const achievements = mockAchievements.map(achievement => {
    let progress = achievement.progress
    let unlocked = achievement.unlocked

    switch (achievement.id) {
      case '2':
        progress = positionCount
        unlocked = positionCount >= achievement.maxProgress
        break
      case '3':
        progress = totalValue
        unlocked = totalValue >= achievement.maxProgress
        break
    }

    return { ...achievement, progress, unlocked }
  })

  const getIcon = (achievementId: string) => {
    switch (achievementId) {
      case '1': return <Target className="w-5 h-5" />
      case '2': return <Star className="w-5 h-5" />
      case '3': return <Trophy className="w-5 h-5" />
      case '4': return <Zap className="w-5 h-5" />
      default: return <Trophy className="w-5 h-5" />
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
          <p className="text-gray-600">Gamified lending progress</p>
        </div>
        <Trophy className="w-6 h-6 text-yellow-500" />
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg border-2 transition-all ${
              achievement.unlocked
                ? 'bg-yellow-50 border-yellow-200 shadow-sm'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                achievement.unlocked 
                  ? 'bg-yellow-100 text-yellow-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {getIcon(achievement.id)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold ${
                    achievement.unlocked ? 'text-yellow-900' : 'text-gray-600'
                  }`}>
                    {achievement.title}
                  </h3>
                  {achievement.unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-2xl"
                    >
                      ✨
                    </motion.div>
                  )}
                </div>
                
                <p className={`text-sm mb-2 ${
                  achievement.unlocked ? 'text-yellow-800' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>

                {!achievement.unlocked && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>
                        {achievement.id === '3' 
                          ? `$${achievement.progress.toLocaleString()} / $${achievement.maxProgress.toLocaleString()}`
                          : `${achievement.progress} / ${achievement.maxProgress}`
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` 
                        }}
                        transition={{ duration: 0.5 }}
                        className="bg-primary-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <div className="text-center">
          <p className="text-sm text-primary-700 mb-1">Achievement Score</p>
          <p className="text-2xl font-bold text-primary-900">
            {achievements.filter(a => a.unlocked).length} / {achievements.length}
          </p>
        </div>
      </div>
    </div>
  )
}