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
        this.style.height = 'auto'; // Reset the height
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

    // Handle click for .formattag elements
    document.querySelectorAll('.formattag').forEach(function(tag) {
        tag.addEventListener('click', function() {
            // Toggle between .formattag and .formattagclicked
            tag.classList.toggle('formattagclicked');
            // Toggle the text style
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



});


