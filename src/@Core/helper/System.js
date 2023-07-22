export const showLoadingPage = () => {
	document.getElementById('loading-page').style.display = 'block'
}

export const hideLoadingPage = (timeout = 0) => {
	setTimeout(() => {
		if (document.getElementById('loading-page')) document.getElementById('loading-page').style.display = 'none'
	}, timeout)
}
