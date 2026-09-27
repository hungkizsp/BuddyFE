/**
 * Mapping dictionary for common English category names to Vietnamese.
 */
export const CATEGORY_TRANSLATIONS = {
  food: 'Đồ ăn',
  animals: 'Động vật',
  animal: 'Động vật',
  emotions: 'Cảm xúc',
  emotion: 'Cảm xúc',
  feelings: 'Cảm xúc',
  places: 'Địa điểm',
  place: 'Địa điểm',
  family: 'Gia đình',
  clothes: 'Trang phục',
  clothing: 'Trang phục',
  colors: 'Màu sắc',
  color: 'Màu sắc',
  numbers: 'Số đếm',
  number: 'Số đếm',
  school: 'Trường học',
  toys: 'Đồ chơi',
  toy: 'Đồ chơi',
  weather: 'Thời tiết',
  jobs: 'Nghề nghiệp',
  job: 'Nghề nghiệp',
  occupations: 'Nghề nghiệp',
  occupation: 'Nghề nghiệp',
  sports: 'Thể thao',
  sport: 'Thể thao',
  transportation: 'Giao thông',
  vehicles: 'Phương tiện',
  vehicle: 'Phương tiện',
  body: 'Bộ phận cơ thể',
  'body parts': 'Bộ phận cơ thể',
  house: 'Nhà cửa',
  home: 'Nhà cửa',
  nature: 'Thiên nhiên',
  fruits: 'Trái cây',
  fruit: 'Trái cây',
  vegetables: 'Rau củ',
  vegetable: 'Rau củ',
  kitchen: 'Nhà bếp',
  supermarket: 'Siêu thị',
  restaurant: 'Nhà hàng',
  forest: 'Khu rừng',
  greetings: 'Chào hỏi',
  greeting: 'Chào hỏi',
  daily: 'Hằng ngày',
  'daily routine': 'Sinh hoạt hằng ngày',
  shapes: 'Hình khối',
  shape: 'Hình khối',
  travel: 'Du lịch',
  music: 'Âm nhạc',
  technology: 'Công nghệ',
  health: 'Sức khỏe',
  holidays: 'Ngày lễ',
  holiday: 'Ngày lễ',
  time: 'Thời gian',
}

/**
 * Returns the Vietnamese display name for a category.
 * If no translation is found, returns the original name.
 */
export function getCategoryDisplayName(name) {
  if (!name || typeof name !== 'string') return ''
  const key = name.trim().toLowerCase()
  return CATEGORY_TRANSLATIONS[key] || name
}
