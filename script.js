const programs = [
  "Pure Sciences",
  "Applied Sciences",
  "Engineering",
  "Accounting",
  "Management",
  "Arts"
];

const factors = [
  "Interest",
  "Exam Results",
  "Career",
  "Location",
  "Fees",
  "Explore"
];

const aimanRatings = [
  [5, 5, 3, 3, 4, 2],
  [4, 5, 4, 3, 3, 3],
  [4, 5, 5, 2, 5, 2],
  [3, 4, 4, 4, 4, 2],
  [3, 3, 3, 5, 3, 3],
  [2, 3, 2, 4, 2, 4]
];

const aimanWeights = [0.30, 0.20, 0.25, 0.10, 0.10, 0.05];

const ratingsBody = document.getElementById("ratingsBody");
const weightsGrid = document.getElementById("weightsGrid");
const resultsBody = document.getElementById("resultsBody");
const bestProgramme = document.getElementById("bestProgramme");
const profileNote = document.getElementById("profileNote");
const chartCanvas = document.getElementById("chartCanvas");
const chartContext = chartCanvas.getContext("2d");
const userNameInput = document.getElementById("userName");
const modeInputs = [...document.querySelectorAll('input[name="mode"]')];

function buildRatingsTable() {
  ratingsBody.innerHTML = "";
  programs.forEach((program, rowIndex) => {
    const row = document.createElement("tr");
    const labelCell = document.createElement("td");
    labelCell.textContent = program;
    row.appendChild(labelCell);

    factors.forEach((factor, columnIndex) => {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.max = "5";
      input.step = "1";
      input.value = aimanRatings[rowIndex][columnIndex];
      input.dataset.row = String(rowIndex);
      input.dataset.column = String(columnIndex);
      input.className = "rating-input";
      cell.appendChild(input);
      row.appendChild(cell);
    });

    ratingsBody.appendChild(row);
  });
}

function buildWeightsGrid() {
  weightsGrid.innerHTML = "";
  factors.forEach((factor, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const label = document.createElement("label");
    label.textContent = factor;
    label.htmlFor = `weight-${index}`;

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "5";
    input.step = "0.01";
    input.id = `weight-${index}`;
    input.value = aimanWeights[index];
    input.className = "weight-input";

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    weightsGrid.appendChild(wrapper);
  });
}

function currentMode() {
  return modeInputs.find(input => input.checked).value;
}

function setInputsDisabled(disabled) {
  document.querySelectorAll(".rating-input, .weight-input").forEach(input => {
    input.disabled = disabled;
  });
}

function loadAimanData() {
  document.querySelectorAll(".rating-input").forEach(input => {
    const row = Number(input.dataset.row);
    const column = Number(input.dataset.column);
    input.value = aimanRatings[row][column];
  });

  document.querySelectorAll(".weight-input").forEach((input, index) => {
    input.value = aimanWeights[index];
  });
}

function resetCustomInputs() {
  document.querySelectorAll(".rating-input").forEach(input => {
    input.value = "3";
  });

  document.querySelectorAll(".weight-input").forEach(input => {
    input.value = "1";
  });
}

function validateScaleValue(value, min, max, label) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${label} must be between ${min} and ${max}.`);
  }
  return value;
}

function readCustomRatings() {
  const matrix = [];

  for (let row = 0; row < programs.length; row += 1) {
    const values = [];
    for (let column = 0; column < factors.length; column += 1) {
      const input = document.querySelector(`.rating-input[data-row="${row}"][data-column="${column}"]`);
      const numericValue = Number(input.value);
      values.push(validateScaleValue(numericValue, 1, 5, `${programs[row]} - ${factors[column]}`));
    }
    matrix.push(values);
  }

  return matrix;
}

function readCustomWeights() {
  const weights = [...document.querySelectorAll(".weight-input")].map((input, index) => {
    return validateScaleValue(Number(input.value), 0, 5, `${factors[index]} weight`);
  });

  const total = weights.reduce((sum, value) => sum + value, 0);
  if (total === 0) {
    throw new Error("The sum of weights cannot be zero.");
  }

  return weights.map(value => value / total);
}

function calculateUtilities(ratings, weights) {
  return ratings.map(row => row.reduce((sum, value, index) => sum + value * weights[index], 0));
}

function calculateProbabilities(utilities) {
  const maxUtility = Math.max(...utilities);
  const expUtilities = utilities.map(value => Math.exp(value - maxUtility));
  const total = expUtilities.reduce((sum, value) => sum + value, 0);
  return expUtilities.map(value => value / total);
}

function renderResults(utilities, probabilities, profileLabel, userName) {
  resultsBody.innerHTML = "";

  let bestIndex = 0;
  probabilities.forEach((probability, index) => {
    if (probability > probabilities[bestIndex]) {
      bestIndex = index;
    }
  });

  programs.forEach((program, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${program}</td>
      <td>${utilities[index].toFixed(4)}</td>
      <td>${(probabilities[index] * 100).toFixed(2)}%</td>
    `;
    resultsBody.appendChild(row);
  });

  const displayName = userName.trim() || profileLabel;
  bestProgramme.textContent = `${programs[bestIndex]} (${(probabilities[bestIndex] * 100).toFixed(2)}%)`;
  profileNote.textContent = `Profile used: ${profileLabel}. Recommendation prepared for ${displayName}.`;
  drawChart(probabilities);
}

function drawChart(probabilities) {
  const width = chartCanvas.width;
  const height = chartCanvas.height;
  const padding = 48;
  const chartHeight = height - padding * 2;
  const barAreaWidth = width - padding * 2;
  const barWidth = barAreaWidth / probabilities.length - 14;

  chartContext.clearRect(0, 0, width, height);

  chartContext.fillStyle = "#1f2933";
  chartContext.font = "13px Trebuchet MS";
  chartContext.textAlign = "center";

  chartContext.strokeStyle = "rgba(31, 122, 140, 0.22)";
  chartContext.lineWidth = 1;

  for (let grid = 0; grid <= 5; grid += 1) {
    const y = padding + (chartHeight / 5) * grid;
    chartContext.beginPath();
    chartContext.moveTo(padding, y);
    chartContext.lineTo(width - padding, y);
    chartContext.stroke();

    const label = `${100 - grid * 20}%`;
    chartContext.fillStyle = "#5d6a75";
    chartContext.textAlign = "right";
    chartContext.fillText(label, padding - 8, y + 4);
  }

  probabilities.forEach((probability, index) => {
    const percentage = probability * 100;
    const barHeight = (percentage / 100) * chartHeight;
    const x = padding + index * (barWidth + 14) + 7;
    const y = height - padding - barHeight;

    chartContext.fillStyle = index % 2 === 0 ? "#1f7a8c" : "#d97d54";
    chartContext.fillRect(x, y, barWidth, barHeight);

    chartContext.fillStyle = "#1f2933";
    chartContext.textAlign = "center";
    chartContext.fillText(`${percentage.toFixed(1)}%`, x + barWidth / 2, y - 8);

    chartContext.save();
    chartContext.translate(x + barWidth / 2, height - padding + 16);
    chartContext.rotate(-0.45);
    chartContext.fillStyle = "#405261";
    chartContext.fillText(programs[index], 0, 0);
    chartContext.restore();
  });
}

function runModel() {
  try {
    const mode = currentMode();
    const userName = userNameInput.value;

    let ratings;
    let weights;
    let profileLabel;

    if (mode === "aiman") {
      ratings = aimanRatings.map(row => [...row]);
      weights = [...aimanWeights];
      profileLabel = "Aiman Default Profile";
      loadAimanData();
    } else {
      ratings = readCustomRatings();
      weights = readCustomWeights();
      profileLabel = "Custom Profile";
    }

    const utilities = calculateUtilities(ratings, weights);
    const probabilities = calculateProbabilities(utilities);
    renderResults(utilities, probabilities, profileLabel, userName);
  } catch (error) {
    bestProgramme.textContent = "Input error";
    profileNote.textContent = error.message;
    resultsBody.innerHTML = "";
    chartContext.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
  }
}

function syncModeState() {
  if (currentMode() === "aiman") {
    loadAimanData();
    setInputsDisabled(true);
  } else {
    setInputsDisabled(false);
  }
}

buildRatingsTable();
buildWeightsGrid();
syncModeState();
runModel();

modeInputs.forEach(input => input.addEventListener("change", syncModeState));
document.getElementById("runButton").addEventListener("click", runModel);
document.getElementById("loadAimanButton").addEventListener("click", () => {
  loadAimanData();
  modeInputs[0].checked = true;
  syncModeState();
  runModel();
});
document.getElementById("resetCustomButton").addEventListener("click", () => {
  modeInputs[1].checked = true;
  syncModeState();
  resetCustomInputs();
  resultsBody.innerHTML = "";
  bestProgramme.textContent = "Custom inputs reset";
  profileNote.textContent = "Enter your own scores and click Run Model.";
  chartContext.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
});
