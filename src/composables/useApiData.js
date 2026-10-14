import { onMounted, ref, shallowRef } from 'vue'

/**
 * Charge une donnée depuis l'API et expose les trois états attendus par l'interface :
 * chargement, erreur, données.
 *
 *   const { data, loading, error, isEmpty, reload } = useApiData(fetchServices, [])
 *
 * `loader` est une fonction async. `initialValue` sert de valeur affichée
 * tant que rien n'est chargé (tableau vide, objet null…).
 */
export function useApiData(loader, initialValue = null, { immediate = true } = {}) {
  const data = shallowRef(initialValue)
  const loading = ref(false)
  const error = ref(null)

  const reload = async (...args) => {
    loading.value = true
    error.value = null
    try {
      data.value = await loader(...args)
      return data.value
    } catch (caught) {
      // Le message est déjà lisible : il vient de ApiError.
      error.value = caught?.message || 'Une erreur est survenue.'
      data.value = initialValue
      return null
    } finally {
      loading.value = false
    }
  }

  if (immediate) onMounted(() => reload())

  return { data, loading, error, reload }
}

export default useApiData
