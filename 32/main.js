document.addEventListener("DOMContentLoaded", function() {
  // DOM Elements
  const qrForm = document.getElementById("qrForm");
  const qrText = document.getElementById("qrText");
  const qrSize = document.getElementById("qrSize");
  const qrDarkColor = document.getElementById("qrDarkColor");
  const qrLightColor = document.getElementById("qrLightColor");
  const qrCodeContainer = document.getElementById("qrcode");
  const emptyMessage = document.getElementById("emptyMessage");
  const downloadContainer = document.getElementById("downloadContainer");
  const downloadBtn = document.getElementById("downloadBtn");
  
  // QR Code Instance
  let qrCodeInstance = null;
  
  // Generate QR Code
  qrForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Get values from form
    const text = qrText.value.trim();
    const size = parseInt(qrSize.value);
    const darkColor = qrDarkColor.value;
    const lightColor = qrLightColor.value;
    
    if (!text) {
      alert("Please enter text or URL to generate QR code");
      return;
    }
    
    // Clear previous QR code
    qrCodeContainer.innerHTML = "";
    
    // Create new QR code
    qrCodeInstance = new QRCode(qrCodeContainer, {
      text: text,
      width: size,
      height: size,
      colorDark: darkColor,
      colorLight: lightColor,
      correctLevel: QRCode.CorrectLevel.H
    });
    
    // Show download button and hide empty message
    downloadContainer.style.display = "block";
    emptyMessage.style.display = "none";
  });
  
  // Download QR Code as Image
  downloadBtn.addEventListener("click", function() {
    if (!qrCodeInstance) return;
    
    // Find the image created by QRCode.js
    const img = qrCodeContainer.querySelector("img");
    
    if (img) {
      // Create a temporary anchor element
      const downloadLink = document.createElement("a");
      
      // Get image data as base64 string
      const imageData = img.src;
      
      // Set download link attributes
      downloadLink.href = imageData;
      downloadLink.download = "qrcode.png";
      
      // Simulate click to trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      alert("Unable to download QR code. Please try again.");
    }
  });
});