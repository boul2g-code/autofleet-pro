'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  mono?: boolean
}
export function FormInput({ label, mono, className = '', ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.5px', fontWeight: 600, textTransform: 'uppercase' }}>{label}</label>}
      <input
        className={`af-input${mono ? ' af-input-mono' : ''} ${className}`}
        {...props}
      />
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}
export function FormSelect({ label, options, ...props }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.5px', fontWeight: 600, textTransform: 'uppercase' }}>{label}</label>}
      <select className="af-input" style={{ cursor: 'pointer' }} {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}
export function FormTextarea({ label, ...props }: TextAreaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.5px', fontWeight: 600, textTransform: 'uppercase' }}>{label}</label>}
      <textarea className="af-input" style={{ resize: 'vertical', minHeight: 80 }} {...props} />
    </div>
  )
}

export function FormGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${cols === 3 ? '170px' : '210px'}, 1fr))`, gap: 14 }}>
      {children}
    </div>
  )
}

export function FullSpan({ children }: { children: React.ReactNode }) {
  return <div style={{ gridColumn: '1 / -1' }}>{children}</div>
}
