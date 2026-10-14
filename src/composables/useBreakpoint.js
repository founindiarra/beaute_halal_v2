import { onBeforeUnmount, ref } from 'vue'

/**
 * Vrai à partir du palier « sm » de Tailwind, celui où les mises en page
 * passent du texte sous la photo au texte à côté.
 *
 * Sert à ne charger que le cadrage réellement affiché : masquer l'autre en
 * CSS ne suffirait pas, le navigateur téléchargerait quand même les deux
 * photos — près d'un demi-mégaoctet inutile sur une première page vue en
 * connexion mobile.
 */
export function useIsWide(requete = '(min-width: 640px)') {
  const media = window.matchMedia(requete)
  const isWide = ref(media.matches)
  const onChange = (event) => {
    isWide.value = event.matches
  }
  media.addEventListener('change', onChange)
  onBeforeUnmount(() => media.removeEventListener('change', onChange))
  return isWide
}

export default useIsWide
