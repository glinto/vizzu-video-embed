console.log('Video page loaded')

const cuePoints = [
	0, 11.0, 34.167, 49.0, 59.367, 78.333, 90.767, 102.9, 114.0, 128.4, 135.867, 162.933, 180.767,
	190.267, 207.633, 214.233, 228.633, 240.167, 253.133, 258.733, 268.733, 271.933, 284.667,
	303.067
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
	'High-Discount Regions',
	'Ranking Losses',
	'Product Performance by Country',
	'Key Loss-Driving Products',
	'Regional Product Losses',
	'Summary of Findings',
	'Presentation Prep',
	'Profit Modeling',
	'Original vs. Modeled Profit',
	'Visualizing Profit Impact',
	'Refining Analysis',
	'Potential Gains',
	'Final Insights',
	'Epilogue'
]

let currentCuePoint = 0

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
		console.log('Playing from next cue point:', currentCuePoint + 1)
		gotoCuePoint(currentCuePoint + 1)
	}
}

function prev() {
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
		updateCuePoint(0)
	})
	.then(() => videoReady(document.querySelector('#video')))
	.then(() => {
		const video = document.querySelector('#video')

		console.log('Video ready', video.duration)

		video.addEventListener('timeupdate', () => {
			const cue = getCuePointUnderPlayhead()
			if (cue > currentCuePoint) {
				console.log('Reached cue point:', cue)
				video.pause()
				currentCuePoint = cue
				updateCuePoint(cue)
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
