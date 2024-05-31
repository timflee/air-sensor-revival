function nthRank (largest: boolean, arr: number[], rank: number) {
    arrCopy = []
    for (let index = 0; index <= arr.length - 1; index++) {
        arrCopy.push(arr[index])
    }
    bubblePop = true
    while (bubblePop) {
        bubblePop = false
        for (let index = 0; index <= arrCopy.length - 2; index++) {
            if (arrCopy[index] > arrCopy[index + 1]) {
                bubblePop = true
                temp = arrCopy[index]
                arrCopy[index] = arrCopy[index + 1]
                arrCopy[index + 1] = temp
            }
        }
    }
    if (largest) {
        return arrCopy[arrCopy.length - rank]
    } else {
        return arrCopy[rank - 1]
    }
}
input.onButtonPressed(Button.A, function () {
    currentMode = "GraphMode"
    kitronik_air_quality.clear()
    updateHeader()
    updateGraphMode()
})
function limitDigits (num: number, nDigits: number, nPad: number) {
    numString = convertToText(num)
    result = ""
    for (let index = 0; index <= Math.min(nDigits - 1, numString.length); index++) {
        result = "" + result + numString.substr(index, 1)
    }
    while (result.length < nPad) {
        result = "" + result + " "
    }
    return result
}
function updateHeader () {
    kitronik_air_quality.clearLine(1)
    kitronik_air_quality.clearLine(2)
    basic.showString("" + (currentSensor))
    if (currentMode == "LiveMode") {
        kitronik_air_quality.show("Live Mode", 1, kitronik_air_quality.ShowAlign.Centre)
    }
    if (currentMode == "GraphMode") {
        kitronik_air_quality.show(units[sensors.indexOf(currentSensor)], 1, kitronik_air_quality.ShowAlign.Left)
        kitronik_air_quality.show("Graph Mode", 1, kitronik_air_quality.ShowAlign.Centre)
    }
}
function setupLogging () {
    kitronik_air_quality.setDate(30, 5, 2024)
    kitronik_air_quality.setTime(20, 37, 0)
    kitronik_air_quality.addProjectInfo("Tim", "Logged Data")
}
input.onButtonPressed(Button.B, function () {
    currentMode = "LiveMode"
    kitronik_air_quality.clear()
    updateHeader()
})
function updateGraphMode () {
    kitronik_air_quality.show("" + maxHistory[sensors.indexOf(currentSensor)], 2, kitronik_air_quality.ShowAlign.Right)
    kitronik_air_quality.show("" + minHistory[sensors.indexOf(currentSensor)], 2, kitronik_air_quality.ShowAlign.Left)
    kitronik_air_quality.show("" + currentReadings[sensors.indexOf(currentSensor)], 2, kitronik_air_quality.ShowAlign.Centre)
    for (let index = 0; index <= history[sensors.indexOf(currentSensor)].length - 1; index++) {
        tempY = Math.map(history[sensors.indexOf(currentSensor)][index], minHistory[sensors.indexOf(currentSensor)] * 0.999, maxHistory[sensors.indexOf(currentSensor)] * 1.001, graphMinY, graphMaxY)
        kitronik_air_quality.setPixel(index, Math.constrain(tempY, graphMaxY, graphMinY))
    }
}
// Toggle to the next mode
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (currentMode == "GraphMode") {
        currentSensor = sensors[(sensors.indexOf(currentSensor) + 1) % sensors.length]
        kitronik_air_quality.clear()
        updateHeader()
        updateGraphMode()
    }
})
function initVariables () {
    sensors = [
    "T",
    "H",
    "P",
    "L",
    "C",
    "Q"
    ]
    units = [
    "C",
    "RH",
    "kP",
    "L",
    "ppm",
    "IAQ %"
    ]
    currentSensor = sensors[0]
    history = [
    [0],
    [0],
    [0],
    [0],
    [0, 0],
    []
    ]
    maxHistoryLength = 128
    liveBeat = true
    logBeat = true
    readBeat = true
    currentMode = "LiveMode"
    graphMaxY = 23
    graphMinY = 63
    maxHistory = [
    0,
    0,
    0,
    0,
    0,
    0
    ]
    maxGlobal = [
    0,
    0,
    0,
    0,
    0,
    0
    ]
    minHistory = [
    1000,
    1000,
    1000,
    1000,
    1000,
    1000
    ]
    minGlobal = [
    1000,
    1000,
    1000,
    1000,
    1000,
    1000
    ]
    currentReadings = [
    0,
    0,
    0,
    0,
    0,
    0
    ]
}
function updateLiveMode () {
    for (let index = 0; index <= sensors.length - 1; index++) {
        kitronik_air_quality.show("" + limitDigits(minGlobal[index], 6, 0), index + 2, kitronik_air_quality.ShowAlign.Left)
        kitronik_air_quality.show("" + limitDigits(currentReadings[index], 6, 0) + " " + units[index], index + 2, kitronik_air_quality.ShowAlign.Centre)
        kitronik_air_quality.show("" + limitDigits(maxGlobal[index], 6, 0), index + 2, kitronik_air_quality.ShowAlign.Right)
    }
}
let currentReading = 0
let minGlobal: number[] = []
let maxGlobal: number[] = []
let readBeat = false
let logBeat = false
let liveBeat = false
let maxHistoryLength = 0
let graphMaxY = 0
let graphMinY = 0
let tempY = 0
let history: number[][] = []
let currentReadings: number[] = []
let minHistory: number[] = []
let maxHistory: number[] = []
let sensors: string[] = []
let units: string[] = []
let currentSensor = ""
let result = ""
let numString = ""
let currentMode = ""
let temp = 0
let bubblePop = false
let arrCopy: number[] = []
let enableGasSensor = true
if (input.logoIsPressed()) {
    kitronik_air_quality.sendAllData()
    music.play(music.tonePlayable(523, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    while (true) {
        basic.pause(5000)
    }
}
if (input.buttonIsPressed(Button.A)) {
    kitronik_air_quality.eraseData()
    music.play(music.tonePlayable(523, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
}
if (input.buttonIsPressed(Button.B)) {
    setupLogging()
    music.play(music.tonePlayable(523, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    while (true) {
        basic.pause(5000)
    }
}
let test = [
6,
1,
5,
7
]
basic.showNumber(nthRank(true, test, 2))
basic.pause(200)
let statusLEDs = kitronik_air_quality.createAirQualityZIPDisplay()
statusLEDs.clear()
statusLEDs.setBrightness(10)
statusLEDs.setZipLedColor(0, kitronik_air_quality.colors(ZipLedColors.Red))
statusLEDs.show()
if (enableGasSensor) {
    kitronik_air_quality.setupGasSensor()
    kitronik_air_quality.calcBaselines()
} else {
    kitronik_air_quality.includeIAQ(kitronik_air_quality.onOff(false))
    kitronik_air_quality.includeCO2(kitronik_air_quality.onOff(false))
}
statusLEDs.setZipLedColor(0, kitronik_air_quality.colors(ZipLedColors.Black))
statusLEDs.show()
music.play(music.tonePlayable(523, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
initVariables()
kitronik_air_quality.clear()
updateHeader()
loops.everyInterval(2000, function () {
    kitronik_air_quality.measureData()
    currentReadings[0] = kitronik_air_quality.readTemperature(kitronik_air_quality.TemperatureUnitList.C)
    currentReadings[1] = kitronik_air_quality.readHumidity()
    currentReadings[2] = kitronik_air_quality.readPressure(kitronik_air_quality.PressureUnitList.Pa) / 1000
    currentReadings[3] = input.lightLevel()
    if (enableGasSensor) {
        currentReadings[4] = kitronik_air_quality.readeCO2()
        currentReadings[5] = kitronik_air_quality.getAirQualityPercent()
    }
    for (let index = 0; index <= sensors.length - 1; index++) {
        currentReading = currentReadings[index]
        if (currentReading > maxGlobal[index]) {
            maxGlobal[index] = currentReading
        }
        if (currentReading > maxHistory[index]) {
            maxHistory[index] = currentReading
        }
        if (currentReading < minGlobal[index]) {
            minGlobal[index] = currentReading
        }
        if (currentReading < minHistory[index]) {
            minHistory[index] = currentReading
        }
    }
    if (readBeat) {
        statusLEDs.setZipLedColor(0, kitronik_air_quality.colors(ZipLedColors.Red))
    } else {
        statusLEDs.setZipLedColor(0, kitronik_air_quality.colors(ZipLedColors.Black))
    }
    statusLEDs.show()
    readBeat = !(readBeat)
})
loops.everyInterval(2000, function () {
    if (currentMode == "LiveMode") {
        updateLiveMode()
    }
    if (liveBeat) {
        statusLEDs.setZipLedColor(2, kitronik_air_quality.colors(ZipLedColors.Blue))
    } else {
        statusLEDs.setZipLedColor(2, kitronik_air_quality.colors(ZipLedColors.Black))
    }
    statusLEDs.show()
    liveBeat = !(liveBeat)
})
basic.forever(function () {
	
})
loops.everyInterval(168750, function () {
    for (let index = 0; index <= sensors.length - 1; index++) {
        if (history[index].length == maxHistoryLength) {
            if (history[index][0] == maxHistory[index]) {
                maxHistory[index] = nthRank(true, history[index], 2)
            }
            if (history[index][0] == minHistory[index]) {
                minHistory[index] = nthRank(false, history[index], 2)
            }
            history[index].shift()
        }
        history[index].push(currentReadings[index])
    }
    kitronik_air_quality.logData()
    if (logBeat) {
        statusLEDs.setZipLedColor(1, kitronik_air_quality.colors(ZipLedColors.Green))
    } else {
        statusLEDs.setZipLedColor(1, kitronik_air_quality.colors(ZipLedColors.Black))
    }
    statusLEDs.show()
    logBeat = !(logBeat)
})
