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
function updateHeader () {
    kitronik_air_quality.clearLine(1)
    kitronik_air_quality.clearLine(2)
    basic.showString("" + (currentSensor))
    if (currentMode == "LiveMode") {
        kitronik_air_quality.show("Live Mode", 1, kitronik_air_quality.ShowAlign.Centre)
    }
    if (currentMode == "GraphMode") {
        kitronik_air_quality.show(currentSensor, 1, kitronik_air_quality.ShowAlign.Left)
        kitronik_air_quality.show("Graph Mode", 1, kitronik_air_quality.ShowAlign.Centre)
    }
}
input.onButtonPressed(Button.AB, function () {
	
})
input.onButtonPressed(Button.B, function () {
    currentMode = "LiveMode"
    kitronik_air_quality.clear()
    updateHeader()
})
function updateGraphMode () {
    kitronik_air_quality.show(" " + maxHistory[sensors.indexOf(currentSensor)] + " ", 2, kitronik_air_quality.ShowAlign.Right)
    kitronik_air_quality.show(" " + minHistory[sensors.indexOf(currentSensor)] + " ", 2, kitronik_air_quality.ShowAlign.Left)
    kitronik_air_quality.show(" " + currentReadings[sensors.indexOf(currentSensor)] + " ", 2, kitronik_air_quality.ShowAlign.Centre)
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
    sensors = ["T", "H"]
    units = ["C", "RH"]
    currentSensor = sensors[0]
    history = [[0], [0]]
    play = [[0], [0]]
    play[0].removeAt(0)
    maxHistoryLength = 128
    heartBeat = true
    historyBeat = true
    currentMode = "LiveMode"
    graphMaxY = 23
    graphMinY = 63
    maxHistory = [0, 0]
    maxGlobal = [0, 0]
    minHistory = [100, 100]
    minGlobal = [100, 100]
    currentReadings = [0, 0]
}
function updateLiveMode () {
    for (let index = 0; index <= sensors.length - 1; index++) {
        kitronik_air_quality.show("" + minGlobal[index] + " ", index + 2, kitronik_air_quality.ShowAlign.Left)
        kitronik_air_quality.show(" " + currentReadings[index] + " " + units[index], index + 2, kitronik_air_quality.ShowAlign.Centre)
        kitronik_air_quality.show(" " + maxGlobal[index] + "", index + 2, kitronik_air_quality.ShowAlign.Right)
    }
}
let currentReading = 0
let minGlobal: number[] = []
let maxGlobal: number[] = []
let historyBeat = false
let heartBeat = false
let maxHistoryLength = 0
let play: number[][] = []
let units: string[] = []
let graphMaxY = 0
let graphMinY = 0
let tempY = 0
let history: number[][] = []
let currentReadings: number[] = []
let minHistory: number[] = []
let sensors: string[] = []
let maxHistory: number[] = []
let currentSensor = ""
let currentMode = ""
let temp = 0
let bubblePop = false
let arrCopy: number[] = []
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
initVariables()
statusLEDs.setZipLedColor(1, kitronik_air_quality.colors(ZipLedColors.Green))
statusLEDs.show()
kitronik_air_quality.clear()
updateHeader()
loops.everyInterval(500, function () {
    kitronik_air_quality.measureData()
    currentReadings[0] = kitronik_air_quality.readTemperature(kitronik_air_quality.TemperatureUnitList.C)
    currentReadings[1] = kitronik_air_quality.readHumidity()
    if (currentMode == "LiveMode") {
        updateLiveMode()
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
    if (heartBeat) {
        statusLEDs.setZipLedColor(2, kitronik_air_quality.colors(ZipLedColors.Blue))
    } else {
        statusLEDs.setZipLedColor(2, kitronik_air_quality.colors(ZipLedColors.Black))
    }
    statusLEDs.show()
    heartBeat = !(heartBeat)
})
loops.everyInterval(2000, function () {
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
    if (historyBeat) {
        statusLEDs.setZipLedColor(1, kitronik_air_quality.colors(ZipLedColors.Green))
    } else {
        statusLEDs.setZipLedColor(1, kitronik_air_quality.colors(ZipLedColors.Black))
    }
    historyBeat = !(historyBeat)
})
basic.forever(function () {
	
})
