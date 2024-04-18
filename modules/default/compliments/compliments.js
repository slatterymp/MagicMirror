/* MagicMirror²
 * Module: Compliments
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("compliments", {
	// Module config defaults.
	defaults: {
		compliments: {
			morning: ["Good morning.", "Buenos dias."],
			afternoon: ["Good afternoon.", "Buenas tardes."],
			evening: ["Good evening.", "Buenas noches."],
			"....-01-01": ["Happy New Year.", "Feliz ano nuevo."],
			"....-02-14": ["Happy Valentines Day.", "Feliz dia de San Valentin."],
			"....-02-16": ["Happy Birthday Martha.", "Feliz cumpleanos Martha."],
			"....-03-03": ["Happy Birthday Mommy.", "Feliz cumpleanos Mami."],
			"....-03-08": ["Happy Women's Day.", "Feliz dia de la mujer.", "Remember the time change.", "Recuerda adelantar tu reloj una hora."],
			"....-03-09": ["Remember the time change."],
			"....-03-17": ["Happy St. Patrick's Day."],
			"....-03-20": ["First day of spring.", "Es el primer dia de primavera."],
			"....-03-31": ["Happy Easter."],
			"....-04-01": ["Happy Easter.", "Felices Pascuas"],
			"....-04-19": ["Happy Birthday Finn.", "Feliz cumpleanos Finn."],
			"....-05-10": ["Happy Mother's Day.", "Feliz dia de la madre."],
			"....-05-12": ["Happy Mother's Day."],
			"....-05-26": ["Happy Anniversary."],
			"....-05-27": ["Enjoy your Memorial Day."],
			"....-06-16": ["Happy Father's Day."],
			"....-07-04": ["Happy Fourth of July."],
			"....-09-02": ["Enjoy your Labor Day."],
			"....-10-14": ["Enjoy your Columbus Day."],
			"....-10-31": ["Trick or treat.", "Happy Halloween."],
			"....-11-23": ["Happy Thanksgiving."],
			"....-12-01": ["24 days until Christmas.", "24 dias hasta Navidad."],
			"....-12-02": ["23 days until Christmas.", "23 dias hasta Navidad."],
			"....-12-03": ["22 days until Christmas.", "22 dias hasta Navidad."],
			"....-12-04": ["21 days until Christmas.", "21 dias hasta Navidad."],
			"....-12-05": ["20 days until Christmas.", "20 dias hasta Navidad."],
			"....-12-06": ["19 days until Christmas.", "19 dias hasta Navidad."],
			"....-12-07": ["18 days until Christmas.", "18 dias hasta Navidad."],
			"....-12-08": ["17 days until Christmas.", "17 dias hasta Navidad."],
			"....-12-09": ["16 days until Christmas.", "16 dias hasta Navidad."],
			"....-12-10": ["15 days until Christmas.", "15 dias hasta Navidad."],
			"....-12-11": ["14 days until Christmas.", "14 dias hasta Navidad."],
			"....-12-12": ["13 days until Christmas.", "13 dias hasta Navidad."],
			"....-12-13": ["12 days until Christmas.", "12 dias hasta Navidad."],
			"....-12-14": ["11 days until Christmas.", "11 dias hasta Navidad."],
			"....-12-15": ["10 days until Christmas.", "10 dias hasta Navidad."],
			"....-12-16": ["9 days until Christmas.", "9 dias hasta Navidad."],
			"....-12-17": ["8 days until Christmas.", "8 dias hasta Navidad."],
			"....-12-18": ["7 days until Christmas.", "7 dias hasta Navidad."],
			"....-12-19": ["6 days until Christmas.", "6 dias hasta Navidad."],
			"....-12-20": ["5 days until Christmas.", "5 dias hasta Navidad."],
			"....-12-21": ["4 days until Christmas.", "4 dias hasta Navidad."],
			"....-12-22": ["3 days until Christmas.", "3 dias hasta Navidad."],
			"....-12-23": ["2 days until Christmas.", "2 dias hasta Navidad."],
			"....-12-24": ["It's Christmas Eve.", "Es Nochebuena."],
			"....-12-25": ["Merry Christmas.", "Feliz Navidad."],
			"....-12-31": ["It's New Year's Eve.", "Es Nochevieja."],
			rain: ["It's raining.", "Esta lloviendo."],
			showers: ["It's raining.", "Esta lloviendo."],
			thunderstorm: ["It's storming.", "Esta tormenta."],
			snow: ["It's snowing.", "Esta nevando."],
			day_sunny: ["It's sunny today.", "Hoy esta soleado."],
			cloudy: ["It's cloudy today.", "Esta nublado hoy."],
			cloudy_windy: ["It's cloudy and windy.", "Esta nublado y ventoso."],
			night_cloudy: ["It's cloudy tonight.", "Esta nublado esta noche."],
			night_alt_cloudy_windy: ["It's cloudy and windy.", "Esta nublado y ventoso."],
			night_clear: ["It's a clear night.", "Es una noche clara."],
			night_showers: ["It's a rainy night.", "Es una noche lluviosa."],
			night_rain: ["It's a rainy night.", "Es una noche lluviosa."],
			night_snow: ["It's a snowy night.", "Es una noche nevada."],
			night_thunderstorm: ["It's a stormy night.", "Es una noche tormentosa."]
		},
		updateInterval: 30000,
		remoteFile: null,
		fadeSpeed: 4000,
		morningStartTime: 3,
		morningEndTime: 12,
		afternoonStartTime: 12,
		afternoonEndTime: 17,
		random: true
	},
	lastIndexUsed: -1,
	// Set currentweather from module
	currentWeatherType: "",

	// Define required scripts.
	getScripts: function () {
		return ["moment.js"];
	},

	// Define start sequence.
	start: async function () {
		Log.info(`Starting module: ${this.name}`);

		this.lastComplimentIndex = -1;

		if (this.config.remoteFile !== null) {
			const response = await this.loadComplimentFile();
			this.config.compliments = JSON.parse(response);
			this.updateDom();
		}

		// Schedule update timer.
		setInterval(() => {
			this.updateDom(this.config.fadeSpeed);
		}, this.config.updateInterval);
	},

	/**
	 * Generate a random index for a list of compliments.
	 * @param {string[]} compliments Array with compliments.
	 * @returns {number} a random index of given array
	 */
	randomIndex: function (compliments) {
		if (compliments.length === 1) {
			return 0;
		}

		const generate = function () {
			return Math.floor(Math.random() * compliments.length);
		};

		let complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	/**
	 * Retrieve an array of compliments for the time of the day.
	 * @returns {string[]} array with compliments for the time of the day.
	 */
	complimentArray: function () {
		const hour = moment().hour();
		const date = moment().format("YYYY-MM-DD");
		let compliments = [];

		// Add time of day compliments
		if (hour >= this.config.morningStartTime && hour < this.config.morningEndTime && this.config.compliments.hasOwnProperty("morning")) {
			compliments = [...this.config.compliments.morning];
		} else if (hour >= this.config.afternoonStartTime && hour < this.config.afternoonEndTime && this.config.compliments.hasOwnProperty("afternoon")) {
			compliments = [...this.config.compliments.afternoon];
		} else if (this.config.compliments.hasOwnProperty("evening")) {
			compliments = [...this.config.compliments.evening];
		}

		// Add compliments based on weather
		if (this.currentWeatherType in this.config.compliments) {
			Array.prototype.push.apply(compliments, this.config.compliments[this.currentWeatherType]);
		}

		// Add compliments for anytime
		Array.prototype.push.apply(compliments, this.config.compliments.anytime);

		// Add compliments for special days
		for (let entry in this.config.compliments) {
			if (new RegExp(entry).test(date)) {
				Array.prototype.push.apply(compliments, this.config.compliments[entry]);
			}
		}

		return compliments;
	},

	/**
	 * Retrieve a file from the local filesystem
	 * @returns {Promise} Resolved when the file is loaded
	 */
	loadComplimentFile: async function () {
		const isRemote = this.config.remoteFile.indexOf("http://") === 0 || this.config.remoteFile.indexOf("https://") === 0,
			url = isRemote ? this.config.remoteFile : this.file(this.config.remoteFile);
		const response = await fetch(url);
		return await response.text();
	},

	/**
	 * Retrieve a random compliment.
	 * @returns {string} a compliment
	 */
	getRandomCompliment: function () {
		// get the current time of day compliments list
		const compliments = this.complimentArray();
		// variable for index to next message to display
		let index;
		// are we randomizing
		if (this.config.random) {
			// yes
			index = this.randomIndex(compliments);
		} else {
			// no, sequential
			// if doing sequential, don't fall off the end
			index = this.lastIndexUsed >= compliments.length - 1 ? 0 : ++this.lastIndexUsed;
		}

		return compliments[index] || "";
	},

	// Override dom generator.
	getDom: function () {
		const wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin xlarge bright pre-line";
		// get the compliment text
		const complimentText = this.getRandomCompliment();
		// split it into parts on newline text
		const parts = complimentText.split("\n");
		// create a span to hold the compliment
		const compliment = document.createElement("span");
		// process all the parts of the compliment text
		for (const part of parts) {
			if (part !== "") {
				// create a text element for each part
				compliment.appendChild(document.createTextNode(part));
				// add a break
				compliment.appendChild(document.createElement("BR"));
			}
		}
		// only add compliment to wrapper if there is actual text in there
		if (compliment.children.length > 0) {
			// remove the last break
			compliment.lastElementChild.remove();
			wrapper.appendChild(compliment);
		}
		return wrapper;
	},

	// Override notification handler.
	notificationReceived: function (notification, payload, sender) {
		if (notification === "CURRENTWEATHER_TYPE") {
			this.currentWeatherType = payload.type;
		}
	}
});
