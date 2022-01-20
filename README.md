# Declarative Login Form

A no framework purely functional declarative login form example.

...what a moutful, huh?

## Notes

- Is it worth it?
- This example can be ported to TypeScript, Java or C#.
- `Modifier`s deal with pure stuffs while `Wrapper`s deal with impure stuffs while `Main` initializes stuffs.
- Modifiers transforms the context to another.
- Wrappers wraps the modifiers so that they can do the "dirty" stuffs.
- Think modifiers like the 3D modeling apps' modifiers.
- Think wrappers like the System in Entity Component System.
- The wrappers are the framework... actually.
- It's damn hard because I don't get used yet to this way of thinking.
- Debugging in modifiers is easy but *not* in wrappers.
  This is great if we work only in modifiers (only in the pure stuffs).
  And that's the goal IMHO.

## Running

Run a PHP dev server on `dist`.
