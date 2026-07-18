import MissionCard from './MissionCard'
import ArrowNavigation from './ArrowNavigation'

export default function MissionCarousel({
  missions,
  currentIndex,
  completedIds,
  onPrev,
  onNext,
}) {
  if (!missions.length) return null

  const mission = missions[currentIndex]
  const xpReward = 100 + currentIndex * 20
  const coinReward = 20 + currentIndex * 10

  return (
    <div className="ff-carousel">
      <ArrowNavigation direction="prev" onClick={onPrev} />

      <div className="ff-carousel__stage" key={mission.id}>
        <MissionCard
          mission={mission}
          index={currentIndex}
          isCompleted={completedIds.includes(mission.id)}
          xpReward={xpReward}
          coinReward={coinReward}
        />
      </div>

      <ArrowNavigation direction="next" onClick={onNext} />
    </div>
  )
}
