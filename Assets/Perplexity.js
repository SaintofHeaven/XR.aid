// @input Asset.RemoteServiceModule remoteServiceModule
// @input string apiKey {"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"}

// @input string question = "List me the steps for CPR:"
// @input Component.Text outputDisplay
// @input float stepInterval = 5.0 

/** @type {RemoteServiceModule} */
var remoteServiceModule = script.remoteServiceModule;

var steps = [];
var currentStepIndex = 0;

function perplexityChatCompletion(requestBody, callback) {
    var httpRequest = RemoteServiceHttpRequest.create();
    
    httpRequest.url = 'https://api.perplexity.ai/chat/completions';
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Post;
    httpRequest.setHeader('Authorization', 'Bearer ' + script.apiKey);
    httpRequest.setHeader('Content-Type', 'application/json');
    httpRequest.body = JSON.stringify(requestBody);

    print('Sending request to Perplexity API');

    remoteServiceModule.performHttpRequest(httpRequest, function (response) {
        print('Perplexity API response received');
        
        if (response.statusCode === 200) {
            var jsonResponse = JSON.parse(response.body);
            callback(null, jsonResponse);
        } else {
            print('Error: ' + response.body);
            callback(new Error('API request failed with status ' + response.statusCode), null);
        }
    });
}

function requestGPT() {
    print('Requesting answer for: ' + script.question);

    var context = "Provide concise instructions. Respond with a numbered list of steps, each step on a new line. Do not include any introductory or concluding text. 1.If the person appears unresponsive, CHECK for responsiveness, breathing, life-threatening bleeding or other life-threatening conditions using shout-tap-shout 2. If the person does not respond and is not breathing or only gasping, CALL 9-1-1 3. Kneel beside the person. Place the person on their back on a firm, flat surface 4. 100 to 120 chest compressions per minute, 30 at a time. Give 2 breaths 5. Continue giving sets of 30 chest compressions and 2 breaths. Only write it based off our instructions. Limit it to 10 words per instruction";

    var requestBody = {
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
            { role: 'system', content: context },
            { role: 'user', content: script.question }
        ],
        temperature: 0.7,
        max_tokens: 300,
        top_p: 0.9
    };

    perplexityChatCompletion(requestBody, function(error, response) {
        if (error) {
            print('Error: ' + error.message);
            if (script.outputDisplay) {
                script.outputDisplay.text = 'Error: ' + error.message;
            }
            return;
        }
        
        if (response && response.choices && response.choices.length > 0) {
            var mainAnswer = response.choices[0].message.content;
            print('Assistant: ' + mainAnswer);
            
            // Split the answer into steps
            steps = mainAnswer.split('\n').filter(step => step.trim() !== '');
            
            // Start displaying steps
            currentStepIndex = 0;
            displayNextStep();
        } else {
            print('Unexpected response format');
            if (script.outputDisplay) {
                script.outputDisplay.text = 'Unexpected response format';
            }
        }
    });
}

function displayNextStep() {
    if (currentStepIndex < steps.length) {
        if (script.outputDisplay) {
            script.outputDisplay.text = steps[currentStepIndex];
        }
        currentStepIndex++;
        
        // Schedule next step
        var delayedEvent = script.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(function(eventData) {
            displayNextStep();
        });
        delayedEvent.reset(script.stepInterval);
    } else {
        print("All steps displayed");
    }
}

// Start the process automatically with a slight delay
var startupEvent = script.createEvent("DelayedCallbackEvent");
startupEvent.bind(function(eventData) {
    requestGPT();
});
startupEvent.reset(0.5); // 0.5 second delay before starting

print('CPR steps will be displayed automatically.');