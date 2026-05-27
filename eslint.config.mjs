import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  ...nextVitals,
  {
    ignores: ['autofleet-supabase-work/**'],
  },
]

export default eslintConfig
