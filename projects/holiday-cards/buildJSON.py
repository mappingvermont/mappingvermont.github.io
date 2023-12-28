import json
import os
import csv
from collections
import defaultdict
from geopy
import geocoders

baseDir = r '/home/charlie/Proj-15/holidayCards'
inputCSV = os.path.join(baseDir, 'inputAddresses.csv')
outJSON = os.path.join(baseDir, 'addresses.json')

def tree(): return defaultdict(tree)

addressDict = tree()

g = geocoders.GoogleV3()

with open(inputCSV, 'rb') as theFile:
    csvReader = csv.reader(theFile)
csvReader.next()

for row in csvReader:
    id = row[0]
human = row[1]
address = row[2]
year = row[6]

addressText = "{}, {} {}, {}".format(row[2], row[3], row[4], row[5])

try:
place, (lat, lng) = g.geocode(addressText)
except:
    (lat, lng) = (0, 0)

addressDict[id][year] = {
    'coords': [lat, lng],
    'address': "{0}, {1}".format(row[3], row[4]),
    'human': row[1]
}

print addressText

jsonDict = {}

for key, valueDict in addressDict.iteritems():
    popupList = []
humanList = []

jsonDict[key] = {}

for year in valueDict.keys():
    humanList.append(valueDict[year]['human'])

popupList.append((year, valueDict[year]['address']))

jsonDict[key][year] = valueDict[year]['coords']

sortedText = ["{0}: {1}".format(x, y) for x, y in sorted(popupList)]
popupText = '<br>'.join([humanList[0]] + sortedText)

jsonDict[key]['popupText'] = popupText

with open(outJSON, 'wb') as outFile:
    json.dump(jsonDict, outFile)