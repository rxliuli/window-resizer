import { App } from '@/App'
import { AboutPage } from '@/pages/about'
import { HomePage } from '@/pages/home'
import { PermissionPage } from '@/pages/permission'
import { createRootRoute, createRoute } from '@tanstack/react-router'
import { createRouter } from '@tanstack/react-router'

const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

const permissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/permission',
  component: PermissionPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  permissionRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
