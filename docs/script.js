console.log('Video page loaded')

const cuePoints = [
	0, 11.0, 34.167, 49.0, 59.367, 78.333, 90.767, 102.9, 114.0, 128.4, 135.867, 162.933, 180.767,
	190.267, 207.633, 214.233, 228.633, 240.167, 253.133, 258.733, 268.733, 271.933, 284.667,
	303.067
]

function documentReady() {
	return new Promise((resolve) => {
		document.addEventListener('DOMContentLoaded', () => {
			resolve()
		})
	})
}

function videoReady(video) {
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
	.then(() => videoReady(document.querySelector('#video')))
	.then(() => {
		const video = document.querySelector('#video')
		let currentCuePoint = 0
		console.log('Video ready', video.duration)

		video.addEventListener('timeupdate', () => {
			if (currentCuePoint >= cuePoints.length - 1) {
				return
			}
			if (video.currentTime > cuePoints[currentCuePoint + 1]) {
				console.log('Cue point reached:', currentCuePoint + 1)
				currentCuePoint++
			}
		})

		document.querySelector('#play').addEventListener('click', () => {
			video.play()
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
		})

		document.querySelector('#next').addEventListener('click', () => {
			if (currentCuePoint < cuePoints.length) {
				video.currentTime = cuePoints[currentCuePoint + 1]
				console.log('Playing from next cue point:', currentCuePoint + 1)
			}
		})
	})
