document.addEventListener("DOMContentLoaded", function () {
  const progress = document.querySelector(".progress");
  const steps = document.querySelectorAll(".step");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentStep = 1;

  nextBtn.addEventListener("click", () => {
    currentStep++;
    updateSteps();
  });

  prevBtn.addEventListener("click", () => {
    currentStep--;
    updateSteps();
  });

  function updateSteps() {
    steps.forEach((step, idx) => {
      if (idx < currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });

    progress.style.width = ((currentStep - 1) / (steps.length - 1)) * 100 + "%";

    prevBtn.disabled = currentStep === 1;
    nextBtn.disabled = currentStep === steps.length;
  }
});
