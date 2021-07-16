import Servers from '@/views/Dashboard/Servers/Servers.vue';
import Users from '@/views/Dashboard/Users/Users.vue';
import Explore from '@/views/Dashboard/Explore/Explore.vue';
import Settings from '@/views/Dashboard/Settings/Settings.vue';
import Info from '@/views/Dashboard/Info/Info.vue';

export default [
  {
    path: 'servers',
    name: 'Servers',
    component: Servers,
  },
  {
    path: 'users',
    name: 'Users',
    component: Users,
  },
  {
    path: 'explore',
    name: 'Explore',
    component: Explore,
  },
  {
    path: 'settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: 'info',
    name: 'Info',
    component: Info,
  },
];
