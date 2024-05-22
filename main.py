def on_button_pressed_a():
    global liveGraphMode, tempGraph
    liveGraphMode = False
    eraseGraph()
    kitronik_air_quality.show("Temp - Replay Mode",
        1,
        kitronik_air_quality.ShowAlign.CENTRE)
    kitronik_air_quality.show("" + ("" + str(maxTempHistory)),
        2,
        kitronik_air_quality.ShowAlign.RIGHT)
    kitronik_air_quality.show("" + ("" + str(minTempHistory)),
        2,
        kitronik_air_quality.ShowAlign.LEFT)
    kitronik_air_quality.show("" + ("" + str(tempHistory[len(tempHistory) - 1])) + " C",
        2,
        kitronik_air_quality.ShowAlign.CENTRE)
    tempGraph = []
    index = 0
    while index <= len(tempHistory) - 1:
        tempGraph.append(Math.constrain(Math.map(tempHistory[index],
                    minTempHistory,
                    maxTempHistory,
                    graphMinY,
                    graphMaxY),
                graphMaxY,
                graphMinY))
        kitronik_air_quality.set_pixel(index, tempGraph[index])
        index += 1
input.on_button_pressed(Button.A, on_button_pressed_a)

def eraseGraph():
    kitronik_air_quality.clear()

def on_button_pressed_b():
    global liveGraphMode
    liveGraphMode = not liveGraphMode
input.on_button_pressed(Button.B, on_button_pressed_b)

def initVariables():
    global mode, tempHistory, tempGraph, maxHistoryLength, heartBeat, liveGraphMode, graphMaxY, graphMinY, maxTempHistory, minTempHistory, maxTempGlobal, minTempGlobal
    mode = ["summary", "temp", "pressure"]
    tempHistory = []
    tempGraph = []
    maxHistoryLength = 128
    heartBeat = True
    liveGraphMode = True
    graphMaxY = 23
    graphMinY = 63
    maxTempHistory = 0
    minTempHistory = 100
    maxTempGlobal = 15
    minTempGlobal = 30

temp = 0
minTempGlobal = 0
maxTempGlobal = 0
heartBeat = False
maxHistoryLength = 0
mode: List[str] = []
graphMaxY = 0
graphMinY = 0
tempGraph: List[number] = []
tempHistory: List[number] = []
minTempHistory = 0
maxTempHistory = 0
liveGraphMode = False
statusLEDs = kitronik_air_quality.create_air_quality_zip_display()
statusLEDs.clear()
statusLEDs.set_brightness(10)
statusLEDs.set_zip_led_color(0, kitronik_air_quality.colors(ZipLedColors.RED))
statusLEDs.show()
initVariables()
statusLEDs.set_zip_led_color(1, kitronik_air_quality.colors(ZipLedColors.GREEN))
statusLEDs.show()
kitronik_air_quality.clear()

def on_every_interval():
    pass
loops.every_interval(1, on_every_interval)

def on_forever():
    pass
basic.forever(on_forever)

def on_every_interval2():
    global temp, maxTempHistory, minTempHistory, maxTempGlobal, minTempGlobal, heartBeat
    kitronik_air_quality.measure_data()
    temp = kitronik_air_quality.read_temperature(kitronik_air_quality.TemperatureUnitList.C)
    if liveGraphMode:
        kitronik_air_quality.show("Temp - Live Mode", 1, kitronik_air_quality.ShowAlign.CENTRE)
        kitronik_air_quality.show("" + ("" + str(minTempGlobal)),
            2,
            kitronik_air_quality.ShowAlign.LEFT)
        kitronik_air_quality.show("" + ("" + str(maxTempGlobal)),
            2,
            kitronik_air_quality.ShowAlign.RIGHT)
        kitronik_air_quality.show("" + ("" + str(temp)) + " C",
            2,
            kitronik_air_quality.ShowAlign.CENTRE)
        kitronik_air_quality.plot(Math.map(temp, 15, 30, 0, 100))
    if temp > maxTempHistory:
        maxTempHistory = temp
    if temp < minTempHistory:
        minTempHistory = temp
    if temp > maxTempGlobal:
        maxTempGlobal = temp
    if temp < minTempGlobal:
        minTempGlobal = temp
    if len(tempHistory) == maxHistoryLength:
        if tempHistory[0] == maxTempHistory:
            maxTempHistory = tempHistory[1]
        if tempHistory[0] == minTempHistory:
            minTempHistory = tempHistory[1]
        tempHistory.shift()
    tempHistory.append(temp)
    if heartBeat:
        statusLEDs.set_zip_led_color(2, kitronik_air_quality.colors(ZipLedColors.BLUE))
    else:
        statusLEDs.set_zip_led_color(2, kitronik_air_quality.colors(ZipLedColors.BLACK))
    statusLEDs.show()
    heartBeat = not heartBeat
loops.every_interval(100, on_every_interval2)
