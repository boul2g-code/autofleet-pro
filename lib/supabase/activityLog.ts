// Activity log disabled - table not required
export async function logActivity(_params: {
  vehicleId?: string
  action: string
  section?: string
  summary?: string
}) {
  // noop - activity log table not configured
}
