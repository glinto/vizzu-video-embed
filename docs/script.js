console.log('Video page loaded')

const cuePoints = [
	0, 8.4, 20.367, 28.433, 35.133, 45.033, 52.0, 61.667, 69.867, 78.6, 94.133, 118.0, 139.3, 158.5,
	167.567, 172.433, 185.533, 190.233, 200.0, 204.7, 220.667
]

const cuePointLabels = [
	'Welcome & Goals',
	'Revenue Analysis',
	'Profit Trends',
	'Revenue vs. Profit',
	'Q4 Profit Drop',
	'Product-Level Breakdown',
	'Loss-Making Products',
	'Industry Impact',
	'Country Impact',
	'Discount Effect',
	'High-Discount Countries',
	'Key Loss-Driving Products',
	'Other Products in Bad Countries',
	'Problematic Products Worldwide',
	'Summary of Findings',
	'Presentation Prep',
	'Profit Modeling',
	'Profit wo. Loss-Generating Items',
	'Visualizing Profit Impact',
	'Final Insights',
	'Go Crush It, Alex!'
]

const CUEPOINT_DEADZONE = 0.2

let currentCuePoint = 0
let stoppedBeforeCue = false

function renderCuePoints() {
	const cuePointsContainer = document.querySelector('.cuepoints-bar')
	// Clear existing cue points
	while (cuePointsContainer.firstChild) {
		cuePointsContainer.removeChild(cuePointsContainer.firstChild)
	}
	cuePoints.forEach((cuePoint, index) => {
		const cuePointElement = document.createElement('div')
		cuePointElement.classList.add('cuepoints-bar__cuepoint')
		// add data attribute to store the cue point index
		cuePointElement.setAttribute('data-index', index)
		cuePointsContainer.appendChild(cuePointElement)
		cuePointElement.addEventListener('click', (event) => {
			const index = parseInt(event.target.getAttribute('data-index'))
			const video = document.querySelector('#video')
			gotoCuePoint(index)
			video.pause()
			updateCuePoint(index)
		})
	})
}

/**
 * Update the active cue point in the cue points bar
 */
function updateCuePoint(index) {
	const points = document.querySelectorAll('.cuepoints-bar__cuepoint')
	points.forEach((point, i) => {
		if (i === index) {
			point.classList.add('cuepoints-bar__cuepoint--active')
		} else {
			point.classList.remove('cuepoints-bar__cuepoint--active')
		}
	})
	document.querySelector('.video-container__chapter-title div').innerText =
		cuePointLabels[index] ?? ''
}

function gotoCuePoint(index) {
	const video = document.querySelector('#video')
	video.currentTime = cuePoints[index]
	currentCuePoint = index
	updateCuePoint(index)
}

function playToggle() {
	const video = document.querySelector('#video')
	if (video.paused) {
		video.play()
		//currentCuePoint = getCuePointUnderPlayhead()
		//updateCuePoint(currentCuePoint)
	} else {
		video.pause()
	}
}

function next() {
	if (currentCuePoint < cuePoints.length - 1) {
		stoppedBeforeCue = false
		console.log('Playing from next cue point:', currentCuePoint + 1)
		gotoCuePoint(currentCuePoint + 1)
	}
}

function prev() {
	stoppedBeforeCue = false
	currentCuePoint = Math.max(
		0,
		video.currentTime > cuePoints[currentCuePoint] + 0.5 ? currentCuePoint : currentCuePoint - 1
	)
	gotoCuePoint(currentCuePoint)
	console.log('Playing from last cue point:', currentCuePoint)
	updateCuePoint(currentCuePoint)
	video.pause()
}

function getCuePointUnderPlayhead() {
	const video = document.querySelector('#video')
	const currentTime = video.currentTime
	let cuePointIndex = 0
	cuePoints.forEach((cuePoint, index) => {
		if (currentTime >= cuePoint) {
			cuePointIndex = index
		}
	})
	return cuePointIndex
}

function documentReady() {
	return new Promise((resolve) => {
		document.addEventListener('DOMContentLoaded', () => {
			resolve()
		})
	})
}

function videoReady(video) {
	if (video.readyState >= 2) {
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
		updateCuePoint(0)
	})
	.then(() => videoReady(document.querySelector('#video')))
	.then(() => {
		const video = document.querySelector('#video')

		console.log('Video ready', video.duration)

		video.addEventListener('timeupdate', () => {
			const cue = getCuePointUnderPlayhead()
			if (
				!stoppedBeforeCue &&
				currentCuePoint < cuePoints.length - 1 &&
				video.currentTime >= cuePoints[currentCuePoint + 1] - CUEPOINT_DEADZONE
			) {
				console.log('Stopped before cue point', currentCuePoint + 1, video.currentTime)
				stoppedBeforeCue = true
				video.pause()
			}
			if (cue > currentCuePoint && video.currentTime >= cuePoints[cue] + CUEPOINT_DEADZONE) {
				console.log('Reached cue point:', cue)
				currentCuePoint = cue
				updateCuePoint(cue)
				stoppedBeforeCue = false
			}
		})

		video.addEventListener('play', () => {
			document.querySelector('#play span').innerText = 'pause'
		})

		video.addEventListener('pause', () => {
			document.querySelector('#play span').innerText = 'play_arrow'
		})

		video.addEventListener('ended', () => {})

		document.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowRight') {
				next()
			}
			if (event.key === 'ArrowLeft') {
				prev()
			}
			if (event.key === ' ') {
				playToggle()
			}
		})

		document.querySelector('#prev').addEventListener('click', () => {
			prev()
		})

		document.querySelector('#next').addEventListener('click', () => {
			next()
		})

		document.querySelector('#play').addEventListener('click', () => {
			playToggle()
		})
	})
