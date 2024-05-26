document.addEventListener('DOMContentLoaded', () => {

  const closeButton = document.getElementById('closeButton');
  // Close button click handler
  closeButton.addEventListener('click', handleClose);

  const submitButton = document.getElementById('submitButton');
  // Submit button click handler
  submitButton.addEventListener('click', handleSubmit);

  // keyup, keydown, blur event handlers
  const whatsappNumberInput = document.getElementById('whatsappNumber');
  whatsappNumberInput.focus();
  whatsappNumberInput.addEventListener("keypress", handleEnterEvent);
  whatsappNumberInput.addEventListener('keyup', handleInputChange);
  whatsappNumberInput.addEventListener('keydown', handleInputChange);
  whatsappNumberInput.addEventListener('blur', handleInputBlur);


  const closeCustomAlertButton = document.getElementById('customAlertButton');  
  closeCustomAlertButton.addEventListener('click', closeCustomAlert);

  // Function to handle input blur
  function handleInputBlur() {
    const whatsappNumber = whatsappNumberInput.value.trim();
    if (whatsappNumber === '') {
      whatsappNumberInput.value = ''; // Clear the input field if it contains only whitespace
    }
  }

  // Function to close the popup
  function handleClose() {
    window.close();
  }

  function handleEnterEvent(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("submitButton").click();
    }
  }

  // Function to handle input change
  function handleInputChange() {
    const whatsappNumber = whatsappNumberInput.value.trim();
    if (whatsappNumber === '') {
      hideTooltip(); // Hide tooltip when input is empty
    } else if (isValidNumber(whatsappNumber)) {
      hideTooltip(); // Hide tooltip when input is valid
    } else {
      showTooltip(); // Show tooltip when input is invalid
    }
  }

  // Function to handle submission
  function handleSubmit() {
    const whatsappNumber = whatsappNumberInput.value.trim();
    if (isValidNumber(whatsappNumber)) {
      submitWhatsAppNumber(whatsappNumber);
    } else {
      showTooltip();
    }
  }

  // Function to check if input is a valid WhatsApp number
  function isValidNumber(number) {
    return number && /^\d+$/.test(number);
  }

  // Function to show tooltip
  function showTooltip() {
    tooltip.classList.add('active');
  }

  // Function to hide tooltip
  function hideTooltip() {
    tooltip.classList.remove('active');
  }

  function showCustomAlert() {
    const customAlert = document.getElementById('customAlert');
    customAlert.style.display = 'block';
  }

  function closeCustomAlert(){
    const customAlert = document.getElementById('customAlert');
    customAlert.style.display = 'none';
    // window.close();
  }

  // Function to submit WhatsApp number
  function submitWhatsAppNumber(number) {
    const newURL = `https://web.whatsapp.com/send/?phone=${number}&text&type=phone_number&app_absent=0`;

    // Query to find all tabs
    chrome.tabs.query({}, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }

      const whatsappTabPattern = /^(\(\d*\)\s*)?WhatsApp$/;

      // Find the first tab that matches the pattern
      const whatsappTab = tabs.find(tab => whatsappTabPattern.test(tab.title));

      if (!whatsappTab) {
        showCustomAlert();
        return;
      }

      // Update the tab's URL and activate it
      chrome.tabs.update(whatsappTab.id, { url: newURL, active: true }, (updatedTab) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
        }

        // Focus the window containing the tab
        chrome.windows.update(updatedTab.windowId, { focused: true }, (updatedWindow) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }

          console.log(`Window focused: ${updatedWindow.id}`);
        });
      });
    });
  }
});
