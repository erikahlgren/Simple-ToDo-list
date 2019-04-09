## Simple ToDo-list

Your task is to create a simple todo app - no backend required.
Exactly how you implement and design this is up to you - but your solution should be implemented in the files `index.html`, `js/todo.js` and `style/todo.css`.

You are **not** allowed to follow a tutorial!
Stay away from frameworks and 3rd party libs.

### Requirements
1. Initially, the list of todo cards should be empty.
2. There should be a form where the user can add a new 'todo'.
3. When a new todo task is submitted from the form, a new todo card should be appended to the list.
4. Clicking on a todo card should visually mark the card as done. Exactly how is up to you.
5. Add a remove button to cards marked as 'done'. When the button is clicked, the card should be removed from the board.
6. Store the current state in the browser's local storage. When the browser is shut down and then opened again, the state should be restored.
7. Move the cards marked as 'done' to the bottom of the list.
8. Add date and a timestamp to the cards. Sort the cards based on the timestamp. (Cards marked as done should still be in the bottom of the list)
9. Let the user decide whether to sort the cards in ascending or descending order.
