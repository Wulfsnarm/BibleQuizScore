import json
import string
import re
from pprint import pprint
    
def multi_words(fname):
    with open(fname + ".json", 'r') as json_file:
        code_text = json_file.read()
        #print(code_text)
        # execute code in a defined local environment
        local_env = {}
        exec(code_text, {}, local_env)
        
        # Now, retrieve `intermediate` from the local environment
        json_data = json.loads(local_env[fname])
        #print(json.dumps(json_data, indent=2))

    counts = dict()

    for book in json_data:
        if book != "sort":
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

    with open(fname + "_study.json", 'w') as out_file:
        new_code = code_text
        for key, value in one_time.items():
            new_code = re.sub(r"(\b" + key + r"\b)", r"<span class=\'stdytlsotw\'>\1</span>", new_code, re.I)
            #print(key + ", " + str(new_code.find(key)))
        for key, value in two_time.items():
            new_code = re.sub(r"(\b" + key + r"\b)", r"<span class=\'stdytlsttw\'>\1</span>", new_code, re.I)
            #print(key + ", " + str(new_code.find(key)))
        for key, value in three_time.items():
            new_code = re.sub(r"(\b" + key + r"\b)", r"<span class=\'stdytlsrtw\'>\1</span>", new_code, re.I)
            #print(key + ", " + str(new_code.find(key)))
        #print(new_code)
        out_file.write(new_code)


multi_words("beginner")
multi_words("junior")
multi_words("intermediate")
multi_words("experienced")