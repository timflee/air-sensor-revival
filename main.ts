input.onButtonPressed(Button.A, function () {
    liveGraphMode = false
    eraseGraph()
    kitronik_air_quality.show("Temp - Replay Mode", 1, kitronik_air_quality.ShowAlign.Centre)
    kitronik_air_quality.show("" + maxTempHistory, 2, kitronik_air_quality.ShowAlign.Right)
    kitronik_air_quality.show("" + minTempHistory, 2, kitronik_air_quality.ShowAlign.Left)
    kitronik_air_quality.show(history[0][history[0].length - 1], 2, kitronik_air_quality.ShowAlign.Centre)
    for (let index = 0; index <= history[0].length - 1; index++) {
        kitronik_air_quality.setPixel(index, Math.constrain(Math.map(history[0][index], minTempHistory, maxTempHistory, graphMinY, graphMaxY), graphMaxY, graphMinY))
    }
})
function eraseGraph () {
    kitronik_air_quality.clear()
}
input.onButtonPressed(Button.B, function () {
    liveGraphMode = !(liveGraphMode)
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
	
})
function initVariables () {
    mode = ["temp", "pressure", "humidity"]
    history = [[0], [0], [0]]
    play = [[0], [0], [0]]
    play[0].removeAt(0)
    maxHistoryLength = 128
    heartBeat = true
    liveGraphMode = true
    graphMaxY = 23
    graphMinY = 63
    maxTempHistory = 0
    minTempHistory = 100
    maxTempGlobal = 15
    minTempGlobal = 30
}
let temp = 0
let minTempGlobal = 0
let maxTempGlobal = 0
let heartBeat = false
let maxHistoryLength = 0
let play: number[][] = []
let mode: string[] = []
let graphMaxY = 0
let graphMinY = 0
let history: number[][] = []
let minTempHistory = 0
let maxTempHistory = 0
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
basic.forever(function () {
	
})
loops.everyInterval(100, function () {
    kitronik_air_quality.measureData()
    temp = kitronik_air_quality.readTemperature(kitronik_air_quality.TemperatureUnitList.C)
    if (liveGraphMode) {
        kitronik_air_quality.show("Temp - Live Mode", 1, kitronik_air_quality.ShowAlign.Centre)
        kitronik_air_quality.show("" + minTempGlobal, 2, kitronik_air_quality.ShowAlign.Left)
        kitronik_air_quality.show("" + maxTempGlobal, 2, kitronik_air_quality.ShowAlign.Right)
        kitronik_air_quality.show("" + temp, 2, kitronik_air_quality.ShowAlign.Centre)
        kitronik_air_quality.plot(Math.map(temp, 15, 30, 0, 100))
    }
    if (temp > maxTempHistory) {
        maxTempHistory = temp
    }
    if (temp < minTempHistory) {
        minTempHistory = temp
    }
    if (temp > maxTempGlobal) {
        maxTempGlobal = temp
    }
    if (temp < minTempGlobal) {
        minTempGlobal = temp
    }
    if (history[0].length == maxHistoryLength) {
        if (history[0][0] == maxTempHistory) {
            maxTempHistory = history[0][1]
        }
        if (history[0][0] == minTempHistory) {
            minTempHistory = history[0][1]
        }
        history[0].shift()
    }
    history[0].push(temp)
    if (heartBeat) {
        statusLEDs.setZipLedColor(2, kitronik_air_quality.colors(ZipLedColors.Blue))
    } else {
        statusLEDs.setZipLedColor(2, kitronik_air_quality.colors(ZipLedColors.Black))
    }
    statusLEDs.show()
    heartBeat = !(heartBeat)
})
