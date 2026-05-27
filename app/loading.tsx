export default function Loading() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
