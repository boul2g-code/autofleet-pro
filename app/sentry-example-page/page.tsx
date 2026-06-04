"use client"
import * as Sentry from "@sentry/nextjs"
import { useState } from "react"

export default function SentryTestPage() {
  const [sent, setSent] = useState(false)
  const handleTest = () => {
    Sentry.captureMessage("AutoFleet Sentry smoke test - " + new Date().toISOString())
    setSent(true)
  }
  return (
    <div style={{padding:40,fontFamily:"sans-serif"}}>
      <h1>Sentry Smoke Test</h1>
      <button onClick={handleTest} style={{padding:"12px 24px",fontSize:16,cursor:"pointer",background:"#6c5fc7",color:"white",border:"none",borderRadius:8}}>
        {sent ? "✅ Sent! Check Sentry dashboard" : "Send Test Event to Sentry"}
      </button>
      {sent && <p style={{marginTop:16,color:"green"}}>Event sent. Go to boul2g.sentry.io/issues</p>}
    </div>
  )
}
