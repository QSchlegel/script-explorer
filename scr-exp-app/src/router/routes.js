const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },{
    path: '/scripts',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Content/ScriptPage.vue') },
      { path: ':scriptHash', component: () => import('src/pages/Content/ScriptPage.vue') }
    ]
  },{
    path: '/address',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Util/ErrorNotFound.vue') }
    ]
  },{
    path: '/asset',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Util/ErrorNotFound.vue') },
      { path: ':assetId', component: () => import('src/pages/Util/ErrorNotFound.vue') }
      // { path: 'policy/:policyId', component: () => import('pages/ErrorNotFound.vue') }
      // assetId = policyId + assetName(hexencoded)---> Todo HexedcoderFkt
    ]
  },{
    path: '/tx',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Util/ErrorNotFound.vue') }
    ]
  },{
    path: '/utxo',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Util/ErrorNotFound.vue') }
    ]
  },{
    path: '/about',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Util/AboutPage.vue') }
    ]
  },{
    path: '/donate',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Util/DonatePage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/Util/ErrorNotFound.vue')
  }
]

export default routes
