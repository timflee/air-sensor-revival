input.onButtonPressed(Button.A, function () {
    liveGraphMode = false
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
    kitronik_air_quality.show(currentSensor, 1, kitronik_air_quality.ShowAlign.Left)
    if (liveGraphMode) {
        kitronik_air_quality.show("Live Mode", 1, kitronik_air_quality.ShowAlign.Centre)
    } else {
        kitronik_air_quality.show("Replay Mode", 1, kitronik_air_quality.ShowAlign.Centre)
    }
}
input.onButtonPressed(Button.B, function () {
    liveGraphMode = !(liveGraphMode)
    updateHeader()
})
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
    liveGraphMode = true
    graphMaxY = 23
    graphMinY = 63
    maxGlobal = [0, 0]
    minGlobal = [100, 100]
    currentReading = [0, 0]
}
let currentReading: number[] = []
let heartBeat = false
let maxHistoryLength = 0
let play: number[][] = []
let graphMaxY = 0
let graphMinY = 0
let maxGlobal: number[] = []
let minGlobal: number[] = []
let currentSensor = ""
let sensors: string[] = []
let history: number[][] = []
let liveGraphMode = false
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
    kitronik_air_quality.show(maxGlobal[sensors.indexOf(currentSensor)], 2, kitronik_air_quality.ShowAlign.Right)
    kitronik_air_quality.show(minGlobal[sensors.indexOf(currentSensor)], 2, kitronik_air_quality.ShowAlign.Left)
    kitronik_air_quality.show(currentReading[sensors.indexOf(currentSensor)], 2, kitronik_air_quality.ShowAlign.Centre)
    if (liveGraphMode) {
        kitronik_air_quality.plot(Math.map(currentReading[sensors.indexOf(currentSensor)], 15, 30, 0, 100))
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
