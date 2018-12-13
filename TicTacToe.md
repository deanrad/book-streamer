# Code Review of Tic Tac Toe

Author: Dean Radcliffe

# Optimal Strategy Reference

https://blog.ostermiller.org/tic-tac-toe-strategy

# Initial Behavior

On receiving the code I ran it under ruby 2.2, (no specific interpreter was specified, was that intended?)

I played a couple of games to test out the happy path. The game prompted me how to interact with it, which was good.

I played sub-optimally and it beat me; played optimally and it forced a tie - so far so good for behavior. The messaging could be different for a tie vs a loss (they both say `Game Over`), but it was running well.

Invalid inputs were not handled well, I took a few notes (see appendix).

# Code Review

## Game Over?

The winner-detection logic in `game_is_over`, works pretty well, though the combinations being tested could be written in terms of rows, columns, and diagonals for better readability. It also could report that a game was over if the board were initialized with hyphens (`-`) instead of digits.

`game_is_over` could be named `winner` and return a truthy value `X`,`O`, or nil. It should explicitly test for the valid X and O values, so that it does not report that hyphen (`-`) would be a winner if the board were initialized to all hyphens.

To detect if the game has tied, you need only combine the `winner` with an `available_spaces` field. The logic for that is already in `get_best_move`, and could be extracted to a method they both use.

## Board

Having a linear array for a 2D board (of known size) is not a bad idea, actually.

But code that needs to iterate it in terms of rows and columns benefits greatly from defining enumerators - `rows`, `columns` and `diagonals`, for example, that can be looped over. Let me know if you need examples - for a board of fixed size like this, no fancy traversal is even needed perhaps, but extra credit for that :)

Also, since the board is keyed on integers, then making `available_spaces` an array of integers instead of strings would eliminate the many `to_i` conversions.

## Best move search

**Parameters:** All parameters but the `board` are unused! And board doesn't need to be passed, since it can be referenced as `@board` inside the method.

A linter or Rubocop should have alerted you to these unused parameters - let's take a look at your setup on a screenshare.

Method declarations are very important lines of code and it's important they are minimal since they're extremely hard to roll back changes once they get used.

**Logic:**
So, for a game with so few moves as tic-tac-toe, the unrolled loop approach works kinda OK but..

The code can be expressed much more concisely in terms of a recursive approach. I think you may have had this in mind with the `depth` parameter.

I can't say for sure whether this code is correct enough to handle all cases that don't result in a win after 2 moves, but if it had tests, we could know. I think I'd still prefer an iterative or recursive version to a fixed-depth.

# Summary

High priority

- UX: display the game outcome
- Code: rename, lint, clean up method declarations. Minimize type conversions.
- Use enumerated values, not strings.
- Add tests or use an exhaustive search to make sure the game is unbeatable to arbitrary depth.

Other

- Code: rows, column enumerators
- QA: handle invalid inputs
- DRY up the board printing

# Appendix A - Testing on the command line

In order to play games faster I used a command to send it keystrokes.

```sh
> (ruby -e 'puts "08273".split("").join("\n")' && cat) | ruby tic-tac-toe.rb

 [output omitted]

 Game over (tie)
```

# Appendix B - Invalid Input behavior

Were this to be a production game, I'd expect to see the following cases handled:

| Input              | Actual                                         | Expected                    |
| ------------------ | ---------------------------------------------- | --------------------------- |
| letter             | square 0 gets occupied (What is `"x".to_i` ? ) | rejected                    |
| number > 8 (9, 12) | move is made, no square is occupied            | rejected                    |
| Ctrl-C             | not graceful exit                              | message printed, clean exit |

<!-- time spent
1/2 hr Tues AM
1 hr minutes Thurs AM
-->
