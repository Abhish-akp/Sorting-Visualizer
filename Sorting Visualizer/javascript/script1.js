let MAX_HEIGHT = 260
const NUM_ELEMENTS = 16

const config = {

	_sort : null,
	_values: [],
	_visual: null,
	_generator: null,
	_generators: {
		'Insertion': algos.insertionSort,
		'Bubble'   : algos.bubbleSort,
		'Selection': algos.selectionSort,
		'Merge'    : algos.mergeSort,
		'Quick'    : algos.quickSort
	},
	_iterations: 0,
	_informaton : algos.info,

	init: function() {
		this._values = []
		this._visual = document.getElementById('visual')
		this.setAlgo()
	},

	setAlgo: function() {
		this._generator = this._generators[this._sort]()
	},

	iterate: function() {
		Promise.resolve(++this._iterations)
		.then(count => {
			document.getElementById('counter').innerHTML = count
		})
	},

	step: function() {
		this._generator.next()
	},

	get canvas() {
		return this._visual
	},

	get active() {
		return this._sort
	},

	get Text() {
		return this._informaton[this._sort].description
	},

	get Complexity() {
		return this._informaton[this._sort].complexity
	}
}

function resetColor(...args) {
	for (let el of args) {
		el.style.color = '#fff'
	}
}

function updateElementState(item, newValue) {
	item.val = newValue
	item.el.innerHTML = newValue
	item.el.style.height = (MAX_HEIGHT - (MAX_HEIGHT/NUM_ELEMENTS)*(NUM_ELEMENTS-newValue)) + 5+"px"
}

function swap(itemA, itemB) {
	removeActiveClass(config.canvas, 'selected')
	let temp = itemA.val
	toggleSelected(itemA.el)
	toggleSelected(itemB.el)

	return delay(800)
	.then(() => {
		updateElementState(itemA, itemB.val)
		updateElementState(itemB, temp)
		return delay(500)
	})
	.then(() => resetColor(itemA.el, itemB.el))
}

function updateElement(itemA) {
	delay(200)
	.then(() => {
		updateElementState(itemA, itemA.val)
	})
}

function setupSort(name) {
	return function() {
		let current = dekebab(name)
		if (current == config.active)
			return

		// else
		config._sort = current
		setPageTitle(config.active)
		setPageDescription(config.active)
		setPageComplexity(config.active)

		config.setAlgo()
	}
}

/*
 *	@params {stuff}
 */
function setPageTitle(name) {
	let el = document.getElementById('title')
	el.innerHTML = name + " Sort"
}

function setPageDescription(name) {
	let el = document.getElementById('description')
	el.innerHTML = config.Text
}

function setPageComplexity(name) {
	let el = document.getElementById('complexity')
	el.innerHTML = config.Complexity
}

function runAlgo() {
	if (config._generator)
		config.step()
	return false
}

function animateAlgo() {
	if (!config._generator.next().done) {
		setTimeout(animateAlgo, 800)
	} else {
		removeActiveClass(config.canvas, 'selected')
	}
	return false
}

function resetCanvas() {
	let count = 1

	removeActiveClass(config.canvas, 'sorted')
	config.setAlgo()
	for (let item of config._values) {
		let value = randInt(NUM_ELEMENTS) + 1
		item.el.style['background-color'] = getRandomColor((count++)-1)
		updateElementState(item, value)
	}

	config._iterations = -1
	config.iterate()

	return false
}

function setupColumns() {
	setupSort('Insertion')()
	config.init()
	const visual = config.canvas
	for (let i = 1; i <= NUM_ELEMENTS; i++) {
		let element = document.createElement('div')

		let value = randInt(NUM_ELEMENTS) + 1

		visual.prepend(element)
		element.style['background-color'] = getRandomColor(i-1)
		let item = { val: value, el: element }
		updateElementState(item, value)
		config._values.unshift(item)

		delay(i*100)
		.then(() => element.classList.toggle('loaded'))
	}
}

function setupDOM() {
	console.log("Beginning setup...")
	let ids = ['selection-link',
				  'merge-link',
				  'insertion-link',
				  'bubble-link',
				  'quick-link'
			  ]

	for (let type of ids) {
		let element = document.getElementById(type)
		element.addEventListener('click', setupSort(type))
	}

	let run = document.getElementById('run')
	run.addEventListener('click', runAlgo)
	let reset = document.getElementById('reset')
	reset.addEventListener('click', resetCanvas)
	let animate = document.getElementById('animate')
	animate.addEventListener('click', animateAlgo)

	setupColumns()
	console.log("All Done.")
}


window.addEventListener('load', setupDOM)