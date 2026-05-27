import { useFleetStore } from '@/store/useFleetStore'
import { t, I18N } from '@/lib/i18n'
import type { Lang } from '@/lib/types'

/**
 * Returns a translation helper bound to the current language.
 * Usage: const { T, lang } = useTranslation()
 *        T('nav.dashboard')  → "Πίνακας Ελέγχου"
 */
export function useTranslation() {
  const lang = useFleetStore(state => state.lang)
  return {
    lang,
    T: (key: string) => t(lang, key),
    tl: (key: string, override?: Lang) => t(override ?? lang, key),
    I18N: I18N[lang],
  }
}
