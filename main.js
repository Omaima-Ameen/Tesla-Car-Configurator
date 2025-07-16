const topBar = document.querySelector("#top-bar");
const exteriorColorSection = document.querySelector("#exterior-buttons");
const interiorColorSection = document.querySelector("#interior-buttons");
const exteriorImage = document.querySelector("#exterior-image");
const interiorImage = document.querySelector("#interior-image");
const wheelButtonsSection = document.querySelector("#wheel-buttons");
const performanceBtn = document.querySelector("#performance-btn");
const totalPriceElement = document.querySelector("#total-price");
const fullSelfDrivingCheckbox = document.querySelector(
  "#full-self-driving-checkbox",
);
const accessoryCheckboxes = document.querySelectorAll(
  ".accessory-form-checkbox",
);
const downPaymentElement = document.querySelector("#down-payment");
const monthlyPaymentElement = document.querySelector("#monthly-payment");

const basePrice = 52940; //- because ye to price hai hi
let currentPrice = basePrice;

let selectedColor = "Stealth Grey";
const selectedOptions = {
  "Performance Wheels": false,
  "Performance Package": false,
  "Full Self-Driving": false,
};
const pricing = {
  "Performance Wheels": 2500,
  "Performance Package": 5000,
  "Full Self-Driving": 8500,
  Accessories: {
    "Center Console Trays": 35,
    Sunshade: 105,
    "All-weather Interior Liners": 225,
  },
};

//-Update total price in UI
const updateTotalPrice = () => {
  //reset the current price to base price
  currentPrice = basePrice;

  //- performance wheels option
  if (selectedOptions["Performance Wheels"]) {
    currentPrice += pricing["Performance Wheels"];
  }

  //-performance package option
  if (selectedOptions["Performance Package"]) {
    currentPrice += pricing["Performance Package"];
  }

  //-full self-driving option
  if (selectedOptions["Full Self-Driving"]) {
    currentPrice += pricing["Full Self-Driving"];
  }
  //- accessory checkboxes options
  accessoryCheckboxes.forEach((checkbox) => {
    // Extract the accessory label
    const accessoryLabel = checkbox
      .closest("label")
      .querySelector("span")
      .textContent.trim();

    const accessoryPrice = pricing["Accessories"][accessoryLabel];

    //add to currentPrice if accessory is selected
    if (checkbox.checked) {
      currentPrice += accessoryPrice;
    }
  });
  //update the total price in UI
  totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;

  updatePaymentBreakdown();
};

//update payment breakdown based on current price
const updatePaymentBreakdown = () => {
  //- calculate down payment
  const downpayment = currentPrice * 0.1;
  downPaymentElement.textContent = `$${downpayment.toLocaleString()}`;

  //-Calculate loan details (assuming 60-months loan and 3% interetst rate)

  const loanTermMonth = 60;
  const interestRate = 0.03;

  const loanAmount = currentPrice - downpayment;

  //Monthly Payment Formula - P* (r(1+r) ^n) / ((1+r)^n - 1)
  const monthlyInterestRate = interestRate / 12;

  const monthlyPayment =
    (loanAmount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonth))) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonth) - 1);

  monthlyPaymentElement.textContent = `$${monthlyPayment
    .toFixed(2)
    .toLocaleString()}`;
};
//-handle top bar on scroll
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle("visible-bar", atTop);
  topBar.classList.toggle("hidden-bar", !atTop);
};

//- Image Mapping
const exteriorImages = {
  "Stealth Grey": "./images/model-y-stealth-grey.jpg",
  "Pearl White": "./images/model-y-pearl-white.jpg",
  "Deep Blue": "./images/model-y-deep-blue-metallic.jpg",
  "Solid Black": "./images/model-y-solid-black.jpg",
  "Ultra Red": "./images/model-y-ultra-red.jpg",
  "Quick Silver": "./images/model-y-quicksilver.jpg",
};

const interiorImages = {
  Dark: "./images/model-y-interior-dark.jpg",
  Light: "./images/model-y-interior-light.jpg",
};
//- Handle color selection
const handleColorButtonClick = (event) => {
  let button;

  ///ab chunki jo hum click krre wo image ahi isliye

  if (event.target.tagName === "IMG") {
    button = event.target.closest("button");
  } else if (event.target.tagName === "BUTTON") {
    button = event.target;
  }
  if (button) {
    const buttons = event.currentTarget.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("btn-selected"));

    button.classList.add("btn-selected");

    //-change exterior image
    if (event.currentTarget === exteriorColorSection) {
      selectedColor = button.querySelector("img").alt;
      updateExteriorImage();
    }

    if (event.currentTarget === interiorColorSection) {
      const color = button.querySelector("img").alt;
      interiorImage.src = interiorImages[color];
    }
  }
};
//-Update exterior image based on color and image
const updateExteriorImage = () => {
  const performanceSuffix = selectedOptions["Performance Wheels"]
    ? "-performance"
    : "";

  const colorKey =
    selectedColor in exteriorImages ? selectedColor : "Stealth Grey";
    exteriorImage.src = exteriorImages[colorKey].replace(
    ".jpg",
    `${performanceSuffix}.jpg`,
  );
  console.log("performanceSuffix call");
};
//- Wheel Selection
const handleWheelButtonClick = (event) => {
  if (event.target.tagName === "BUTTON") {
    const buttons = document.querySelectorAll("#wheel-buttons button");
    buttons.forEach((btn) => {
      btn.classList.remove("bg-gray-700", "text-white");

      //add selected styles to clicked button
      event.target.classList.add("bg-gray-700", "text-white");

      selectedOptions["Performance Wheels"] =
        event.target.textContent.includes("Performance");

      updateExteriorImage();

      updateTotalPrice();
    });
  }
};
//-Performance Package Selection
const handlePerformanceButtonClick = () => {
  const isSelected = performanceBtn.classList.toggle("bg-gray-700");
  performanceBtn.classList.toggle("text-white");
  //update selected options
  selectedOptions["Performance Package"] = isSelected;
  updateTotalPrice();
};
//-Full self driving selection
const fullSelfDrivingChange = () => {
  const isSelected = fullSelfDrivingCheckbox.checked;
  selectedOptions["Full Self-Driving"] = isSelected;
  updateTotalPrice();
};
//- Handle Accessory Checkboxes
accessoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    updateTotalPrice();
  });
});
//-Initial Update Total Price
updateTotalPrice();

//- Event Listeners
/// request..will enhance performace that's it!
window.addEventListener("scroll", () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener("click", handleColorButtonClick);
interiorColorSection.addEventListener("click", handleColorButtonClick);
wheelButtonsSection.addEventListener("click", handleWheelButtonClick);
performanceBtn.addEventListener("click", handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener("click", fullSelfDrivingChange);
