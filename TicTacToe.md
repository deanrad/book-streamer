# Code Review of Tic Tac Toe

Author: Dean Radcliffe

# Optimal Strategy Reference

https://blog.ostermiller.org/tic-tac-toe-strategy

# Initial Behavior

On receiving the code I ran it under ruby 2.2, the interpreter I had lying around, since none was specified. [?](#)

I played a couple of games to test out the happy path. The game prompted me how to interact with it, which was good.

I played sub-optimally and it beat me; played optimally and it forced a tie - so far so good for behavior. The messaging could be different for a tie vs a loss (they both say `Game Over`), but it was running well.

I tested some invalid inputs - I made some notes on the behavior below, but continued to look.

# Behavior - Details

In order to play games all at once, to speed my explorations, I used a command to send it keystrokes. Here's an optimally played game:

```sh
> (ruby -e 'puts "08273".split("").join("\n")' && cat) | ruby tic-tac-toe.rb
 0 | 1 | 2
===+===+===
 3 | 4 | 5
===+===+===
 6 | 7 | 8
Enter [0-8]:
 O | 1 | 2
===+===+===
 3 | X | 5
===+===+===
 6 | 7 | 8
 O | 1 | 2
===+===+===
 3 | X | 5
===+===+===
 X | 7 | O
 O | X | O
===+===+===
 3 | X | 5
===+===+===
 X | 7 | O
 O | X | O
===+===+===
 3 | X | X
===+===+===
 X | O | O
 O | X | O
===+===+===
 O | X | X
===+===+===
 X | O | O
 Game over (tie)
```

It turns out, with the computer's randomness, the same set of input actions will not always play optimally to a tie. This is good! And will create challenges for testing..[?](#)

I wanted to see the outcome more clearly, so I modified the source a smidge, so the above would read `Game over (you lose)`.

# Code Review

TODO

# Summary

High priority

- UX: display the game outcome

Other

- Quality: handle invalid inputs

# Appendix A - Invalid Input behavior

Were this to be a production game, I'd expect to see the non-OK of the following cases handled:

| Input              | Result                                         |
| ------------------ | ---------------------------------------------- |
| 0-8                | OK                                             |
| letter             | square 0 gets occupied (What is `"x".to_i` ? ) |
| number > 8 (9, 12) | move is made, no square is occupied            |
| Ctrl-C             | not graceful exit                              |

<!-- time spent
1/2 hr Tues AM
-->
