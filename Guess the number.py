
𝗚𝘂𝗲𝘀𝘀 𝗿𝗮𝗻𝗱𝗼𝗺 𝗻𝘂𝗺𝗯𝗲𝗿:

import random
a = random.randint(0, 100)
print(a)
print('Welcome to the Guess the Number Game!')
print('I have selected a number between 1 and 100. Can you guess what it is?')
n = 0
def my_function():
    global b
    global n
    n += 1
    if n == 4:
        print('failed, Too many Attempts')
    else:
        print('attempts ' , n)
        b = int(input())
        if b > a:
          print("Too low! Try again.")
          my_function()
        elif a == b:
          print("Congratulations! You guessed the number")
        else:
          print("Too high! Try again.")
          my_function()
        
my_function()

# Enter your guess: 50
# Too low! Try again.

# Enter your guess: 75
# Too high! Try again.

# Enter your guess: 62
# Congratulations! You guessed the number in 3 attempts.

# Do you want to play again? (yes/no)
