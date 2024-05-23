def on_button_pressed_a():
    global liveGraphMode
    liveGraphMode = False
    kitronik_air_quality.clear()
    kitronik_air_quality.refresh()
    kitronik_air_quality.show("" + currentMode + " - Replay Mode",
        1,
        kitronik_air_quality.ShowAlign.CENTRE)
    index = 0
    while index <= len(history[modes.index(currentMode)]) - 1:
        kitronik_air_quality.set_pixel(index, index)
        index += 1
input.on_button_pressed(Button.A, on_button_pressed_a)

def eraseGraph():
    kitronik_air_quality.clear()

def on_button_pressed_b():
    global liveGraphMode
    liveGraphMode = not (liveGraphMode)
input.on_button_pressed(Button.B, on_button_pressed_b)

# Toggle to the next mode

def on_logo_pressed():
    global currentMode
    currentMode = modes[(modes.index(currentMode) + 1) % len(modes)]
    kitronik_air_quality.clear()
    basic.show_string("" + (currentMode))
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_pressed)

def initVariables():
    global modes, currentMode, history, play, maxHistoryLength, heartBeat, liveGraphMode, graphMaxY, graphMinY, maxGlobal, minGlobal, currentReading
    modes = ["T", "H"]
    currentMode = modes[0]
    basic.show_string("" + (currentMode))
    history = [[0], [0], [0]]
    play = [[0], [0], [0]]
    play[0].remove_at(0)
    maxHistoryLength = 128
    heartBeat = True
    liveGraphMode = True
    graphMaxY = 23
    graphMinY = 63
    maxGlobal = [0, 0, 0]
    minGlobal = [100, 100, 100]
    currentReading = [0, 0, 0]
currentReading: List[number] = []
minGlobal: List[number] = []
maxGlobal: List[number] = []
graphMinY = 0
graphMaxY = 0
heartBeat = False
maxHistoryLength = 0
play: List[List[number]] = []
modes: List[str] = []
history: List[List[number]] = []
currentMode = ""
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

def on_forever():
    pass
basic.forever(on_forever)

def on_every_interval():
    global heartBeat
    kitronik_air_quality.measure_data()
    currentReading[0] = kitronik_air_quality.read_temperature(kitronik_air_quality.TemperatureUnitList.C)
    currentReading[1] = kitronik_air_quality.read_humidity()
    kitronik_air_quality.show(maxGlobal[modes.index(currentMode)],
        2,
        kitronik_air_quality.ShowAlign.RIGHT)
    kitronik_air_quality.show(minGlobal[modes.index(currentMode)],
        2,
        kitronik_air_quality.ShowAlign.LEFT)
    kitronik_air_quality.show(currentReading[modes.index(currentMode)],
        2,
        kitronik_air_quality.ShowAlign.CENTRE)
    if liveGraphMode:
        kitronik_air_quality.show("" + currentMode + " - Live Mode",
            1,
            kitronik_air_quality.ShowAlign.CENTRE)
        kitronik_air_quality.plot(Math.map(currentReading[modes.index(currentMode)], 15, 30, 0, 100))
    index2 = 0
    while index2 <= len(modes) - 1:
        if currentReading[index2] > maxGlobal[index2]:
            maxGlobal[index2] = currentReading[index2]
        if currentReading[index2] < minGlobal[index2]:
            minGlobal[index2] = currentReading[index2]
        if len(history[index2]) == maxHistoryLength:
            history[index2].shift()
        history[0].append(currentReading[index2])
        index2 += 1
    if heartBeat:
        statusLEDs.set_zip_led_color(2, kitronik_air_quality.colors(ZipLedColors.BLUE))
    else:
        statusLEDs.set_zip_led_color(2, kitronik_air_quality.colors(ZipLedColors.BLACK))
    statusLEDs.show()
    heartBeat = not (heartBeat)
loops.every_interval(100, on_every_interval)
