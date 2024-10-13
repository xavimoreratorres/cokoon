document.addEventListener('DOMContentLoaded', function() {
    const detailboxText = document.querySelector('.detailboxtext');
    const iconFrame = document.querySelector('.detailboxiconframe'); // Select the image to change
    
    // Handle user input for icon frame and dynamic height adjustment
    detailboxText.addEventListener('input', function() {
        const text = this.value.trim(); // Use value instead of innerText for textarea
        
        if (text.length > 0) {
            // If there is user input, change to the colored frame SVG
            iconFrame.src = './svg/detailboxiconframecolor.svg';
        } else {
            // If no input, revert to the original frame SVG
            iconFrame.src = './svg/detailboxiconframe.svg';
        }

        // Dynamically adjust textarea height
        this.style.height = '20px'; // Reset the height
        this.style.height = this.scrollHeight + 'px'; // Set the height to match the content
    });

    // Clear placeholder when focused
    detailboxText.addEventListener('focus', function() {
        this.placeholder = '';
    });

    // Restore placeholder if no text is entered
    detailboxText.addEventListener('blur', function() {
        if (!this.value.trim()) { // Ensure there's no text before restoring the placeholder
            this.placeholder = 'Eg: A murder mystery in the 90’s Barcelona'; // Replace with your desired placeholder
        }
    });

    // Initial adjustment of the textarea height if it contains content
    detailboxText.style.height = detailboxText.scrollHeight + 'px';


    // Handle click for .iwanttag and .excludingtag elements
    document.querySelectorAll('.iwanttag, .excludingtag').forEach(function(tag) {
        tag.addEventListener('click', function() {
            if (tag.classList.contains('iwanttag')) {
                // Toggle between .iwanttag and .iwanttagclicked
                tag.classList.toggle('iwanttagclicked');
                // Toggle the text style
                tag.querySelector('.iwanttagtext').classList.toggle('iwanttagclickedtext');
            } else if (tag.classList.contains('excludingtag')) {
                // Toggle between .excludingtag and .excludingtagclicked
                tag.classList.toggle('excludingtagclicked');
                // Toggle the text style
                tag.querySelector('.excludingtagtext').classList.toggle('excludingtagclickedtext');
            }
        });
    });

    document.querySelectorAll('.formattag').forEach(function(tag) {
        tag.addEventListener('click', function() {
            // Toggle the .formattagclicked class
            if (tag.classList.contains('formattagclicked')) {
                // If .formattagclicked is active, remove it and restore .formattag
                tag.classList.remove('formattagclicked');
                tag.classList.add('formattag');
            } else {
                // If .formattagclicked is not active, remove .formattag and add .formattagclicked
                tag.classList.remove('formattag');
                tag.classList.add('formattagclicked');
            }
            
            // Toggle the text style for the child element
            tag.querySelector('.formattagtext').classList.toggle('formattagtextclicked');
        });
    
    });

// Handle click for .platformoptiontag elements
document.querySelectorAll('.platformoptiontag').forEach(function(tag) {
    tag.addEventListener('click', function() {
        // Toggle between .platformoptiontag and .platformoptiontagclicked
        tag.classList.toggle('platformoptiontagclicked');
    });
});


//code for youtubelink

// Define the outputtitle const
const outputtitle = "the office"; // For testing purposes
    
// Construct the YouTube search URL
const youtubeSearchURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(outputtitle)}+trailer`;

// Find the element with class trailerlink
const trailerLinkElement = document.querySelector('.trailerlink');

// Set the href attribute of the trailerlink element to the constructed URL
if (trailerLinkElement) {
    trailerLinkElement.setAttribute('href', youtubeSearchURL);
}


// IP LOCATION TOPIC
const datacountryDiv = document.querySelector('.datacountry');

// Replace with ipgeolocation.io API
const apiKey = 'bef3fb676a934d11bd1f3890962ed2b3';  // Your API key from ipgeolocation.io

// Fetch the geolocation data using ipgeolocation.io
fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        const country = data.country_name;  // Adjusted to the API response structure
        // Set the content of the div with class 'datacountry' to the country name
        datacountryDiv.textContent = country;
    })
    .catch(error => {
        console.error('Error fetching IP or country data:', error);
    });


    // Allow user to edit the content of the div when clicked
    datacountryDiv.addEventListener('click', function() {
        this.setAttribute('contentEditable', true); // Make the div editable
        this.focus(); // Focus the div so the user can start editing
    });

    // Enforce character limit of 20 characters
    datacountryDiv.addEventListener('input', function() {
        if (this.textContent.length > 20) {
            this.textContent = this.textContent.substring(0, 20); // Trim to 20 characters
        }
    });

    // Remove contentEditable attribute when user clicks away (blur)
    datacountryDiv.addEventListener('blur', function() {
        this.removeAttribute('contentEditable'); // Disable editing when focus is lost
    });

///COLLECTION////

    //FORMAT OPTION

    const generateButton = document.querySelector('.generatebutton-fastmode');
    
    generateButton.addEventListener('click', function() {
        const collectedValues = [];  // Array to store all collected values in key-value pairs

        // Format options
        const formatTags = document.querySelectorAll('.formattagclicked');
        formatTags.forEach(function(tag) {
            const formattagText = tag.querySelector('.formattagtext');
            if (formattagText) {
                collectedValues.push({ question: 'format', answer: formattagText.textContent.trim() });
            }
        });

        if (collectedValues.length === 0) {
            collectedValues.push({ question: 'format', answer: 'no preference' });
        }

        // Emotion preference
        const iwantTags = document.querySelectorAll('.iwanttagclicked');
        let iwantValues = [];

        iwantTags.forEach(function(tag) {
            const iwantTagText = tag.querySelector('.iwanttagtext');
            if (iwantTagText) {
                iwantValues.push(iwantTagText.textContent.trim());
            }
        });

        if (iwantValues.length === 0) {
            collectedValues.push({ question: 'user wants to', answer: 'no emotion preference' });
        } else {
            collectedValues.push({ question: 'user wants to', answer: iwantValues.join(', ') });
        }

        // Exclusion preference
        const excludingTags = document.querySelectorAll('.excludingtagclicked');
        let excludingValues = [];

        excludingTags.forEach(function(tag) {
            const excludingTagText = tag.querySelector('.excludingtagtext');
            if (excludingTagText) {
                excludingValues.push(excludingTagText.textContent.trim());
            }
        });

        if (excludingValues.length === 0) {
            collectedValues.push({ question: 'excluding', answer: 'no exclusion preference' });
        } else {
            collectedValues.push({ question: 'excluding', answer: excludingValues.join(', ') });
        }

        // Platform preference
        const platformTags = document.querySelectorAll('.platformoptiontagclicked');
        let platformValues = [];

        platformTags.forEach(function(tag) {
            const platformTagAlt = tag.querySelector('img').getAttribute('alt');
            if (platformTagAlt) {
                platformValues.push(platformTagAlt);
            }
        });

        const country = document.querySelector('.datacountry').textContent.trim();
        if (platformValues.length === 0) {
            collectedValues.push({ question: 'platform', answer: 'no specific platform preference' });
        } else {
            collectedValues.push({ question: 'platform', answer: `${platformValues.join(', ')} connected from: ${country}` });
        }

        // Additional preferences
        const detailBoxText = document.querySelector('.detailboxtext').value.trim();
const placeholder = document.querySelector('.detailboxtext').getAttribute('placeholder');

if (detailBoxText && detailBoxText !== placeholder) {
    collectedValues.push({ question: 'Additional user preferences', answer: detailBoxText });
} else {
    collectedValues.push({ question: 'Additional user preferences', answer: 'no additional preferences' });
}

// Now, send the collected data as an array
const useroutput = JSON.stringify(collectedValues);  // Convert the array to JSON

const imreadyDiv = document.querySelector('#imready');
const spinner = imreadyDiv.querySelector('.spinner');
const text = imreadyDiv.querySelector('.text');

const functionUrl = 'https://serverlessxaviopenai2.azurewebsites.net/api/cokoonfastes?';

// Show the spinner and hide the text before the fetch starts
spinner.style.display = 'inline-block';
text.style.display = 'none';

fetch(functionUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: useroutput  // Send the array as the request body
})
.then(response => response.json())  // Expect the response as JSON
.then(data => {
    console.log('Success:', data);
    document.querySelector('.results').style.display = 'flex'; // or 'block' // Show the results div
    mapJsonToDivs(data);  // Call the function to map the response to the frontend divs

    // Smooth scroll to the results
    setTimeout(() => {
        document.querySelector('.results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Show all result-cards that were hidden after the response is received
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach((card) => {
        card.style.display = 'flex';  // Use display: flex to show the card and restore its layout
    });

    // Revert back to the original text after the process completes
    spinner.style.display = 'none';
    text.style.display = 'inline';
})
.catch(error => {
    console.error('Error:', error);
    // Revert back to the original text if there's an error
    spinner.style.display = 'none';
    text.style.display = 'inline';
});

// Select the header element
const header = document.querySelector('.header-results-fastmode');

// Skip functionality to hide individual result-cards using display: none
const skipButtons = document.querySelectorAll('.cta-skip');
const resultCards = document.querySelectorAll('.result-card');  // Moving outside for better reference

skipButtons.forEach((skipButton, index) => {
    skipButton.addEventListener('click', () => {
        resultCards[index].style.display = 'none';  // Use display: none to hide the card and remove it from layout

        // Check if any result cards are still visible
        const visibleResultCards = Array.from(resultCards).filter(card => card.style.display !== 'none');
        if (visibleResultCards.length === 0) {
            header.style.display = 'none';  // Hide the header if no result cards are visible
        }
    });
});

// Function to check visibility of result cards and show/hide header accordingly
function checkHeaderVisibility() {
    const visibleResultCards = Array.from(resultCards).filter(card => card.style.display !== 'none');
    if (visibleResultCards.length > 0) {
        header.style.display = 'block';  // Show header if any result card is visible
    } else {
        header.style.display = 'none';  // Hide header if no result cards are visible
    }
}

// Call checkHeaderVisibility function whenever needed to ensure the header visibility is updated
checkHeaderVisibility();  // This can be called after any action that affects the visibility of result cards


// New Search functionality
const newSearchButton = document.querySelector('.cta-new-search');
    
newSearchButton.addEventListener('click', () => {
    // Smooth scroll to the top of the page
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Delay the page reload to allow smooth scrolling to complete
    setTimeout(() => {
        location.reload();  // Reload the page after scrolling
    }, 500);  // Adjust the delay as needed for the smooth scroll to finish
});


// Edit Search functionality
const editSearchButton = document.querySelector('.cta-edit-your-search');
const fastmodePage = document.querySelector('.fastmodepage');  // Selecting the class

editSearchButton.addEventListener('click', () => {
    console.log('Edit your search clicked');  // Check if the event is triggered
    if (fastmodePage) {
        fastmodePage.scrollIntoView({ behavior: 'smooth' });  // Smooth scroll to the "fastmodepage"
    } else {
        console.log('Element with class .fastmodepage not found');
    }
});

       // Select the "loving it", "not quite" buttons and the snackbar
const lovingItButton = document.querySelector('.loving-it');
const notQuiteButton = document.querySelector('.not-quite');
const snackbar = document.querySelector('.tyforyourfeedbacksnackbar');  // Using class instead of ID

// Function to show the snackbar
function showSnackbar() {
    snackbar.style.display = 'flex';  // Make the snackbar visible
}

// Add event listeners for both buttons
lovingItButton.addEventListener('click', showSnackbar);
notQuiteButton.addEventListener('click', showSnackbar);


        
        

    });

    function mapJsonToDivs(jsonResponse) {
    // Loop through each key in the JSON response
    for (const key in jsonResponse) {
        if (jsonResponse.hasOwnProperty(key)) {
            const value = jsonResponse[key];
            // Find the div with the class name corresponding to the key
            const div = document.querySelector(`.${key}`);
            
            // Only update the div if it exists and the value is not null
            if (div && value !== null) {
                div.textContent = value;

                // Logic for creating YouTube search links using a click event
                if (key === "rec1_cardcontenttitletext") {
                    const trailerLink1 = document.querySelector('.trailerlink1');
                    if (trailerLink1) {
                        const youtubeSearchURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(value)}+trailer+espanol`;
                        trailerLink1.addEventListener('click', function() {
                            window.open(youtubeSearchURL, '_blank');
                        });
                    }
                }

                if (key === "rec2_cardcontenttitletext") {
                    const trailerLink2 = document.querySelector('.trailerlink2');
                    if (trailerLink2) {
                        const youtubeSearchURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(value)}+trailer+espanol`;
                        trailerLink2.addEventListener('click', function() {
                            window.open(youtubeSearchURL, '_blank');
                        });
                    }
                }

                if (key === "rec3_cardcontenttitletext") {
                    const trailerLink3 = document.querySelector('.trailerlink3');
                    if (trailerLink3) {
                        const youtubeSearchURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(value)}+trailer+espanol`;
                        trailerLink3.addEventListener('click', function() {
                            window.open(youtubeSearchURL, '_blank');
                        });






                    }
                }
            }
        }
    }
}


    }





);


