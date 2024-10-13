// @input string question = "What are some ideas for Lenses?"

const request = { 
    "temperature": 0,
    "messages": [
        {"role": "user", "content": script.question}
    ]
};

function requestGPT() {
    print(`Requesting answer for: ${script.question}`);
    
    global.chatGpt.completions(request, (errorStatus, response) => {
        if (!errorStatus && typeof response === 'object') {
            const mainAnswer = response.choices[0].message.content;
            print(mainAnswer);
        } else {
            print(JSON.stringify(response));
        }
    })
}

script.createEvent("TapEvent").bind(requestGPT);
print("Tap to call GPT!");