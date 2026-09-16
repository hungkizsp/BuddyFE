export default function MissionHeader({ worldName, missionName, missionDescription }) {
  return (
    <div className="ff-header">
      <h1 className="ff-header__world">{worldName || 'Khu Rừng Thức Ăn'}</h1>
      <h2 className="ff-header__mission">{missionName || 'Chọn một nhiệm vụ'}</h2>
      <p className="ff-header__desc">{missionDescription || ''}</p>
    </div>
  )
}
