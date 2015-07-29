import RPi.GPIO as GPIO
import sys
import time
GPIO.setmode(GPIO.BCM)

controls = [
   {
        "pin" : 26,
        "led" : 21
    },
    {
        "pin" : 19,    
        "led" : 20
    },
    {
        "pin" : 13,
        "led" : 16
    },
    {
        "pin" : 6,
        "led" : 12
    }
]

def setup_pins():
    for x in controls:
        print x['pin']
        print x['led']
        GPIO.setup(x['led'], GPIO.OUT)
        GPIO.setup(x['pin'], GPIO.IN, GPIO.PUD_DOWN)

def light(pin, light):
    GPIO.output(pin, light)

def listen_to_buttons():
    while True:
        for x in controls:
            print GPIO.input(x['pin'])
            print x['pin']
            print x['led']
            light(x['led'], GPIO.input(x['pin']) == True)




if __name__ == '__main__':
    #pin = int(sys.argv[1])
    #print pin
    #setup_pins()
    #listen_to_buttons()
    print 'cleanup'
    GPIO.cleanup()
