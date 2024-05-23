input.onButtonPressed(Button.A, function () {
    liveGraphMode = false
    kitronik_air_quality.clear()
    kitronik_air_quality.refresh()
    kitronik_air_quality.show("" + currentMode + " - Replay Mode", 1, kitronik_air_quality.ShowAlign.Left)
    kitronik_air_quality.show(history[modes.indexOf(currentMode)].length, 1, kitronik_air_quality.ShowAlign.Right)
    for (let index = 0; index <= history[modes.indexOf(currentMode)].length - 1; index++) {
        kitronik_air_quality.setPixel(index, Math.constrain(Math.map(history[modes.indexOf(currentMode)][index], minGlobal[modes.indexOf(currentMode)], maxGlobal[modes.indexOf(currentMode)], graphMinY, graphMaxY), graphMaxY, graphMinY))
    }
})
function eraseGraph () {
    kitronik_air_quality.clear()
}
input.onButtonPressed(Button.B, function () {
    liveGraphMode = !(liveGraphMode)
})
// Toggle to the next mode
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    currentMode = modes[(modes.indexOf(currentMode) + 1) % modes.length]
    kitronik_air_quality.clear()
    basic.showString("" + (currentMode))
})
function initVariables () {
    modes = ["T", "H"]
    currentMode = modes[0]
    basic.showString("" + (currentMode))
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
let modes: string[] = []
let history: number[][] = []
let currentMode = ""
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
loops.everyInterval(200, function () {
    kitronik_air_quality.measureData()
    currentReading[0] = kitronik_air_quality.readTemperature(kitronik_air_quality.TemperatureUnitList.C)
    currentReading[1] = kitronik_air_quality.readHumidity()
    kitronik_air_quality.show(maxGlobal[modes.indexOf(currentMode)], 2, kitronik_air_quality.ShowAlign.Right)
    kitronik_air_quality.show(minGlobal[modes.indexOf(currentMode)], 2, kitronik_air_quality.ShowAlign.Left)
    kitronik_air_quality.show(currentReading[modes.indexOf(currentMode)], 2, kitronik_air_quality.ShowAlign.Centre)
    if (liveGraphMode) {
        kitronik_air_quality.show("" + currentMode + " - Live Mode", 1, kitronik_air_quality.ShowAlign.Centre)
        kitronik_air_quality.plot(Math.map(currentReading[modes.indexOf(currentMode)], 15, 30, 0, 100))
    }
    for (let index = 0; index <= modes.length - 1; index++) {
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
