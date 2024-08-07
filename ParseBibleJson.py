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
    json_string = json.dumps(set_dict)
    out_file.write(division + " = '" + json_string[0:-1].replace("'", "\\'") +"}'")

#division = input("Enter the division of study: ")
print("Enter all lists of verses in the following fashion \n (Book Chapter Verse-Range, Ex. Acts 1 1-26,1John,Genesis 1-2 1-5)")
#verses = "Acts 1 1-26,1John,Genesis 1-2 1-5"

#print(sets);

#BEGINNER
beginner = input("Enter the list of Beginner verses: ")
out_file = open("beginner.json", "w")
division = "beginner"

sets = beginner.split(",")

process_inputs()

create_json()

#JUNIOR 
junior = input("Enter the list of Junior verses: ")
out_file = open("junior.json", "w")
division = "junior"

sets = junior.split(",")

process_inputs()

create_json()

#INTERMEDIATE
intermediate = input("Enter the list of Intermediate verses: ")
out_file = open("intermediate.json", "w")
division = "intermediate"

sets = intermediate.split(",")

process_inputs()

create_json()

#EXPERIENCED
experienced = input("Enter the list of Experienced verses: ")
out_file = open("experienced.json", "w")
division = "experienced"

sets = experienced.split(",")

process_inputs()

create_json()
 
# Closing file
out_file.close()
print("Process Completed")
