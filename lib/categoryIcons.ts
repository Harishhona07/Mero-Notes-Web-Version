import {
  MdWork,
  MdPerson,
  MdLightbulb,
  MdChecklist,
  MdFolder,
  MdLabel,
  MdStar,
  MdFavorite,
  MdHome,
  MdShoppingCart,
  MdReceipt,
  MdSchool,
  MdFitnessCenter,
  MdTravelExplore,
  MdRestaurant,
  MdMusicNote,
  MdSportsSoccer,
  MdVideogameAsset,
  MdPalette,
  MdCode,
  MdHelpOutline,
} from 'react-icons/md'
import type { IconType } from 'react-icons'

const iconMap: Record<string, IconType> = {
  work: MdWork,
  person: MdPerson,
  lightbulb: MdLightbulb,
  checklist: MdChecklist,
  folder: MdFolder,
  label: MdLabel,
  star: MdStar,
  favorite: MdFavorite,
  home: MdHome,
  'shopping-cart': MdShoppingCart,
  receipt: MdReceipt,
  school: MdSchool,
  'fitness-center': MdFitnessCenter,
  'travel-explore': MdTravelExplore,
  restaurant: MdRestaurant,
  'music-note': MdMusicNote,
  'sports-soccer': MdSportsSoccer,
  'videogame-asset': MdVideogameAsset,
  palette: MdPalette,
  code: MdCode,

  // Backward compatibility aliases
  fitness: MdFitnessCenter,
  travel: MdTravelExplore,
  music: MdMusicNote,
  gaming: MdVideogameAsset,
  art: MdPalette,
  'question-mark': MdHelpOutline,
}

export function getCategoryIcon(iconName?: string): IconType {
  return iconMap[iconName ?? ''] ?? MdFolder
}
