export default function({
  store,
  redirect,
  route
}) {
  const userId = store.state.userId
  const userRoles = store.state.userRoles
  const urlRequiresAuth = /^\/admin|account(\/|$)/.test(route.fullPath)
  const urlRequiresNonAuth = /^\/signup|login|change|reset(\/|$)/.test(route.fullPath)

  console.log(userRoles)
  if (!userId && urlRequiresAuth) {
    return redirect('/signin')
  }

  if (userId && urlRequiresNonAuth) {
    return redirect('/account')
  }

  return Promise.resolve()
}
