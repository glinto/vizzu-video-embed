console.log('Video page loaded')

const cuePoints = [
	0, 11.0, 34.167, 49.0, 59.367, 78.333, 90.767, 102.9, 114.0, 128.4, 135.867, 162.933, 180.767,
	190.267, 207.633, 214.233, 228.633, 240.167, 253.133, 258.733, 268.733, 271.933, 284.667,
	303.067
]

function renderCuePoints() {
	const cuePointsContainer = document.querySelector('.cuepoints-bar')
	// Clear existing cue points
	while (cuePointsContainer.firstChild) {
		cuePointsContainer.removeChild(cuePointsContainer.firstChild)
	}
	cuePoints.forEach((cuePoint, index) => {
		const cuePointElement = document.createElement('div')
		cuePointElement.classList.add('cuepoints-bar__cuepoint')
		cuePointsContainer.appendChild(cuePointElement)
	})
}

function setCuePoint(index) {
	const points = document.querySelectorAll('.cuepoints-bar__cuepoint')
	points.forEach((point, i) => {
		if (i === index) {
			point.classList.add('cuepoints-bar__cuepoint--active')
		} else {
			point.classList.remove('cuepoints-bar__cuepoint--active')
		}
	})
}

function documentReady() {
	return new Promise((resolve) => {
		document.addEventListener('DOMContentLoaded', () => {
			resolve()
		})
	})
}

function videoReady(video) {
	if (video.readyState >= 1) {
		return Promise.resolve()
	}
	return new Promise((resolve) => {
		video.addEventListener('loadedmetadata', () => {
			resolve()
		})
		video.addEventListener('loadeddata', () => {
			resolve()
		})
	})
}

documentReady()
	.then(() => {
		renderCuePoints()
		setCuePoint(0)
	})
	.then(() => videoReady(document.querySelector('#video')))
	.then(() => {
		const video = document.querySelector('#video')
		let currentCuePoint = 0

		console.log('Video ready', video.duration)
		const overlay = document.querySelector('.video-container__video-overlay')

		video.addEventListener('timeupdate', () => {
			let prevCuePoint = currentCuePoint
			cuePoints.forEach((cuePoint, index) => {
				if (video.currentTime > cuePoint) {
					currentCuePoint = index
					return
				}
			})
			if (prevCuePoint !== currentCuePoint) {
				console.log('Cue point reached:', currentCuePoint)
				setCuePoint(currentCuePoint)
			}
		})

		video.addEventListener('play', () => {
			overlay.style.display = 'none'
		})

		video.addEventListener('pause', () => {
			overlay.style.display = 'flex'
		})

		video.addEventListener('ended', () => {
			overlay.style.display = 'flex'
		})

		document.querySelector('#prev').addEventListener('click', () => {
			currentCuePoint = Math.max(
				0,
				video.currentTime > cuePoints[currentCuePoint] + 0.5
					? currentCuePoint
					: currentCuePoint - 1
			)
			video.currentTime = cuePoints[currentCuePoint]
			console.log('Playing from last cue point:', currentCuePoint)
			setCuePoint(currentCuePoint)
		})

		document.querySelector('#next').addEventListener('click', () => {
			if (currentCuePoint < cuePoints.length - 1) {
				video.currentTime = cuePoints[currentCuePoint + 1]
				console.log('Playing from next cue point:', currentCuePoint + 1)
			}
		})

		document.querySelector('#play').addEventListener('click', () => {
			video.play()
		})
	})
