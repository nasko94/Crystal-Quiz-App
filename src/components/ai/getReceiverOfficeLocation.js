export async function getReceiverOfficeLocationButton() {
    // Create modal container
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;
  
    // Get the city and address from the receiver inputs
    const receiverCity = document.querySelector('[name="receiver.city"]').value || '';
    const receiverAddress = document.querySelector('[name="receiver.officeLocation"]').value || '';
    
    // Create modal content with encoded parameters
    modal.innerHTML = `
      <div style="position: relative; width: 90%; height: 90%; background: white; border-radius: 8px; overflow: hidden;">
        <button onclick="this.parentElement.parentElement.remove()" 
                style="position: absolute; right: 10px; top: 10px; padding: 5px 10px; z-index: 1001; 
                       background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">✕</button>
        <iframe 
          id="officeLocatorFrame"
          src="https://agreeable-forest-09fdc1003.1.azurestaticapps.net/?source=ee?officeType=&shopUrl=e-econt&city=${encodeURIComponent(receiverCity)}&address=${encodeURIComponent(receiverAddress)}&lang=bg" 
          style="width: 100%; height: 100%; border: none;"
          frameborder="0">
        </iframe>
      </div>
    `;
  
    // Add modal to page
    document.body.appendChild(modal);
    receiverOfficeSelected = true;
    senderOfficeSelected = false;
  
    // Listen for messages from the iframe
    window.addEventListener('message', function(event) {
      // Verify the origin of the message
      if (event.origin === 'https://agreeable-forest-09fdc1003.1.azurestaticapps.net') {
        const officeData = event.data;
  
        // Extract the full address from the office data
        if (officeData && officeData.office && officeData.office.address) {
          const fullAddress = officeData.office.address.fullAddress;
          const officeName = officeData.office.name;
          // If the type is receiver, update the receiver office elements
          if (receiverOfficeSelected) {
            //console.log('Selected receiver office:', fullAddress);
  
            // Update the form elements
            const statusElement = document.querySelector('.receiver-office-status');
            const officeNameElement = document.querySelector('.receiver-office-name');
            const officeAddressElement = document.querySelector('.receiver-office-address');
            const confidenceButtons = document.querySelector('.receiver-confidence-buttons');
            const officeInput = document.querySelector('[name="receiver.officeLocation"]');
  
            // Update status and input
            statusElement.textContent = 'Офиса е успешно намерен!';
            statusElement.style.color = '#059669';
            officeInput.value = officeName;
            officeNameElement.textContent = `Офис: ${officeName}`;
            officeAddressElement.textContent = `Адрес: ${fullAddress}`;
            confidenceButtons.style.display = 'none';
            receiverOfficeSelected = false;
            window.firstReceiverOfficeMatch = true;

            // Add 500ms delay before triggering change event
            setTimeout(() => {}, 200);            
            const locationInputs = {
              sender: {
                city: document.querySelector('[name="sender.city"]'),
                office: document.querySelector('[name="sender.officeLocation"]'),
                street: document.querySelector('[name="sender.streetAddress"]'),
                number: document.querySelector('[name="sender.streetNumber"]')
              },
              receiver: {
                city: document.querySelector('[name="receiver.city"]'),
                office: document.querySelector('[name="receiver.officeLocation"]'),
                street: document.querySelector('[name="receiver.streetAddress"]'),
                number: document.querySelector('[name="receiver.streetNumber"]')
              }
            };
            checkLocation(locationInputs, 'receiver', 'office');
          }
        }  
        // Close the modal
        modal.remove();
      }
    });
  }
  
  // Add this new function for handling sender office location
  export async function getSenderOfficeLocationButton() {
    // Create modal container
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;
  
    // Get the city and address from the sender inputs
    const senderCity = document.querySelector('[name="sender.city"]').value || '';
    const senderAddress = document.querySelector('[name="sender.officeLocation"]').value || '';
    
    // Create modal content with encoded parameters
    modal.innerHTML = `
      <div style="position: relative; width: 90%; height: 90%; background: white; border-radius: 8px; overflow: hidden;">
        <button onclick="this.parentElement.parentElement.remove()" 
                style="position: absolute; right: 10px; top: 10px; padding: 5px 10px; z-index: 1001; 
                       background: white; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">✕</button>
        <iframe 
          id="senderOfficeLocatorFrame"
          src="https://agreeable-forest-09fdc1003.1.azurestaticapps.net/?source=ee?officeType=&shopUrl=e-econt&city=${encodeURIComponent(senderCity)}&address=${encodeURIComponent(senderAddress)}&lang=bg" 
          style="width: 100%; height: 100%; border: none;"
          frameborder="0">
        </iframe>
      </div>
    `;
  
    // Add modal to page
    document.body.appendChild(modal);
    senderOfficeSelected = true;
    receiverOfficeSelected = false;
  
    // Listen for messages from the iframe
    window.addEventListener('message', function(event) {
      // Verify the origin of the message
      if (event.origin === 'https://agreeable-forest-09fdc1003.1.azurestaticapps.net') {
        const officeData = event.data;
  
        // Extract the full address from the office data
        if (officeData && officeData.office && officeData.office.address) {
          const fullAddress = officeData.office.address.fullAddress;
          const officeName = officeData.office.name;
  
          // If the type is sender, update the sender office elements
          if (senderOfficeSelected) {
            //console.log('Selected sender office:', fullAddress);
            
            // Update the form elements
            const statusElement = document.querySelector('.sender-office-status');
            const officeNameElement = document.querySelector('.sender-office-name');
            const officeAddressElement = document.querySelector('.sender-office-address');
            const confidenceButtons = document.querySelector('.sender-confidence-buttons');
            const officeInput = document.querySelector('[name="sender.officeLocation"]');
  
            // Update status and input
            statusElement.textContent = 'Офиса е успешно намерен!';
            statusElement.style.color = '#059669';
            officeInput.value = officeName;
            officeNameElement.textContent = `Офис: ${officeName}`;
            officeAddressElement.textContent = `Адрес: ${fullAddress}`;
            confidenceButtons.style.display = 'none';
            senderOfficeSelected = false;  
            window.firstSenderOfficeMatch = true;
            
            // Add 500ms delay before checking the location for everything to update
            setTimeout(() => {}, 200);            

            const locationInputs = {
              sender: {
                city: document.querySelector('[name="sender.city"]'),
                office: document.querySelector('[name="sender.officeLocation"]'),
                street: document.querySelector('[name="sender.streetAddress"]'),
                number: document.querySelector('[name="sender.streetNumber"]')
              },
              receiver: {
                city: document.querySelector('[name="receiver.city"]'),
                office: document.querySelector('[name="receiver.officeLocation"]'),
                street: document.querySelector('[name="receiver.streetAddress"]'),
                number: document.querySelector('[name="receiver.streetNumber"]')
              }
            };
            checkLocation(locationInputs, 'sender', 'office');
          }
        }  

        // Close the modal
        modal.remove();
      }
    });
  }