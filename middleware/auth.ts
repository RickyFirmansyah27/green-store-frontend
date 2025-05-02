export default defineNuxtRouteMiddleware((to) => {
  const token = localStorage.getItem('token')
  
  const publicRoutes = ['/login', '/register']
  
  if (!token && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (token && publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }
})