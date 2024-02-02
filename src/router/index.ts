import { createRouter, createWebHistory } from 'vue-router'
import * as consty from '@/service/Counts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/updatePw',
      component: () => import('@/components/UpdatePassword.vue')
    },
    {
      path: '/admin',
      component: () => import('@/views/AdminView.vue'),
      meta: {
        roles: [consty.ADMIN]
      },
      children: [
        {
          path: 'addProcess',
          component: () => import('@/components/admin/AddProcess.vue')
        },
        {
          path: 'changeGroup',
          component: () => import('@/components/admin/ChangeGroup.vue')
        },
        {
          path: 'restPassword',
          component: () => import('@/components/admin/RestPassword.vue')
        },
        {
          path: 'startTime',
          component: () => import('@/components/admin/StartTime.vue')
        },
        {
          path: 'student',
          component: () => import('@/components/admin/StudentExcle.vue')
        },
        {
          path: 'teacher',
          component: () => import('@/components/admin/TeacherExcle.vue')
        },
        {
          path: 'projectTitle',
          component: () => import('@/components/admin/PeojectTitleExcle.vue')
        }
      ],
      redirect: '/admin/startTime'
    },
    {
      path: '/teacher',
      component: () => import('@/views/TeacherView.vue'),
      meta: {
        roles: [consty.TEACHER]
      },
      children: [
        {
          path: 'score',
          component: () => import('@/components/teacher/ProcessScore.vue')
        },
        {
          path: 'groupScore',
          component: () => import('@/components/teacher/GroupScores.vue')
        },
        {
          path: 'unSelect',
          component: () => import('@/components/teacher/UnSelectStudent.vue')
        },
        {
          path: 'select',
          component: () => import('@/components/teacher/SelectStudent.vue')
        }
      ],
      redirect: '/teacher/score'
    },
    {
      path: '/student',
      component: () => import('@/views/StudentView.vue'),
      meta: {
        roles: [consty.STUDENT]
      },
      children: [
        {
          path: 'selection',
          component: () => import('@/components/student/TurtorSelection.vue')
        },
        {
          path: 'upload',
          component: () => import('@/components/student/UploadFile.vue')
        }
      ],
      redirect: '/student/selection'
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    } // 捕获所有未匹配到其他路由的路径，并将其导向登录路由
  ]
})

router.beforeEach((to, from, next) => {
  // 前置全局路由守卫
  if (!to.meta.roles) {
    next()
    return
  }
  const role: any = sessionStorage.getItem('role')
  // @ts-ignore
  if (role && to.meta.roles.includes(role)) {
    next()
  } else {
    sessionStorage.clear()
    next('/')
  }
})

export default router
