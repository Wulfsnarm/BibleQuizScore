import json
import string
import re
from pprint import pprint
    
def main():
    with open("experienced.json", 'r') as json_file:
        code_text = json_file.read()
        #print(code_text)
        # execute code in a defined local environment
        local_env = {}
        exec(code_text, {}, local_env)
        
        # Now, retrieve `intermediate` from the local environment
        json_data = json.loads(local_env["experienced"])
        #print(json.dumps(json_data, indent=2))
        #print(json.dumps(json_data, indent=2))

    for book in json_data:
        for chap in json_data[book]:
            for verse in json_data[book][chap]:
                print(book + " " + chap + ":" + verse)

main()