import Vue from 'vue'
import Router from 'vue-router'
import FjSite from '@/components/Fjsite'
import LineTransfer from '@/components/LineTransfer'
import transferList from '@/components/transferList'
import simpleMap from '@/components/simpleMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FjSite',
      component: FjSite
    },
    {
      path: '/LineTransfer',
      name: 'LineTransfer',
      component: LineTransfer
    },
    {
      path: '/transferList',
      name: 'transferList',
      component: transferList
    },
    {
      path: '/simpleMap',
      component: simpleMap,
      name: 'simpleMap'
    }
  ]
})
