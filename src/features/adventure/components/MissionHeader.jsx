export default function MissionHeader({ worldName, missionName, missionDescription }) {
  return (
    <div className="ff-header">
      <h1 className="ff-header__world">{worldName || 'Food Forest'}</h1>
      <h2 className="ff-header__mission">{missionName || 'Select a mission'}</h2>
      <p className="ff-header__desc">{missionDescription || ''}</p>
    </div>
  )
}
