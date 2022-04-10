
# ESLint description

_Group 1 : GameChangers – DHI2V.So_ - Project Server and Client

---
A great project is made out of consistent code. In the perfect world, the code should be indistinguishable from its writer: You should not be able to tell who authored which line of code in the project.

In our project, we have used an ESLint style guide to help ourselves write better code by pointing out common errors and enforcing good programming patterns.

We have used the following rules in our ESLint configuration such as:

1) brace-style

    Enforce consistent brace style for blocks

    Options:

    - "1tbs" (default) enforces one true brace style
    - "error": gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)

2) comma-style

    This rule enforces consistent comma style in array literals, object literals, and variable declarations.
    This rule does not apply in either of the following cases:

    - comma preceded and followed by linebreak (lone comma)
    - single-line array literals, object literals, and variable declarations

    Options:

    - "last" (default) requires a comma after and on the same line as an array element, object property, or variable declaration

    - "error": gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)

3) comma-spacing

    This rule enforces consistent spacing before and after commas in variable declarations, array literals, object literals, function parameters, and sequences. This rule does not apply in an ArrayExpression or ArrayPattern in either of the following cases:

    - adjacent null elements
    - an initial null element, to avoid conflicts with the
    array-bracket-spacing rule

    Options:

    - "error": gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)
4) indent

    This rule enforces a consistent indentation style. The default style is 4 spaces.

    Options:
    - "SwitchCase" (default: 0) enforces indentation level for case clauses in switch statements
    - "error": gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)

5) no-dupe-else-if

    This rule disallows duplicate conditions in the same if-else-if chain.

    Options:
    - "error": gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)

6) no-extra-parens

    This rule always ignores extra parentheses around the following:
    - RegExp literals such as (/abc/).test(var) to avoid conflicts with the wrap-regex rule
    - immediately-invoked function expressions (also known as IIFEs) such as var x = (function () {})(); and var x = (function () {}()); to avoid conflicts with the wrap-iife rule
    - arrow function arguments to avoid conflicts with the arrow-parens rule
        Options:
    - "functions" disallows unnecessary parentheses only around function expressions
    - “error”: gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)

7) no-lonely-if

    This rule disallows if statements as the only statement in else blocks.

    Options:
    - "error": gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)

8) no-mixed-spaces-and-tabs

    This rule disallows mixed spaces and tabs for indentation.
    Options:
    - "error": gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)
9) No-unreachable
    This rule aims to detect and disallow loops that can have at most one iteration by performing static code path analysis on loop bodies.
In particular, this rule will disallow a loop with a body that exits the loop in all code paths. For example, if all code paths in the loop's body will end with either a break, return, or a throw statement, the second iteration of such loop is unreachable, regardless of the loop's condition.
This rule checks while, do-while, for, for-in and for-of loops. You can optionally disable checks for each of these constructs.

     Options:
    - "error": gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)

10) No-unreachable-loop

       This rule aims to detect and disallow loops that can have at most one iteration by performing static code path analysis on loop bodies.
In particular, this rule will disallow a loop with a body that exits the loop in all code paths. For example, if all code paths in the loop's body will end with either a break, return, or a throw statement, the second iteration of such loop is unreachable, regardless of the loop's condition.
This rule checks while, do-while, for, for-in and for-of loops. You can optionally disable checks for each of these constructs.

    Options:
    - "error": gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)
11) No-useless-return

    This rule aims to report redundant return statements.

    Options:
    - "error": gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)

12) Object-curly-spaces

    This rule aims to maintain consistency around the spacing inside of square brackets, either by disallowing spaces inside of brackets between the brackets and other tokens or enforcing spaces. Brackets separated from the adjacent value by a new line are excepted from this rule, as this is a common pattern. Object literals used as the first or last element in an array are also ignored.

    Options:
    - "always" enforces a space inside of an object, and an array of literals
    - "error": gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)

13) Semi-spacing:

    This rule aims to enforce spacing around a semicolon. In addition, this rule prevents the use of spaces before a semicolon in expressions.

    This rule doesn't check spacing in the following cases:
    - The spacing after the semicolon if it is the first token in the line.
    - The spacing before the semicolon, if it is after an opening parenthesis, (( or {), or the spacing after the semicolon if it is before a closing parenthesis () or }). That spacing is checked by space-in-parens or block-spacing.
    - The spacing around the semicolon in a for loop with an empty condition (for(;;)).

    Options:
    - {"before": false, "after": true}
This is the default option. It enforces spacing after semicolons and disallows spacing before semicolons.

    - "error": gives the error if the code did not follow the rule when the project is trying to be built (so it will fail)

14) Space-before-blocks:

    This rule will enforce the consistency of spacing before blocks. It is only applied on blocks that don't begin on a new line.

     This rule ignores spacing which is between => and a block. Instead, the arrow-spacing rule handles the spacing.

     This rule ignores spacing which is between a keyword and a block. Instead, the spacing is handled by the keyword-spacing rule.

     This rule ignores spacing which is between a switch case and a block. Instead, the switch-colon-spacing rule handles the spacing.
This rule takes one argument. If it is "always," blocks must always have at least one preceding space.

      Options:
      - "error": gives the error if the code did not follow the rule when the project is trying  to be built (so it will fail)

15) Keyword-spacing

    This rule enforces consistent spacing around keywords and keyword-like tokens: as (in module declarations), async (of async functions), await (of await expressions), break, case, catch, class, const, continue, debugger, default, delete, do, else, export, extends, finally, for, from (in module declarations), function, get (of getters), if import, in (in for-in statements), let, new, of (in for-of statements), return, set (of setters), static, super, switch, this, throw, try, typeof, var, void, while, with, and yield. This rule is designed carefully not to conflict with other spacing rules: it does not apply to spacing where other rules report problems.

Options:

- "before": true (default) requires at least one space before keywords
- "after": true (default) requires at least one space after keywords
- "error": gives the error if the code did not follow the rule when the project is trying  to be built (so it will fail)

16) space-before-function-paren

    This rule aims to enforce consistent spacing before function parentheses and, as such, will warn whenever whitespace doesn't match the preferences specified.

Options:

- anonymous is for anonymous function expressions (e.g. function () {}).
- named is for named function expressions (e.g. function foo () {}).
- "error": gives the error if the code did not follow the rule when the project is trying  to be built (so it will fail)

17) Space-in-parens

This rule will enforce consistent spacing directly inside parentheses by disallowing or requiring one or more spaces to the right of ( and to the left of ).

If you do not explicitly disallow empty parentheses using the "empty" exception, () will be allowed.

Options:

- "never" (default) enforces zero spaces inside of parentheses
- "error": gives the error if the code did not follow the rule when the project is trying  to be built (so it will fail)

18) Space-infix-ops

This rule is aimed at ensuring there are spaces around infix operators.

Options:

- "error": gives the error if the code did not follow the rule when the project is trying  to be built (so it will fail)

19) Quotes

This rule enforces the consistent use of either backticks, double, or single quotes.

Options:

- "single" requires the use of single quotes wherever possible
- "error": gives the error if the code did not follow the rule when the project is trying  to be built (so it will fail)
