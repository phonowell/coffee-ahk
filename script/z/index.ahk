﻿
#KeyHistory 0
#MaxThreads 20
#NoEnv
#Persistent
#SingleInstance Force
#UseHook

CoordMode Mouse, Client
CoordMode Pixel, Client
CoordMode ToolTip, Client
SendMode Event
SetBatchLines 100ms
SetKeyDelay 0, 50
SetMouseDelay 0, 50

class Toolkit {
  alert(message := "") {
    MsgBox % message
    return message
  }
}
global $ := new Toolkit()
$.alert("test message")
