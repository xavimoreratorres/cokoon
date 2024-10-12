document.addEventListener('DOMContentLoaded', function() {

    // Get the generate button
    const generateButton = document.querySelector('.generate');
    
    // Get the step7 element
    const step7Element = document.getElementById('step7');
    
    // Add click event listener to the generate button
    if (generateButton) {
        generateButton.addEventListener('click', function() {
            // Add spinning animation to the generate button
            generateButton.classList.add('spin');
            
            // **Initialize an array to store the collected data**
            const collectedData = [];
            
            // **Collect active .button1 elements with question text**
            const activeButtons = document.querySelectorAll('.button1.property-1active');
            activeButtons.forEach(function(button) {
                const textElement = button.querySelector('.text');
                if (textElement) {
                    const buttonParent = button.closest('.button1-parent');
                    if (buttonParent) {
                        const optionsElement = buttonParent.closest('.options');
                        if (optionsElement) {
                            const questionCard = optionsElement.closest('.questioncard1, .questioncard2');
                            if (questionCard) {
                                const questionButtonElement = questionCard.querySelector('.questionbutton');
                                if (questionButtonElement) {
                                    const questionText = questionButtonElement.textContent.trim();
                                    // Add to collectedData
                                    collectedData.push({ question: questionText, answer: textElement.textContent.trim() });
                                } else {
                                    collectedData.push({ question: 'Question', answer: textElement.textContent.trim() });
                                }
                            }
                        }
                    }
                }
            });

            // **Collect active .tagplatform elements**
            const activePlatforms = document.querySelectorAll('.tagplatform-active');
            activePlatforms.forEach(function(platform) {
                const imgElement = platform.querySelector('img');
                if (imgElement) {
                    const altText = imgElement.getAttribute('alt').trim();
                    if (altText) {
                        collectedData.push({ question: 'Watch in', answer: altText });
                    }
                }
            });

            // **Collect active .tag and .tag2 elements with their titles**
            const activeTags = document.querySelectorAll('.tag.property-1active, .tag2.property-1active');
            activeTags.forEach(function(tag) {
                const textElement = tag.querySelector('.text');
                if (textElement) {
                    let titleText = '';

                    const optionsShow = tag.closest('.options-show');
                    const optionsMovie = tag.closest('.options-movie');

                    if (optionsShow || optionsMovie) {
                        const optionsElement = optionsShow || optionsMovie;
                        const questionElement = optionsElement.previousElementSibling; // Should be .question
                        if (questionElement) {
                            const showElement = questionElement.querySelector('.show');
                            if (showElement) {
                                titleText = showElement.textContent.trim();
                            }
                        }
                    } else {
                        const labelsElement = tag.closest('.labels');
                        if (labelsElement) {
                            const optionsElement = labelsElement.closest('.options');
                            if (optionsElement) {
                                const labelCard = optionsElement.closest('.labelcard, .labelcardexcluding, .labelcardplatform, .labelcard1');
                                if (labelCard) {
                                    const questionElement = labelCard.querySelector('.question');
                                    if (questionElement) {
                                        const tagstitleElement = questionElement.querySelector('.tagstitle, .good-references, .bad-references, .on-any-of');
                                        if (tagstitleElement) {
                                            titleText = tagstitleElement.textContent.trim();
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (!titleText) {
                        titleText = 'Tag';
                    }

                    collectedData.push({ question: titleText, answer: textElement.textContent.trim() });
                }
            });

            // **Collect user input from textareas with class 'text3'**
            const textareas = document.querySelectorAll('.text3');
            textareas.forEach(function(textarea) {
                const userInput = textarea.value.trim();
                const placeholderText = textarea.getAttribute('placeholder') || '';
                if (userInput && userInput !== placeholderText.trim()) {
                    let questionText = '';

                    const optionsShow = textarea.closest('.options-show');
                    const optionsMovie = textarea.closest('.options-movie');

                    if (optionsShow || optionsMovie) {
                        const optionsElement = optionsShow || optionsMovie;
                        const questionElement = optionsElement.previousElementSibling; // Should be .question
                        if (questionElement) {
                            const showElement = questionElement.querySelector('.show');
                            if (showElement) {
                                questionText = showElement.textContent.trim();
                            }
                        }
                    } else if (textarea.closest('.options')) {
                        const optionsElement = textarea.closest('.options');
                        const labelCard = optionsElement.closest('.labelcard, .labelcardexcluding, .labelcardplatform, .labelcard1');
                        if (labelCard) {
                            const questionElement = labelCard.querySelector('.question');
                            if (questionElement) {
                                const tagstitleElement = questionElement.querySelector('.tagstitle, .good-references, .bad-references, .on-any-of');
                                if (tagstitleElement) {
                                    questionText = tagstitleElement.textContent.trim();
                                }
                            }
                        }
                    } else if (textarea.closest('.textbox, .textbox2')) {
                        questionText = placeholderText.trim();
                    } else if (textarea.closest('.openbox')) {
                        const openboxElement = textarea.closest('.openbox');
                        const questionTextElement = openboxElement.querySelector('.on-any-of');
                        if (questionTextElement) {
                            questionText = questionTextElement.textContent.trim();
                        }
                    } else {
                        questionText = placeholderText.trim() || 'Your Input';
                    }

                    collectedData.push({ question: questionText, answer: userInput });
                }
            });

            // **Convert collected data to JSON (if needed)**
            const jsonData = JSON.stringify(collectedData);
            console.log(jsonData); // You can remove this line if not needed
           
            // **Send collected data to Azure Function**
            const functionUrl = 'https://serverlessxaviopenai2.azurewebsites.net/api/cokoon?';

            fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData  // Sending the collected data as the request body
            })
            .then(response => response.json())  // **Expect the response as JSON**
            .then(data => {
                console.log('Success:', data);  // Log success response

                // **Map the titles and descriptions to the appropriate div elements**
                for (let i = 1; i <= 6; i++) {
                    const titleTextElement = document.querySelector(`.titletext${i}`);
                    const summaryTextElement = document.querySelector(`.summarytext${i}`);
                    
                    // Map Title{i} and Description{i} to the corresponding elements
                    if (titleTextElement && data[`Title${i}`]) {
                        titleTextElement.textContent = data[`Title${i}`];
                    }
                    if (summaryTextElement && data[`Description${i}`]) {
                        summaryTextElement.textContent = data[`Description${i}`];
                    }
                }

                // **Show step7 and scroll to it AFTER getting the response**
                if (step7Element) {
                    step7Element.style.display = 'flex'; // Make step7 visible
                    step7Element.scrollIntoView({ behavior: 'smooth' });
                }

                // Stop spinning animation and reset the button's appearance
                generateButton.classList.remove('spin');
                generateButton.innerHTML = 'Generate';
            })
            .catch((error) => {
                console.error('Error:', error);  // Log any error
                generateButton.classList.remove('spin');  // Stop spinning animation in case of error
            });
        });
    }



    // Select all button1 elements
    const buttons = document.querySelectorAll('.button1');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the parent container of the clicked button
            const parent = this.closest('.button1-parent');
            
            // Remove 'property-1active' from all buttons inside this parent
            const siblingButtons = parent.querySelectorAll('.button1');
            siblingButtons.forEach(btn => btn.classList.remove('property-1active'));
            
            // Add 'property-1active' to the clicked button
            this.classList.add('property-1active');
        });
    });

    // Function to toggle the active class on tag and tag2 elements independently
const tags = document.querySelectorAll('.tag, .tag2');

tags.forEach(tag => {
    tag.addEventListener('click', function() {
        // Toggle 'property-1active' on the clicked tag
        this.classList.toggle('property-1active');
    });
});



    

// Initial elements
const radiocard = document.querySelector('.radiocard');
const optionsShow = document.querySelector('.options-show');
let radioShow = document.querySelector('.radio-show');  // Use let to handle dynamic changes

// New elements for the same functionality
const radiocard1 = document.querySelector('.radiocard1');
const optionsMovie = document.querySelector('.options-movie');
let radioMovie = document.querySelector('.radio-movie');  // Use let to handle dynamic changes

// Hide options-show and options-movie by default
optionsShow.style.display = 'none';
optionsMovie.style.display = 'none';

// Function to show options and switch to radio-show-clicked
function showOptions(radioElement, optionsElement, event) {
    event.stopPropagation();

    // Show options if it's not already visible
    if (optionsElement.style.display === 'none' || optionsElement.style.display === '') {
        optionsElement.style.display = 'flex';  // Show options

        // Replace radio with radio-clicked
        if (radioElement.classList.contains('radio-show')) {
            radioElement.classList.remove('radio-show');
            radioElement.classList.add('radio-show-clicked');
            // Update the radioShow reference
            radioShow = document.querySelector('.radio-show-clicked');
        } else if (radioElement.classList.contains('radio-movie')) {
            radioElement.classList.remove('radio-movie');
            radioElement.classList.add('radio-movie-clicked');
            // Update the radioMovie reference
            radioMovie = document.querySelector('.radio-movie-clicked');
        }
    }
}

// Function to hide options and revert to radio-show
function hideOptions(radioElement, optionsElement, event) {
    event.stopPropagation();

    // Hide options if it's visible
    if (optionsElement.style.display === 'flex') {
        optionsElement.style.display = 'none';  // Hide options

        // Replace radio-clicked with radio-show
        if (radioElement.classList.contains('radio-show-clicked')) {
            radioElement.classList.remove('radio-show-clicked');
            radioElement.classList.add('radio-show');
            // Update the radioShow reference
            radioShow = document.querySelector('.radio-show');
        } else if (radioElement.classList.contains('radio-movie-clicked')) {
            radioElement.classList.remove('radio-movie-clicked');
            radioElement.classList.add('radio-movie');
            // Update the radioMovie reference
            radioMovie = document.querySelector('.radio-movie');
        }
    }
}

// Add click event listener to radiocard
radiocard.addEventListener('click', function(event) {
    event.stopPropagation();
    const target = event.target;

    if (target.classList.contains('radio-show')) {
        // If the clicked element is radio-show, show options-show
        showOptions(radioShow, optionsShow, event);
    } else if (target.classList.contains('radio-show-clicked')) {
        // If the clicked element is radio-show-clicked, hide options-show
        hideOptions(radioShow, optionsShow, event);
    } else {
        // Clicking elsewhere on radiocard
        if (optionsShow.style.display === 'none' || optionsShow.style.display === '') {
            showOptions(radioShow, optionsShow, event);
        }
    }
});

// Add click event listener to radiocard1 for movie elements
radiocard1.addEventListener('click', function(event) {
    event.stopPropagation();
    const target = event.target;

    if (target.classList.contains('radio-movie')) {
        // If the clicked element is radio-movie, show options-movie
        showOptions(radioMovie, optionsMovie, event);
    } else if (target.classList.contains('radio-movie-clicked')) {
        // If the clicked element is radio-movie-clicked, hide options-movie
        hideOptions(radioMovie, optionsMovie, event);
    } else {
        // Clicking elsewhere on radiocard1
        if (optionsMovie.style.display === 'none' || optionsMovie.style.display === '') {
            showOptions(radioMovie, optionsMovie, event);
        }
    }
});

// Removed the document click event listener to prevent hiding options when clicking outside

document.querySelectorAll('.tagplatform, .tagplatform-active').forEach(function (element) {
    element.addEventListener('click', function () {
        // If the element has class 'tagplatform', replace it with 'tagplatform-active'
        if (this.classList.contains('tagplatform')) {
            this.classList.remove('tagplatform');
            this.classList.add('tagplatform-active');
        } 
        // If the element has class 'tagplatform-active', replace it with 'tagplatform'
        else if (this.classList.contains('tagplatform-active')) {
            this.classList.remove('tagplatform-active');
            this.classList.add('tagplatform');
        }
    });
});

const resultCards = document.querySelectorAll('.mainresult .resultcard1, .mainresult .resultcard');

// Function to hide the parent card
function hideParentCard(event) {
    event.stopPropagation(); // Prevent the click from triggering other events

    // Find the parent resultcard1 or resultcard
    let parentCard = event.currentTarget;

    // Traverse up the DOM until we find the resultcard1 or resultcard
    while (parentCard && !parentCard.classList.contains('resultcard1') && !parentCard.classList.contains('resultcard')) {
        parentCard = parentCard.parentElement;
    }

    if (parentCard) {
        parentCard.style.display = 'none'; // Hide the card
    }
}

// Add event listeners to "Delete & Next" buttons inside contentresult
const deleteAndNextButtons = document.querySelectorAll('.delete-next');
deleteAndNextButtons.forEach(function (button) {
    button.addEventListener('click', hideParentCard);
});

// Add event listeners to "Delete" buttons inside titlelabel
const deleteButtons = document.querySelectorAll('.delete');
deleteButtons.forEach(function (button) {
    button.addEventListener('click', hideParentCard);
});

// Existing code to handle showing contentresult (from previous implementation)
resultCards.forEach(function (card) {
    card.addEventListener('click', function () {
        // Hide all contentresult elements
        resultCards.forEach(function (c) {
            const content = c.querySelector('.contentresult');
            if (content) {
                content.style.display = 'none';
            }
        });

        // Show the contentresult of the clicked card
        const content = card.querySelector('.contentresult');
        if (content) {
            content.style.display = 'flex';
        }
    });
});

const restartButton = document.querySelector('.restart');
    
    if (restartButton) {
        restartButton.addEventListener('click', function(event) {
            event.preventDefault();
            const step1Element = document.getElementById('step1');
            if (step1Element) {
                step1Element.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

// Step 1 "Next" button
const nextButtonStep1 = document.querySelector('.step1 .next1');
nextButtonStep1.addEventListener('click', function(event) {
    event.preventDefault();
    const step2Element = document.getElementById('step2');
    if (step2Element) {
        step2Element.scrollIntoView({ behavior: 'smooth' });
    }
});

// Step 2 "Next" button
const nextButtonStep2 = document.querySelector('.step2 .next1');
nextButtonStep2.addEventListener('click', function(event) {
    event.preventDefault();
    const step3Element = document.getElementById('step3');
    if (step3Element) {
        step3Element.scrollIntoView({ behavior: 'smooth' });
    }
});

// Step 3 "Next" button
const nextButtonStep3 = document.querySelector('.step3 .next1');
nextButtonStep3.addEventListener('click', function(event) {
    event.preventDefault();
    const step4Element = document.getElementById('step4');
    if (step4Element) {
        step4Element.scrollIntoView({ behavior: 'smooth' });
    }
});

// Step 4 "Next" button
const nextButtonStep4 = document.querySelector('.step4 .next1');
nextButtonStep4.addEventListener('click', function(event) {
    event.preventDefault();
    const step5Element = document.getElementById('step5');
    if (step5Element) {
        step5Element.scrollIntoView({ behavior: 'smooth' });
    }
});

// Step 5 "Next" button
const nextButtonStep5 = document.querySelector('.step5 .next1');
nextButtonStep5.addEventListener('click', function(event) {
    event.preventDefault();
    const step6Element = document.getElementById('step6');
    if (step6Element) {
        step6Element.scrollIntoView({ behavior: 'smooth' });
    }
});

// Step 6 "Next" button
const nextButtonStep6 = document.querySelector('.step6 .next1');
nextButtonStep6.addEventListener('click', function(event) {
    event.preventDefault();
    const step7Element = document.getElementById('step7');
    if (step7Element) {
        step7Element.scrollIntoView({ behavior: 'smooth' });
    }
});



});
