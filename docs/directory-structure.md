
# src/

- api/
  - hardware/
  - cloud/
  - device/ (local DB and OS settings like Wifi, monitor, etc.)

- app/

- routes/ (routes and page components)
  - sess/
    - route.tsx (define route which uses SessLayout)
    - -SessLayout.tsx (place SessHeader, SessFooter, SessNav, and Outlet)
    - -header/
      - SessHeader.tsx
    - -footer/
      - SessFooter.tsx
    - -nav/
      - SessNav.tsx
    - home/
      - index.tsx
      - -sections/
        - ProtocolList.tsx
        - DeviceStatus.tsx
    - settings/
    - console/
    - tx/
      - pre/
      - intra/
      - post/
  - preflight/
  - onboarding/
  - login/

- ui/ (UI components)
  - Button.tsx
  - Dialog.tsx