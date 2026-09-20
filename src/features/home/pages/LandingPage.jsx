import { useRef, useEffect } from 'react'
import { useAuthStore } from '../../auth/store/authStore'
import MeetBollyHero from '../components/landing/MeetBollyHero'
import WhyBollySection from '../components/landing/WhyBollySection'
import LearnJourneySection from '../components/landing/LearnJourneySection'
import TryBollySection from '../components/landing/TryBollySection'

export default function LandingPage() {
  const whyBollyRef = useRef(null)
  const { currentUser, loadCurrentUser } = useAuthStore()

  useEffect(() => {
    loadCurrentUser().catch(() => {})
  }, [loadCurrentUser])

  const displayName = currentUser?.nickname || 'Hung'

  const handleLearnMore = () => {
    whyBollyRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-[#010828] min-h-screen text-cream overflow-x-hidden relative">
      <div className="noise-overlay" />
      <MeetBollyHero onLearnMore={handleLearnMore} currentUser={currentUser} />
      <div ref={whyBollyRef}>
        <WhyBollySection username={displayName} currentUser={currentUser} />
      </div>
      <LearnJourneySection currentUser={currentUser} />
      <TryBollySection username={displayName} currentUser={currentUser} />
    </div>
  )
}
