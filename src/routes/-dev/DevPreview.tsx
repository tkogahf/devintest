import { useState, type ReactNode } from 'react'
import { DevSidebar, type PreviewMode } from './DevSidebar'
import './DevPreview.css'

export function DevPreview({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PreviewMode>('fit-height')

  return (
    <div className="dev-preview" data-mode={mode}>
      <DevSidebar mode={mode} onModeChange={setMode} />
      <div className="dev-preview-area">
        <div className="dev-viewport">
          <div className="dev-viewport-inner">{children}</div>
        </div>
      </div>
    </div>
  )
}
