export const checkPermission = (roles, userRole) => {
	if (!roles) {
		return true
	}

	if (Array.isArray(roles) && roles.includes(userRole)) {
		return true
	}

	return false
}
