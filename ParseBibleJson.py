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
    try:
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
    except Exception as e:
        print(ref)

    #print(set_dict)
    #temp_dict = {"sort":sets}
    #set_dict.update(temp_dict)
    json_string = json.dumps(set_dict)
    out_file.write(division + " = '" + json_string[0:-1].replace("'", "\\'") +", \"sort\":\"" + sets_text + "\"}'")
    #out_file.write(division + " = '" + json_string[0:-1].replace("'", "\\'") + "}'")

#division = input("Enter the division of study: ")
print("Enter all lists of verses in the following fashion \n (Book Chapter Verse-Range, Ex. Acts 1 1-26,1John,Genesis 1-2 1-5)")
#verses = "Acts 1 1-26,1John,Genesis 1-2 1-5"
#EXP_2025 = "John 1 1-18,Luke 1 5-80,Matthew 1 18-25,Luke 2 1-38,Matthew 2 1-23,Luke 2 40-52,Matthew 3 1-10,Luke 3 15-18,Matthew 3 13-17,Luke 3 23-23,Matthew 4 1-11,John 1 19-51,John 2 1-25,John 3 1-36,John 4 1-45,Mark 1 14-15,John 4 46-54,Luke 4 16-31,Matthew 4 13-16,Luke 5 1-11,Mark 1 21-34,Matthew 4 23-25,Luke 5 12-16,Mark 2 1-17,Luke 5 33-39,John 5 1-47,Matthew 12 1-21,Luke 6 12-19"
#INT_2025 = "John 1 1-18,Luke 1 5-80,Matthew 1 18-25,Luke 2 1-38,Matthew 2 1-23,Luke 2 40-52,Matthew 3 1-10,Luke 3 15-18,Matthew 3 13-17,Luke 3 23-23,Matthew 4 1-11,John 1 19-51,John 2 1-25,John 3 1-36,John 4 1-45,Mark 1 14-15,John 4 46-54,Luke 4 16-31,Matthew 4 13-16,Luke 5 1-11,Mark 1 21-34,Matthew 4 23-25,Luke 5 12-16"
#JUN_2025 = "John 1 1-14,Luke 1 26-37,Matthew 1 18-25,Luke 2 1-14,Matthew 2 1-12,Luke 2 40-52,Matthew 3 1-10,Luke 3 15-18,Matthew 3 13-17,Luke 3 23-,Matthew 4 1-11,John 1 35-51,John 2 1-21,John 3 1-22,John 4 1-14,Luke 5 1-11,Mark 1 21-34,Matthew 4 23-25,Luke 5 12-16,Mark 2 1-11,John 5 1-13,Matthew 12 1-16,Luke 6 12-19"
#BEG_2025 = "John 1 1-14,Luke 1 26-37,Matthew 1 18-25,Luke 2 1-14,Matthew 2 1-12,Luke 2 40-52,Matthew 3 1-10,Luke 3 15-18,Matthew 3 13-17,Luke 3 23-,Matthew 4 1-11,John 1 35-51,John 2 1-21,John 3 1-22"

EXP_2026 = "Exodus 24 12,Deuteronomy 6 6-9,Psalms 19 7-10,Hebrews 4 12,Exodus 34 27,Deuteronomy 27 3,Joshua 24 26,1Samuel 10 25,Isaiah 30 8,Jeremiah 30 1-2,Luke 1 1-3,2Timothy 3 16-17,Hebrews 1 1,2Peter 1 20-21,Psalms 12 6,Psalms 119 9,Psalms 119 89,Psalms 119 105,Psalms 119 130,Proverbs 30 5-6,Isaiah 40 8,Luke 21 33,John 15 3,John 17 17,John 20 30-31,Romans 1 16,Romans 15 4,1Corinthians 10 11,1Peter 1 25,2Peter 1 19,Deuteronomy 8 3,Job 23 12,Psalms 119 103,Jeremiah 15 16,Matthew 4 4,1Peter 2 2,Deuteronomy 17 19,Joshua 1 8,Psalms 37 31,Psalms 40 8,Psalms 119 11,Psalms 119 16,Psalms 119 72,Psalms 119 97,Psalms 119 140,Isaiah 34 16,Hosea 4 6,Matthew 22 29,John 5 39,Colossians 3 16,2Timothy 2 15,Hebrews 8 10,Deuteronomy 4 35,Deuteronomy 4 39,Deuteronomy 6 4-5,Deuteronomy 32 39,Psalms 86 10,Isaiah 42 8,Isaiah 43 10-11,Isaiah 44 6,Isaiah 45 18,Isaiah 45 21-22,Mark 12 29,1Corinthians 8 4,Ephesians 4 5-6,1Timothy 2 5,James 2 19,Revelation 1 8,1Kings 8 27,John 4 24,Acts 17 24-25,2Corinthians 3 17,1Timothy 1 17,Isaiah 9 6,Matthew 1 20-23,John 1 1,John 1 14,John 1 18,John 8 57-58,John 10 30,John 12 45,John 14 8-10,2Corinthians 4 4,2Corinthians 5 19,Philippians 2 5-8,Colossians 1 15,Colossians 1 19,Colossians 2 9,1Timothy 3 16,Titus 2 13,Zechariah 14 9,Matthew 28 19,John 5 43,John 14 17-18,John 14 26,Acts 4 12,Acts 7 59,Acts 9 5,Proverbs 21 4,Proverbs 24 9,Galatians 5 19-21,James 4 17,1John 3 4,Psalms 51 5,Psalms 53 3,Isaiah 53 6,Isaiah 64 6,Jeremiah 17 9,Romans 3 10-12,Romans 3 23,Romans 5 12,Romans 5 14,Romans 5 19,Romans 6 23,James 1 14-15 1John 1 8,Isaiah 12 2,Isaiah 53 1-7,Luke 2 11,Luke 19 10,John 1 29,John 3 14-17,John 10 11,John 15 13,Romans 5 6,1Corinthians 15 3,1Timothy 1 15,Hebrews 2 9,Hebrews 9 28,1Peter 2 24,1Peter 3 18,Revelation 5 9,Exodus 12 13,Leviticus 17 11,Matthew 26 28,Romans 5 9,Hebrews 9 14,Hebrews 9 22,1Peter 1 18-19,1John 1 7,1Samuel 15 22,John 8 31,Romans 6 16,James 1 25,Revelation 22 14,Mark 16 16,John 7 38,Acts 16 31,Romans 10 9-13,Ephesians 2 8,Hebrews 11 6,2Chronicles 7 14,Psalms 34 18,Isaiah 55 7,Ezekiel 18 21,Luke 13 3,Luke 24 47,Acts 2 38,Acts 3 19,Acts 17 30,2Corinthians 7 10,2Peter 3 9,John 3 3-5,1Peter 3 20-21,Acts 8 12,Acts 8 14-16,Acts 10 47-48,Acts 19 1-5,Acts 22 16,Romans 6 3-4,Galatians 3 27,Matthew 3 16,John 3 23,Acts 8 35-39,Ezekiel 36 26-27,Joel 2 28-29,Matthew 3 11,Luke 11 13,Luke 24 49,John 3 7-8,John 7 37-39,John 14 16-18,Acts 1 4-5,Acts 2 16-18,Acts 2 37,Acts 2 39,Acts 8 17,Acts 10 44-46,Acts 11 16-18,Acts 19 6,Romans 8 9-11,Mark 16 17,Acts 2 1-11,Acts 2 33,Zechariah 4 6,Luke 12 12,John 6 63,John 16 13,Acts 1 8,Acts 4 31-33,Romans 5 5,Romans 8 11-17,Romans 8 26-27,1Corinthians 12 13,2Corinthians 3 6,Galatians 4 6,Ephesians 1 13-14,Leviticus 11 45,Leviticus 20 26,Psalms 5 4,Psalms 29 2,Psalms 145 17,Isaiah 35 8,Matthew 5 8,2Corinthians 7 1,Ephesians 4 22-24,Ephesians 5 27,1Thessalonians 3 12-13,Hebrews 12 14-15,1Peter 2 9,1John 1 5,Revelation 21 27,Exodus 23 2,Deuteronomy 12 30,Psalms 19 14,Psalms 101 3,Proverbs 1 10,Proverbs 24 1,Acts 2 40,Romans 12 1-2,1Corinthians 3 16-17,1Corinthians 6 9-11,1Corinthians 6 15-20,1Corinthians 15 33,2Corinthians 6 14-17,Ephesians 4 29-32,Ephesians 5 11,Colossians 3 2,Colossians 3 8,2Timothy 2 4,Titus 2 11-12,Hebrews 11 24-25,James 4 4,1John 2 15,Revelation 21 8,1Corinthians 13 4-8,Galatians 5 22-23,Ephesians 5 8-10,Philippians 1 9-11,1Corinthians 13 11,Ephesians 4 11-16,1Peter 2 1-3,2Peter 1 4-9,2Peter 3 18,1Corinthians 12 4-11,1Corinthians 14 1-5,1Corinthians 14 26-28,1Corinthians 14 33,1Corinthians 14 39-40,1Chronicles 15 28,1Chronicles 16 29,Psalms 9 11,Psalms 22 3,Psalms 33 2,Psalms 47 1,Psalms 95 1-2,Psalms 95 6,Psalms 100 4,Psalms 150 1-6,John 4 23,Ephesians 5 18-19,Philippians 2 9-11,Hebrews 13 15,1Chronicles 16 11,Psalms 91 15,Isaiah 56 7,Jeremiah 29 13,Matthew 6 5-13,Matthew 7 7-11,Matthew 18 19,Matthew 26 41,Luke 18 1,John 16 24,Ephesians 6 18,Philippians 4 6,1Thessalonians 5 17,1Timothy 2 8,James 5 13-18,Joel 1 14,Matthew 6 16-18,Matthew 17 21,Acts 13 2,Acts 14 23,Deuteronomy 22 5,1Corinthians 11 3-10,1Corinthians 11 13-16,1Timothy 2 9-10,1Peter 3 3-4,Psalms 23 6,Psalms 27 4,Psalms 84 4,Psalms 84 10,Psalms 122 1,Luke 4 16,1Corinthians 4 2,Hebrews 10 24-25,1Corinthians 9 9,1Corinthians 9 13-14,1Corinthians 12 28,Ephesians 2 19-22,Ephesians 5 21,1Thessalonians 5 12-13,1Timothy 5 17,Hebrews 13 7,Hebrews 13 17,Exodus 4 12,Psalms 66 16,Jeremiah 20 9,John 13 35,Acts 4 20,1Corinthians 2 13,2Timothy 1 8,1Peter 3 15"
INT_2026 = "Exodus 24 12,Deuteronomy 6 6-9,Psalms 19 7-10,Hebrews 4 12,Exodus 34 27,Deuteronomy 27 3,Joshua 24 26,1Samuel 10 25,Isaiah 30 8,Jeremiah 30 1-2,Luke 1 1-3,2Timothy 3 16-17,Hebrews 1 1,2Peter 1 20-21,Psalms 12 6,Psalms 119 9,Psalms 119 89,Psalms 119 105,Psalms 119 130,Proverbs 30 5-6,Isaiah 40 8,Luke 21 33,John 15 3,John 17 17,John 20 30-31,Romans 1 16,Romans 15 4,1Corinthians 10 11,1Peter 1 25,2Peter 1 19,Deuteronomy 8 3,Job 23 12,Psalms 119 103,Jeremiah 15 16,Matthew 4 4,1Peter 2 2,Deuteronomy 17 19,Joshua 1 8,Psalms 37 31,Psalms 40 8,Psalms 119 11,Psalms 119 16,Psalms 119 72,Psalms 119 97,Psalms 119 140,Isaiah 34 16,Hosea 4 6,Matthew 22 29,John 5 39,Colossians 3 16,2Timothy 2 15,Hebrews 8 10,Deuteronomy 4 35,Deuteronomy 4 39,Deuteronomy 6 4-5,Deuteronomy 32 39,Psalms 86 10,Isaiah 42 8,Isaiah 43 10-11,Isaiah 44 6,Isaiah 45 18,Isaiah 45 21-22,Mark 12 29,1Corinthians 8 4,Ephesians 4 5-6,1Timothy 2 5,James 2 19,Revelation 1 8,1Kings 8 27,John 4 24,Acts 17 24-25,2Corinthians 3 17,1Timothy 1 17,Isaiah 9 6,Matthew 1 20-23,John 1 1,John 1 14,John 1 18,John 8 57-58,John 10 30,John 12 45,John 14 8-10,2Corinthians 4 4,2Corinthians 5 19,Philippians 2 5-8,Colossians 1 15,Colossians 1 19,Colossians 2 9,1Timothy 3 16,Titus 2 13,Zechariah 14 9,Matthew 28 19,John 5 43,John 14 17-18,John 14 26,Acts 4 12,Acts 7 59,Acts 9 5,Proverbs 21 4,Proverbs 24 9,Galatians 5 19-21,James 4 17,1John 3 4,Psalms 51 5,Psalms 53 3,Isaiah 53 6,Isaiah 64 6,Jeremiah 17 9,Romans 3 10-12,Romans 3 23,Romans 5 12,Romans 5 14,Romans 5 19,Romans 6 23,James 1 14-15 1John 1 8,Isaiah 12 2,Isaiah 53 1-7,Luke 2 11,Luke 19 10,John 1 29,John 3 14-17,John 10 11,John 15 13,Romans 5 6,1Corinthians 15 3,1Timothy 1 15,Hebrews 2 9,Hebrews 9 28,1Peter 2 24,1Peter 3 18,Revelation 5 9,Exodus 12 13,Leviticus 17 11,Matthew 26 28,Romans 5 9,Hebrews 9 14,Hebrews 9 22,1Peter 1 18-19,1John 1 7,1Samuel 15 22,John 8 31,Romans 6 16,James 1 25,Revelation 22 14,Mark 16 16,John 7 38,Acts 16 31,Romans 10 9-13,Ephesians 2 8,Hebrews 11 6,2Chronicles 7 14,Psalms 34 18,Isaiah 55 7,Ezekiel 18 21,Luke 13 3,Luke 24 47,Acts 2 38,Acts 3 19,Acts 17 30,2Corinthians 7 10,2Peter 3 9,John 3 3-5,1Peter 3 20-21,Acts 8 12,Acts 8 14-16,Acts 10 47-48,Acts 19 1-5,Acts 22 16,Romans 6 3-4,Galatians 3 27,Matthew 3 16,John 3 23,Acts 8 35-39,Ezekiel 36 26-27,Joel 2 28-29,Matthew 3 11,Luke 11 13,Luke 24 49,John 3 7-8,John 7 37-39,John 14 16-18,Acts 1 4-5,Acts 2 16-18,Acts 2 37,Acts 2 39,Acts 8 17,Acts 10 44-46,Acts 11 16-18,Acts 19 6,Romans 8 9-11,Mark 16 17,Acts 2 1-11,Acts 2 33,Zechariah 4 6,Luke 12 12,John 6 63,John 16 13,Acts 1 8,Acts 4 31-33,Romans 5 5,Romans 8 11-17,Romans 8 26-27,1Corinthians 12 13,2Corinthians 3 6,Galatians 4 6,Ephesians 1 13-14,Leviticus 11 45,Leviticus 20 26,Psalms 5 4,Psalms 29 2,Psalms 145 17,Isaiah 35 8,Matthew 5 8,2Corinthians 7 1,Ephesians 4 22-24,Ephesians 5 27,1Thessalonians 3 12-13,Hebrews 12 14-15,1Peter 2 9,1John 1 5,Revelation 21 27,Exodus 23 2,Deuteronomy 12 30,Psalms 19 14,Psalms 101 3,Proverbs 1 10,Proverbs 24 1,Acts 2 40,Romans 12 1-2,1Corinthians 3 16-17,1Corinthians 6 9-11,1Corinthians 6 15-20,1Corinthians 15 33,2Corinthians 6 14-17,Ephesians 4 29-32,Ephesians 5 11,Colossians 3 2,Colossians 3 8,2Timothy 2 4,Titus 2 11-12,Hebrews 11 24-25,James 4 4,1John 2 15,Revelation 21 8,1Corinthians 13 4-8,Galatians 5 22-23,Ephesians 5 8-10,Philippians 1 9-11,1Corinthians 13 11,Ephesians 4 11-16,1Peter 2 1-3,2Peter 1 4-9,2Peter 3 18,1Corinthians 12 4-11,1Corinthians 14 1-5,1Corinthians 14 26-28,1Corinthians 14 33,1Corinthians 14 39-40"
JUN_2026 = "Exodus 24 12,Deuteronomy 6 6,Deuteronomy 6 7,Deuteronomy 6 8,Deuteronomy 6 9,Psalms 19 7,Psalms 19 8,Psalms 19 9,Psalms 19 10,Hebrews 4 12,Exodus 34 27,Isaiah 30 8,Jeremiah 30 1,Jeremiah 30 2,2Timothy 3 16,2Timothy 3 17,Hebrews 1 1,2Peter 1 20,2Peter 1 21,Psalms 12 6,Psalms 119 9,Psalms 119 89,Psalms 119 105,Psalms 119 130,Proverbs 30 5,Isaiah 40 8,Luke 21 33,John 17 17,John 20 30,John 20 31,Romans 1 16,Romans 15 4,1Corinthians 10 11,Job 23 12,Psalms 119 103,Jeremiah 15 16,Matthew 4 4,1Peter 2 2,Deuteronomy 17 19,Joshua 1 8,Psalms 37 31,Psalms 40 8,Psalms 119 11,Psalms 119 16,Psalms 119 72,Psalms 119 97,Psalms 119 140,Colossians 3 16,Deuteronomy 4 35,Deuteronomy 6 4,Isaiah 43 10,Isaiah 43 11,Mark 12 29,Ephesians 4 5,Ephesians 4 6,1Timothy 2 5,James 2 19,Revelation 1 8,John 4 24,Acts 17 24,Acts 17 25,2Corinthians 3 17,Isaiah 9 6,Matthew 1 20,Matthew 1 21,Matthew 1 22,Matthew 1 23,John 1 1,John 1 14,John 8 57,John 8 58,John 10 30,John 14 8,John 14 9,John 14 10,Philippians 2 5,Philippians 2 6,Philippians 2 7,Philippians 2 8,Colossians 1 19,Colossians 2 9,1Timothy 3 16,Acts 4 12,Proverbs 21 4,Proverbs 24 9,James 4 17,1John 3 4,Psalms 51 5,Isaiah 53 6,Romans 3 10,Romans 3 11,Romans 3 12,Romans 3 23,Romans 5 12,Romans 5 19,Romans 6 23,James 1 14,James 1 15,1John 1 8,Isaiah 12 2,Luke 2 11,Luke 19 10,John 1 29,John 3 14,John 3 15,John 3 16,John 3 17,John 15 13,1Timothy 1 15,Exodus 12 13,Leviticus 17 11,Matthew 26 28,Romans 5 9,Hebrews 9 14,1Samuel 15 22,John 8 31,Romans 6 16,Revelation 22 14,Mark 16 16,Acts 16 31,Romans 10 9,Romans 10 10,Romans 10 11,Romans 10 12,Romans 10 13,Ephesians 2 8,Hebrews 11 6,2Chronicles 7 14,Psalms 34 18,Isaiah 55 7,Ezekiel 18 21,Luke 13 3,Acts 2 38,Acts 3 19,Acts 17 30,John 3 5,1Peter 3 20,1Peter 3 21,Acts 8 12,Acts 10 47,Acts 10 48,Acts 19 5,Romans 6 3,Galatians 3 27,Matthew 3 16,John 3 23,Acts 8 38,Ezekiel 36 26,Ezekiel 36 27,Luke 24 49,John 3 7,John 3 8,Acts 1 4,Acts 1 5,Acts 2 16,Acts 2 39,Acts 10 44,Acts 10 45,Romans 8 9,Romans 8 10,Mark 16 17,Acts 2 1,Acts 2 2,Acts 2 3,Acts 2 4,Acts 2 5,Acts 2 6,Acts 2 7,Acts 2 8,Luke 12 12,John 6 63,John 16 13,Acts 1 8,Leviticus 20 26,Psalms 29 2,Isaiah 35 8,Matthew 5 8,2Corinthians 7 1,Ephesians 4 22,Ephesians 4 23,Ephesians 4 24,Exodus 23 2,Psalms 19 14,Psalms 101 3,Proverbs 1 10,Acts 2 40,Romans 12 1,Romans 12 2,1Corinthians 3 16,1Corinthians 3 17,1Corinthians 6 9,1Corinthians 6 10,1Corinthians 6 11,2Corinthians 6 17,Ephesians 4 29,Ephesians 4 30,Ephesians 4 31,Ephesians 4 32,Colossians 3 2,1John 2 15,Galatians 5 22,Galatians 5 23,Ephesians 5 8,Ephesians 5 9,2Peter 1 5,2Peter 1 6,2Peter 1 7,2Peter 1 8,2Peter 1 9,Psalms 47 1,Psalms 95 1,Psalms 95 2,Psalms 100 4,Philippians 2 9,Philippians 2 10,Philippians 2 11,1Peter 2 9,1Chronicles 16 11,Psalms 91 15,Jeremiah 29 13,Matthew 6 5,Matthew 6 6,Matthew 6 7,Matthew 6 8,Matthew 6 9,Matthew 6 10,Matthew 6 11,Matthew 6 12,Matthew 6 13,Matthew 7 7,Matthew 26 41,John 16 24,Philippians 4 6,1Thessalonians 5 17,1Timothy 2 8,James 5 13,James 5 14,James 5 15,James 5 16,James 5 17,James 5 18,Matthew 6 16,Matthew 6 17,Matthew 6 18,Matthew 17 21,Acts 13 2,Deuteronomy 22 5,1Corinthians 11 14,1Corinthians 11 15,1Timothy 2 9,1Timothy 2 10,1Peter 3 3,1Peter 3 4,Psalms 23 6,Psalms 27 4,Psalms 122 1,Luke 4 16,1Corinthians 4 2,Hebrews 10 25,Ephesians 5 21,1Timothy 5 17,Hebrews 13 7,Hebrews 13 17,Exodus 4 12,Psalms 66 16,Acts 4 20,1Peter 3 15"
BEG_2026 = "Exodus 24 12,Deuteronomy 6 6,Deuteronomy 6 7,Deuteronomy 6 8,Deuteronomy 6 9,Psalms 19 7,Psalms 19 8,Psalms 19 9,Psalms 19 10,Hebrews 4 12,Exodus 34 27,Isaiah 30 8,Jeremiah 30 1,Jeremiah 30 2,2Timothy 3 16,2Timothy 3 17,Hebrews 1 1,2Peter 1 20,2Peter 1 21,Psalms 12 6,Psalms 119 9,Psalms 119 89,Psalms 119 105,Psalms 119 130,Proverbs 30 5,Isaiah 40 8,Luke 21 33,John 17 17,John 20 30,John 20 31,Romans 1 16,Romans 15 4,1Corinthians 10 11,Job 23 12,Psalms 119 103,Jeremiah 15 16,Matthew 4 4,1Peter 2 2,Deuteronomy 17 19,Joshua 1 8,Psalms 37 31,Psalms 40 8,Psalms 119 11,Psalms 119 16,Psalms 119 72,Psalms 119 97,Psalms 119 140,Colossians 3 16,Deuteronomy 4 35,Deuteronomy 6 4,Isaiah 43 10,Isaiah 43 11,Mark 12 29,Ephesians 4 5,Ephesians 4 6,1Timothy 2 5,James 2 19,Revelation 1 8,John 4 24,Acts 17 24,Acts 17 25,2Corinthians 3 17,Isaiah 9 6,Matthew 1 20,Matthew 1 21,Matthew 1 22,Matthew 1 23,John 1 1,John 1 14,John 8 57,John 8 58,John 10 30,John 14 8,John 14 9,John 14 10,Philippians 2 5,Philippians 2 6,Philippians 2 7,Philippians 2 8,Colossians 1 19,Colossians 2 9,1Timothy 3 16,Acts 4 12,Proverbs 21 4,Proverbs 24 9,James 4 17,1John 3 4,Psalms 51 5,Isaiah 53 6,Romans 3 10,Romans 3 11,Romans 3 12,Romans 3 23,Romans 5 12,Romans 5 19,Romans 6 23,James 1 14,James 1 15,1John 1 8,Isaiah 12 2,Luke 2 11,Luke 19 10,John 1 29,John 3 14,John 3 15,John 3 16,John 3 17,John 15 13,1Timothy 1 15,Exodus 12 13,Leviticus 17 11,Matthew 26 28,Romans 5 9,Hebrews 9 14,1Samuel 15 22,John 8 31,Romans 6 16,Revelation 22 14,Mark 16 16,Acts 16 31,Romans 10 9,Romans 10 10,Romans 10 11,Romans 10 12,Romans 10 13,Ephesians 2 8,Hebrews 11 6,2Chronicles 7 14,Psalms 34 18,Isaiah 55 7,Ezekiel 18 21,Luke 13 3,Acts 2 38,Acts 3 19,Acts 17 30,John 3 5,1Peter 3 20,1Peter 3 21,Acts 8 12,Acts 10 47,Acts 10 48,Acts 19 5,Romans 6 3,Galatians 3 27,Matthew 3 16,John 3 23,Acts 8 38,Ezekiel 36 26,Ezekiel 36 27,Luke 24 49,John 3 7,John 3 8,Acts 1 4,Acts 1 5,Acts 2 16,Acts 2 39,Acts 10 44,Acts 10 45,Romans 8 9,Romans 8 10,Mark 16 17,Acts 2 1,Acts 2 2,Acts 2 3,Acts 2 4,Acts 2 5,Acts 2 6,Acts 2 7,Acts 2 8"

#print(sets);

#BEGINNER
beginner = BEG_2026 #input("Enter the list of Beginner verses: ")
out_file = open("beginner.json", "w")
division = "beginner"

sets = beginner.split(",")
sets_text = beginner

process_inputs()

create_json()

#JUNIOR 
junior = JUN_2026 #input("Enter the list of Junior verses: ")
out_file = open("junior.json", "w")
division = "junior"

sets = junior.split(",")
sets_text = junior

process_inputs()

create_json()

#INTERMEDIATE
intermediate = INT_2026 #input("Enter the list of Intermediate verses: ")
out_file = open("intermediate.json", "w")
division = "intermediate"

sets = intermediate.split(",")
sets_text = intermediate

process_inputs()

create_json()

#EXPERIENCED
experienced = EXP_2026 #input("Enter the list of Experienced verses: ")
out_file = open("experienced.json", "w")
division = "experienced"

sets = experienced.split(",")
sets_text = experienced

process_inputs()

create_json()
 
# Closing file
out_file.close()
print("Process Completed")
