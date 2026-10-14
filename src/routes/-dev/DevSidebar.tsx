import './DevSidebar.css'

export type PreviewMode = 'fit-height' | 'fit-width'

export function DevSidebar({
  mode,
  onModeChange,
}: {
  mode: PreviewMode
  onModeChange: (mode: PreviewMode) => void
}) {
  return (
    <aside aria-label="Preview controls" className="dev-sidebar">
      <p className="dev-sidebar-label">Preview</p>
      <button
        aria-pressed={mode === 'fit-height'}
        className="dev-sidebar-btn"
        onClick={() => onModeChange('fit-height')}
      >
        Fit height
      </button>
      <button
        aria-pressed={mode === 'fit-width'}
        className="dev-sidebar-btn"
        onClick={() => onModeChange('fit-width')}
      >
        Fit width
      </button>
    </aside>
  )
}
