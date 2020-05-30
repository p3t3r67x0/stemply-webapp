export default function({
  store,
  redirect,
  route
}) {
  const userId = store.state.userId
  const urlRequiresAuth = /^\/account(\/|$)/.test(route.fullPath)
  const urlRequiresNonAuth = /^\/signup|login|change|reset(\/|$)/.test(route.fullPath)

  if (!userId && urlRequiresAuth) {
    return redirect('/signin')
  }

  if (userId && urlRequiresNonAuth) {
    return redirect('/account')
  }

  return Promise.resolve()
}
