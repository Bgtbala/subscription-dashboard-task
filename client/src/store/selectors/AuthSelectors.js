export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectCurrentUserType = (state) =>
    state.auth.admin?.role || state.auth.user?.role || null;
