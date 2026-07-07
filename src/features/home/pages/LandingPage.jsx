import { useRef, useEffect } from 'react'
import { useAuthStore } from '../../auth/store/authStore'
import MeetBuddyHero from '../components/landing/MeetBuddyHero'
import WhyBuddySection from '../components/landing/WhyBuddySection'
import LearnJourneySection from '../components/landing/LearnJourneySection'
import TryBuddySection from '../components/landing/TryBuddySection'

export default function LandingPage() {
  const whyBuddyRef = useRef(null)
  const { currentUser, loadCurrentUser } = useAuthStore()

  useEffect(() => {
    loadCurrentUser().catch(() => {})
  }, [loadCurrentUser])

  const displayName = currentUser?.nickname || 'Hung'

  const handleLearnMore = () => {
    whyBuddyRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="bg-[#010828] min-h-screen text-cream overflow-x-hidden relative">
      <div className="noise-overlay" />
      <MeetBuddyHero onLearnMore={handleLearnMore} />
      <div ref={whyBuddyRef}>
        <WhyBuddySection username={displayName} />
      </div>
      <LearnJourneySection />
      <TryBuddySection username={displayName} />
    </div>
  )
}
