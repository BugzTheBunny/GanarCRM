import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/Dashboard.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/leads',
    name: 'Leads',
    component: () => import('../views/dashboard/leads/Leads.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/leads/add',
    name: 'AddLeads',
    component: () => import('../views/dashboard/leads/AddLead.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/leads/:id',
    name: 'Lead',
    component: () => import('../views/dashboard/leads/Lead.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/leads/:id/edit',
    name: 'EditLead',
    component: () => import('../views/dashboard/leads/EditLead.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/my-account',
    name: 'MyAccount',
    component: () => import('../views/dashboard/MyAccount.vue')
  },
  {
    path: '/dashboard/edit-member/:id',
    name: 'EditUser',
    component: () => import('../views/dashboard/teams/EditUser.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/add-team',
    name: 'AddTeam',
    component: () => import('../views/dashboard/teams/AddTeam.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/add-member',
    name: 'AddMember',
    component: () => import('../views/dashboard/teams/AddMember.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/team',
    name: 'Team',
    component: () => import('../views/dashboard/teams/Team.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/clients',
    name: 'Clients',
    component: () => import('../views/dashboard/clients/Clients.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/clients/add',
    name: 'AddClient',
    component: () => import('../views/dashboard/clients/AddClient.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/clients/:id',
    name: 'Client',
    component: () => import('../views/dashboard/clients/Client.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/clients/:id/edit',
    name: 'EditClient',
    component: () => import('../views/dashboard/clients/EditClient.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/clients/:id/add-note',
    name: 'AddNote',
    component: () => import('../views/dashboard/clients/notes/AddNote.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/dashboard/clients/:id/edit-note/:note_id',
    name: 'EditNote',
    component: () => import('../views/dashboard/clients/notes/EditNote.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue')

  },
  {
    path: '/log-in',
    name: 'LogIn',
    component: () => import('../views/LogIn.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireLogin) && !store.state.isAuthenticated) {
    next('/log-in')
  } else {
    next()
  }
})

export default router
