import json

# JSON file
in_file = open ('kjv_bible.json', "r")

out_file = open("bibleLimits.json", "w")
    
# Reading from file
data = json.loads(in_file.read())

out_file.write('{')
count = 1
for x in data:
    out_file.write('"' + x.lower() + '":[' + str(count))
    count += 1
    for y in data[x]:
        out_file.write(',' + str(len(data[x][y])))
    out_file.write('],\n')
out_file.write('}')
        #for z in data[x][y]:
            #print(data[x][y][z])