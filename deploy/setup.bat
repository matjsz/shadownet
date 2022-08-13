@ECHO OFF
:NODE
echo install node? (y/n)
set/p "i=> "
if %i% == y goto INSTALL
if %i% == Y goto INSTALL
if %i% == n goto PROBE
if %i% == N goto PROBE
goto NODE

:PROBE
echo initialize probe now? (y/n)
set/p "c=> "
if %c% == y goto INIT
if %c% == Y goto INIT
if %c% == n goto END
if %c% == N goto END
goto PROBE

:INSTALL
start /w install-node.msi
echo succesfully installed node.
goto PROBE

:INIT
echo install forever? (y/n)
set/p "f=> "
if %f% == y goto FOREVER
if %f% == Y goto FOREVER
forever start probe.js
goto END

:FOREVER
npm i forever -g
goto INIT

:END