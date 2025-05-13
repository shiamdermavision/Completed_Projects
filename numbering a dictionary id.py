a = -1

def my_function():
    global a
    a += 1
    global b 
    b = a
    return a

b = my_function()


for i in range(10):
    p = [
    {
        "id": my_function(),
        "title": f"Task-{b}"
    },
    ]
    print(p)