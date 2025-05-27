# Python program to read
# json file
 
import json

def process_inputs():
    #Break down inputs
    iterate = 0
    for ref in sets:
        sets[iterate] = ref.split(" ")
        if 0 <= 1 < len(sets[iterate]):
            sets[iterate][1] = sets[iterate][1].split("-")
        
        #print(sets);
        
        if 0 <= 2 < len(sets[iterate]):
            sets[iterate][2] = sets[iterate][2].split("-")
        
        #print(sets);
        
        iterate += 1

def create_json():
    # JSON file
    in_file = open ('kjv_bible.json', "r")
     
    # Reading from file
    data = json.loads(in_file.read())

    #make JSON data set
    first_book = True
    prev_book = ""
    prev_chap = ""
    set_dict = {}
    for ref in sets:
        if len(ref) > 1:
            if len(ref[1]) > 1:
                start_chap = int(ref[1][0])
                end_chap = int(ref[1][1])+1
            else:
                start_chap = int(ref[1][0])
                end_chap = int(ref[1][0])+1
        else:
            start_chap = 1
            end_chap = len(data[ref[0]])+1

        if ref[0] not in set_dict:
            temp_dict = {ref[0]:{}}
            set_dict.update(temp_dict)

        for x in range(start_chap, end_chap):
            if len(ref) > 2:
                if len(ref[2]) > 1:
                    start_vers = int(ref[2][0])
                    if ref[2][1] == "":
                        end_vers = start_vers+1
                    else:
                        end_vers = int(ref[2][1])+1
                else:
                    start_vers = int(ref[2][0])
                    end_vers = int(ref[2][0])+1
            else:
                start_vers = 1
                end_vers = len(data[ref[0]][str(x)])+1
                
            if x == end_chap-1:
                true_end = end_vers
            else:
                true_end = len(data[ref[0]][str(x)])

            if x == start_chap:
                true_start = start_vers
            else:
                true_start = 1

            if x not in set_dict[ref[0]]:
                temp_dict = {x:{}}
                set_dict[ref[0]].update(temp_dict)

            #print("start " + str(true_start))
            #print("end " + str(true_end))
            for y in range(true_start, true_end):
                temp_dict = {y:data[ref[0]][str(x)][str(y)]}
                set_dict[ref[0]][x].update(temp_dict)

    #print(set_dict)
    #temp_dict = {"sort":sets}
    #set_dict.update(temp_dict)
    json_string = json.dumps(set_dict)
    out_file.write(division + " = '" + json_string[0:-1].replace("'", "\\'") +", \"sort\":\"" + sets_text + "\"}'")
    #out_file.write(division + " = '" + json_string[0:-1].replace("'", "\\'") + "}'")

#division = input("Enter the division of study: ")
print("Enter all lists of verses in the following fashion \n (Book Chapter Verse-Range, Ex. Acts 1 1-26,1John,Genesis 1-2 1-5)")
#verses = "Acts 1 1-26,1John,Genesis 1-2 1-5"
EXP_2025 = "John 1 1-18,Luke 1 5-80,Matthew 1 18-25,Luke 2 1-38,Matthew 2 1-23,Luke 2 40-52,Matthew 3 1-10,Luke 3 15-18,Matthew 3 13-17,Luke 3 23-23,Matthew 4 1-11,John 1 19-51,John 2 1-25,John 3 1-36,John 4 1-45,Mark 1 14-15,John 4 46-54,Luke 4 16-31,Matthew 4 13-16,Luke 5 1-11,Mark 1 21-34,Matthew 4 23-25,Luke 5 12-16,Mark 2 1-17,Luke 5 33-39,John 5 1-47,Matthew 12 1-21,Luke 6 12-19"
INT_2025 = "John 1 1-18,Luke 1 5-80,Matthew 1 18-25,Luke 2 1-38,Matthew 2 1-23,Luke 2 40-52,Matthew 3 1-10,Luke 3 15-18,Matthew 3 13-17,Luke 3 23-23,Matthew 4 1-11,John 1 19-51,John 2 1-25,John 3 1-36,John 4 1-45,Mark 1 14-15,John 4 46-54,Luke 4 16-31,Matthew 4 13-16,Luke 5 1-11,Mark 1 21-34,Matthew 4 23-25,Luke 5 12-16"
JUN_2025 = "John 1 1-14,Luke 1 26-37,Matthew 1 18-25,Luke 2 1-14,Matthew 2 1-12,Luke 2 40-52,Matthew 3 1-10,Luke 3 15-18,Matthew 3 13-17,Luke 3 23-,Matthew 4 1-11,John 1 35-51,John 2 1-21,John 3 1-22,John 4 1-14,Luke 5 1-11,Mark 1 21-34,Matthew 4 23-25,Luke 5 12-16,Mark 2 1-11,John 5 1-13,Matthew 12 1-16,Luke 6 12-19"
BEG_2025 = "John 1 1-14,Luke 1 26-37,Matthew 1 18-25,Luke 2 1-14,Matthew 2 1-12,Luke 2 40-52,Matthew 3 1-10,Luke 3 15-18,Matthew 3 13-17,Luke 3 23-,Matthew 4 1-11,John 1 35-51,John 2 1-21,John 3 1-22"

#print(sets);

#BEGINNER
beginner = BEG_2025 #input("Enter the list of Beginner verses: ")
out_file = open("beginner.json", "w")
division = "beginner"

sets = beginner.split(",")
sets_text = beginner

process_inputs()

create_json()

#JUNIOR 
junior = JUN_2025 #input("Enter the list of Junior verses: ")
out_file = open("junior.json", "w")
division = "junior"

sets = junior.split(",")
sets_text = junior

process_inputs()

create_json()

#INTERMEDIATE
intermediate = INT_2025 #input("Enter the list of Intermediate verses: ")
out_file = open("intermediate.json", "w")
division = "intermediate"

sets = intermediate.split(",")
sets_text = intermediate

process_inputs()

create_json()

#EXPERIENCED
experienced = EXP_2025 #input("Enter the list of Experienced verses: ")
out_file = open("experienced.json", "w")
division = "experienced"

sets = experienced.split(",")
sets_text = experienced

process_inputs()

create_json()
 
# Closing file
out_file.close()
print("Process Completed")
