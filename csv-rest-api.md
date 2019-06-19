## GET serialisierung von CSV requests

### Regionen auswählen

alle landkreise in brandenburg

    ?region=all&level=3&parent=12

liste von regionen

    ?region=10,12,13

alle bundesländer (default)

    ?region=all&level=1

### Zeitraum festlegen

alle jahre (default)

    ?time=all

zeitraum von-bis

    ?time=range&from=2000&to=2010

einzelne jahre

    ?time=2000,2004,2012

### Statistiken auswählen

einbürgerungstatistik > einbürgerung von ausländern

    ?stats=R12511:BEV008

einbürgerung von ausländern mit aufenthaltsdauer von unter 8 jahren

    ?stats=R12511:BEV008:AUFDA1:in:AUFDA00B08

einbürgerung von ausländern mit aufenthaltsdauer von unter 8 jahren
oder von 15 bis unter 20 jahren. mehrere argument-werte werden mit `|`
voneinander getrennt.

    ?stats=R12511:BEV008:AUFDA1:in:AUFDA00B08|AUFDA15B20

zweite statistik hinzufügen. mehrere statistiken werden mit `,` 
voneinander getrennt

    ?stats=R12511:BEV008:AUFDA1,R12612:BEV001

### CSV Export Parameter

csv format einstellen: eine zeile pro wert

    ?format=long

csv format einstellen: eine zeile pro region

    ?format=region

csv format einstellen: eine zeile pro jahr

    ?format=time

csv beschriftung einstellen: nur kürzel

    ?labels=id

csv beschriftung einstellen: ausgeschriebene namen

    ?labels=name

csv beschriftung: id + name

    ?labels=both
