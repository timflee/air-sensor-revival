function nthRank (largest: boolean, arr: number[], rank: number) {
    arrCopy = []
    for (let index = 0; index <= arr.length - 1; index++) {
        arrCopy.push(arr[index])
    }
    bubblePop = true
    while (bubblePop) {
        bubblePop = false
        for (let index = 0; index <= arrCopy.length - 2; index++) {
            let list: number[] = []
            if (list[index] > list[index + 1]) {
                bubblePop = true
                temp = arrCopy[index]
                arrCopy[index] = arrCopy[index + 1]
                arrCopy[index + 1] = temp
            }
        }
    }
}
input.onButtonPressed(Button.A, function () {
    currentMode = "GraphMode"
    kitronik_air_quality.clear()
    updateHeader()
    for (let index = 0; index <= history[sensors.indexOf(currentSensor)].length - 1; index++) {
        kitronik_air_quality.setPixel(index, Math.constrain(Math.map(history[sensors.indexOf(currentSensor)][index], minGlobal[sensors.indexOf(currentSensor)], maxGlobal[sensors.indexOf(currentSensor)], graphMinY, graphMaxY), graphMaxY, graphMinY))
    }
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
    kitronik_air_quality.clear()
    currentMode = "LiveMode"
    updateHeader()
})
function updateGraphMode () {
    kitronik_air_quality.show(maxGlobal[sensors.indexOf(currentSensor)], 2, kitronik_air_quality.ShowAlign.Right)
    kitronik_air_quality.show(minGlobal[sensors.indexOf(currentSensor)], 2, kitronik_air_quality.ShowAlign.Left)
    kitronik_air_quality.show(currentReading[sensors.indexOf(currentSensor)], 2, kitronik_air_quality.ShowAlign.Centre)
}
// Toggle to the next mode
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    currentSensor = sensors[(sensors.indexOf(currentSensor) + 1) % sensors.length]
    updateHeader()
})
function initVariables () {
    sensors = ["T", "H"]
    currentSensor = sensors[0]
    history = [[0], [0]]
    play = [[0], [0]]
    play[0].removeAt(0)
    maxHistoryLength = 128
    heartBeat = true
    currentMode = "LiveMode"
    graphMaxY = 23
    graphMinY = 63
    maxGlobal = [0, 0]
    minGlobal = [100, 100]
    currentReading = [0, 0]
}
function updateLiveMode () {
    kitronik_air_quality.show("Temp", 2, kitronik_air_quality.ShowAlign.Left)
    kitronik_air_quality.show("RH", 3, kitronik_air_quality.ShowAlign.Left)
    kitronik_air_quality.show("Pressure", 5, kitronik_air_quality.ShowAlign.Left)
}
let heartBeat = false
let maxHistoryLength = 0
let play: number[][] = []
let currentReading: number[] = []
let graphMaxY = 0
let graphMinY = 0
let maxGlobal: number[] = []
let minGlobal: number[] = []
let currentSensor = ""
let sensors: string[] = []
let history: number[][] = []
let currentMode = ""
let temp = 0
let bubblePop = false
let arrCopy: number[] = []
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
basic.forever(function () {
	
})
loops.everyInterval(200, function () {
    kitronik_air_quality.measureData()
    currentReading[0] = kitronik_air_quality.readTemperature(kitronik_air_quality.TemperatureUnitList.C)
    currentReading[1] = kitronik_air_quality.readHumidity()
    if (currentMode == "GraphMode") {
        updateGraphMode()
    }
    if (currentMode == "LiveMode") {
        updateLiveMode()
    }
    for (let index = 0; index <= sensors.length - 1; index++) {
        if (currentReading[index] > maxGlobal[index]) {
            maxGlobal[index] = currentReading[index]
        }
        if (currentReading[index] < minGlobal[index]) {
            minGlobal[index] = currentReading[index]
        }
        if (history[index].length == maxHistoryLength) {
            history[index].shift()
        }
        history[index].push(currentReading[index])
    }
    if (heartBeat) {
        statusLEDs.setZipLedColor(2, kitronik_air_quality.colors(ZipLedColors.Blue))
    } else {
        statusLEDs.setZipLedColor(2, kitronik_air_quality.colors(ZipLedColors.Black))
    }
    statusLEDs.show()
    heartBeat = !(heartBeat)
})
