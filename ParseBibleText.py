# turns bible txt file into json file
file = open("kjv_bible.txt", "r")

prev_book = ""
prev_chap = ""
prev_vers = ""

curr_book = ""
curr_chap = ""
curr_vers = ""

comma = ""

out_file = open("kjv_bible.json", "w")

for line in file:
    if line[1] == " ":
        line = line[0] + line[2:-1]
        
    array = line.split(" ", 2)

    curr_book = array[0]
    curr_chap = array[1].split(":")[0]
    curr_vers = array[1].split(":")[1]

    #print(array)
    #print(curr_book)
    #print(curr_chap)
    #print(curr_vers)
    #print(array[2][:-2])

    if prev_book == "":
        prev_book = curr_book
        out_file.write("{\""+curr_book+"\":{")

    if prev_book != curr_book:
        prev_book = curr_book
        out_file.write("}},\""+curr_book+"\":{")
        prev_chap = "";

    if prev_chap == "":
        prev_chap = curr_chap
        comma = ""
        out_file.write("\""+curr_chap+"\":{")

    if prev_chap != curr_chap:
        prev_chap = curr_chap
        comma = ""
        out_file.write("},\""+curr_chap+"\":{")

    out_file.write(comma+"\""+curr_vers+"\":\""+array[2][:-1]+"\"")
    comma = ","
        

file.close()
