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
      { path: '', component: () => import('src/pages/Util/ErrorNotFound.vue') },
      { path: ':scriptHash', component: () => import('src/pages/Content/ScriptPage.vue') }
    ]
  },{
    path: '/addresses',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Util/ErrorNotFound.vue') },
      { path: ':input', component: () => import('src/pages/Content/AddressPage.vue') }
    ]
  },{
    path: '/assets',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Util/ErrorNotFound.vue') },
      { path: ':assetId', component: () => import('src/pages/Util/ErrorNotFound.vue') }
      // { path: 'policy/:policyId', component: () => import('pages/ErrorNotFound.vue') }
      // assetId = policyId + assetName(hexencoded)---> Todo HexedcoderFkt
    ]
  },{
    path: '/txs',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Util/ErrorNotFound.vue') },
      { path: ':txHash', component: () => import('src/pages/Content/TxPage.vue') }
    ]
  },{
    path: '/utxos',
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
  },{
    path: '/glossary',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Util/ErrorNotFound.vue') },
      { path: ':item', component: () => import('src/pages/Util/ErrorNotFound.vue') }
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
