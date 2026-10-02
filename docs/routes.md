# Main routes

- /preflight
  - Company operator must register, configure and test the device before shipping the device to users.
- /onboarding
  - Once the user receive the device, the user must complete the onboarding process to setup the device.
- /login
  - The user must scan QR code to login or simply click a button to login as guest.
- /sess
  - Once user login, the user can use the device to run treatments or change the device settings.

# User Session routes

- /sess/home
  - User can start treatment session by selecting a treatment from the list.
- /sess/tx
  - Once user starts a treatment session, user stays under this route until the treatment is completed.
  - There are multiple treatment phases:
    - /pre
    - /intra
    - /post
- /sess/settings
- /sess/catalog
  - User can walk through the catalog to find the detail of treatments and products.
