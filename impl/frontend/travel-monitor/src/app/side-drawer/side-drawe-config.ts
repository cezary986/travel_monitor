import { ROUTES } from '../app-routing.module';

/**
 * Configuration of sidebar navigation
 */

export const SIDE_DRAWER_CONFIG = [
  {
    icon: 'card_travel',
    label: 'Podróże',
    routerLink: ROUTES.travelsList.route,
    matchRouteRegex: '(^\/travels$)|(^\/travel\/.+$)'
  },
  {
    icon: 'bookmark_outline',
    label: 'Zapisane',
    routerLink: '',
    matchRouteRegex: '^$'
  },
  {
    icon: 'settings',
    label: 'Ustawienia',
    routerLink: ROUTES.settings.route,
    matchRouteRegex: '(^\/settings)$'
  },
]