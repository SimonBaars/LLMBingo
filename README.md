# LLMBingo
LLMBingo - Prompt the LLM, Fill Your Bingo Card

```
make this component using @mui such that:
- When the component is opened and no card could be loaded from localstorage, it calls fetchJson("card") to get a bingo card. the second argument to fetchJson is the callback. The response is a double array with strings for the card. Set the "card" property in localstorage to the card and set the "card" state variable as well.
- Display the card as a Grid bingo card on the top of the page. The card can be any equal dimensions, like 2x2, 3x3, 4x4, etc. Center the card horizontally and vertically.
- The page is mostly a PWA. It is always 100vh. Within the fixed vh, the part containing the bingo card scrolls. There is also a footer with a text input field (make sure it is within the SAFE vh!) and a send button to the right, kinda how chat apps have a chat field with "send" button on the right.
- When the send button is pressed, set a "loading" state which disables the send button and clear the input field. Show a loading spinner (CircularProgress) under the bingo card while the submit is happening. Send an `updateRequest` with the body of the prompt to /prompt. Set the response as the "text" state variable and display it under the bingo card.
```
