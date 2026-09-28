import type { ReactNode } from 'react'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="app-header">
        <h1>devintest</h1>
        <nav aria-label="Primary">
          <ul>
            <li>
              <a href="#main-content">Home</a>
            </li>
          </ul>
        </nav>
      </header>
      <main id="main-content" className="app-main" tabIndex={-1}>
        {children}
      </main>
      <footer className="app-footer">
        <p>Application foundation</p>
      </footer>
    </div>
  )
}
