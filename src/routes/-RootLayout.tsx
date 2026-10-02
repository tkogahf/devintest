import { Link, Outlet } from '@tanstack/react-router'

export function RootLayout() {
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
              <Link to="/sess/home">Home</Link>
            </li>
            <li>
              <Link to="/sess/console">Console</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main id="main-content" className="app-main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="app-footer">
        <p>Application foundation</p>
      </footer>
    </div>
  )
}
