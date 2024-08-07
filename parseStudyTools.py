import json
import string
from pprint import pprint
    
with open("intermediate.json", 'r') as json_file:
    code_text = json_file.read()
    exec(code_text)
    json_data = json.loads(intermediate)
    #print(json.dumps(json_data, indent=2))

counts = dict()

for book in json_data:
    for chap in json_data[book]:
        for verse in json_data[book][chap]:
            for word in json_data[book][chap][verse].split(' '):
                fixed_word = word.lower().translate(str.maketrans('', '', string.punctuation))
                
                if fixed_word in counts:
                    counts[fixed_word] += 1
                else:
                    counts[fixed_word] = 1


one_time = {key : val for key, val in counts.items() if val == 1}
two_time = {key : val for key, val in counts.items() if val == 2}
three_time = {key : val for key, val in counts.items() if val == 3}

print("one time words: ")
pprint(one_time)

print("two time words: ")
pprint(two_time)

print("three time words: ")
pprint(three_time)
