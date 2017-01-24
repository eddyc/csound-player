<CsoundSynthesizer>
<CsOptions>
</CsOptions>
<CsInstruments>

sr      =  44100
ksmps   =  10
nchnls  =  2

        instr 1
kcps    expon p4, p3, p5                ; instr 1: basic vco2 example
a1      vco2 12000, kcps                ; (sawtooth wave with default
        outs a1, a1                          ; parameters)
        endin
</CsInstruments>
<CsScore>
i 1  0 3 20 2000
</CsScore>
</CsoundSynthesizer>
