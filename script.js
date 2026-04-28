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

const aimanPage = document.getElementById("aimanPage");
const customPage = document.getElementById("customPage");
const aimanProgramCards = document.getElementById("aimanProgramCards");
const aimanWeightsSummary = document.getElementById("aimanWeightsSummary");
const customProgramCards = document.getElementById("customProgramCards");
const weightsGrid = document.getElementById("weightsGrid");
const resultsBody = document.getElementById("resultsBody");
const bestProgramme = document.getElementById("bestProgramme");
const profileNote = document.getElementById("profileNote");
const chartCanvas = document.getElementById("chartCanvas");
const chartContext = chartCanvas.getContext("2d");
const userNameInput = document.getElementById("userName");
const modeInputs = [...document.querySelectorAll('input[name="mode"]')];

let lastChartData = null;

function currentMode() {
  return modeInputs.find((input) => input.checked).value;
}

function buildAimanProfile() {
  aimanProgramCards.innerHTML = "";
  aimanWeightsSummary.innerHTML = "";

  programs.forEach((program, rowIndex) => {
    const card = document.createElement("article");
    card.className = "program-card";

    const title = document.createElement("h3");
    title.textContent = program;
    card.appendChild(title);

    const text = document.createElement("p");
    text.textContent = "Baseline scores taken directly from the assignment profile.";
    card.appendChild(text);

    const chipGrid = document.createElement("div");
    chipGrid.className = "score-chip-grid";

    factors.forEach((factor, columnIndex) => {
      const chip = document.createElement("div");
      chip.className = "score-chip";
      chip.innerHTML = `
        <span class="mini-label">${factor}</span>
        <strong>${aimanRatings[rowIndex][columnIndex]}</strong>
      `;
      chipGrid.appendChild(chip);
    });

    card.appendChild(chipGrid);
    aimanProgramCards.appendChild(card);
  });

  factors.forEach((factor, index) => {
    const card = document.createElement("div");
    card.className = "weight-summary-card";
    card.innerHTML = `
      <p>${factor}</p>
      <strong>${(aimanWeights[index] * 100).toFixed(0)}%</strong>
    `;
    aimanWeightsSummary.appendChild(card);
  });
}

function buildCustomWeights() {
  weightsGrid.innerHTML = "";

  factors.forEach((factor, factorIndex) => {
    const wrapper = document.createElement("div");
    wrapper.className = "weight-picker";

    const label = document.createElement("div");
    label.className = "slider-label";
    label.innerHTML = `<span>${factor}</span>`;
    wrapper.appendChild(label);

    const options = document.createElement("div");
    options.className = "weight-scale";

    for (let value = 1; value <= 5; value += 1) {
      const option = document.createElement("label");
      option.className = "weight-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `weight-${factorIndex}`;
      input.value = String(value);
      input.className = "weight-input";
      input.dataset.index = String(factorIndex);
      if (value === 3) {
        input.checked = true;
      }

      const chip = document.createElement("span");
      chip.textContent = String(value);

      option.appendChild(input);
      option.appendChild(chip);
      options.appendChild(option);
    }

    wrapper.appendChild(options);
    weightsGrid.appendChild(wrapper);
  });
}

function buildCustomProgramCards() {
  customProgramCards.innerHTML = "";

  programs.forEach((program, rowIndex) => {
    const card = document.createElement("article");
    card.className = "program-card slider-card";

    const title = document.createElement("h3");
    title.textContent = program;
    card.appendChild(title);

    const text = document.createElement("p");
    text.textContent = "Adjust the ratings with sliders from 1 to 5.";
    card.appendChild(text);

    const sliderList = document.createElement("div");
    sliderList.className = "slider-list";

    factors.forEach((factor, columnIndex) => {
      const row = document.createElement("div");
      row.className = "slider-row";

      const topLine = document.createElement("div");
      topLine.className = "slider-topline";
      topLine.innerHTML = `
        <span class="slider-label">${factor}</span>
        <span class="slider-value" id="value-${rowIndex}-${columnIndex}">3</span>
      `;

      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = "1";
      slider.max = "5";
      slider.step = "1";
      slider.value = "3";
      slider.className = "rating-input";
      slider.dataset.row = String(rowIndex);
      slider.dataset.column = String(columnIndex);
      slider.setAttribute("aria-label", `${program} ${factor}`);

      slider.addEventListener("input", () => {
        updateSliderValue(rowIndex, columnIndex, slider.value);
      });

      const scale = document.createElement("div");
      scale.className = "slider-scale";
      scale.innerHTML = "<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>";

      row.appendChild(topLine);
      row.appendChild(slider);
      row.appendChild(scale);
      sliderList.appendChild(row);
    });

    card.appendChild(sliderList);
    customProgramCards.appendChild(card);
  });
}

function updateSliderValue(rowIndex, columnIndex, value) {
  const label = document.getElementById(`value-${rowIndex}-${columnIndex}`);
  if (label) {
    label.textContent = value;
  }
}

function setModePage(mode) {
  const isAiman = mode === "aiman";
  aimanPage.classList.toggle("active", isAiman);
  customPage.classList.toggle("active", !isAiman);
  aimanPage.hidden = !isAiman;
  customPage.hidden = isAiman;
}

function setCustomRatings(matrix) {
  document.querySelectorAll(".rating-input").forEach((input) => {
    const row = Number(input.dataset.row);
    const column = Number(input.dataset.column);
    const value = String(matrix[row][column]);
    input.value = value;
    updateSliderValue(row, column, value);
  });
}

function setCustomWeights(values) {
  const source = values.map((value) => {
    if (value <= 1) {
      return Math.max(1, Math.min(5, Math.round(value * 10)));
    }
    return Math.max(1, Math.min(5, Math.round(value)));
  });

  factors.forEach((_, index) => {
    const input = document.querySelector(`input[name="weight-${index}"][value="${source[index]}"]`);
    if (input) {
      input.checked = true;
    }
  });
}

function resetCustomInputs() {
  const neutralRatings = programs.map(() => factors.map(() => 3));
  setCustomRatings(neutralRatings);
  setCustomWeights([3, 3, 3, 3, 3, 3]);
}

function readCustomRatings() {
  return programs.map((_, row) => {
    return factors.map((__, column) => {
      const input = document.querySelector(`.rating-input[data-row="${row}"][data-column="${column}"]`);
      return Number(input.value);
    });
  });
}

function readCustomWeights() {
  const rawValues = factors.map((_, index) => {
    const selected = document.querySelector(`input[name="weight-${index}"]:checked`);
    return Number(selected.value);
  });

  const total = rawValues.reduce((sum, value) => sum + value, 0);
  return rawValues.map((value) => value / total);
}

function calculateUtilities(ratings, weights) {
  return ratings.map((row) => {
    return row.reduce((sum, value, index) => sum + value * weights[index], 0);
  });
}

function calculateProbabilities(utilities) {
  const maxUtility = Math.max(...utilities);
  const expUtilities = utilities.map((value) => Math.exp(value - maxUtility));
  const total = expUtilities.reduce((sum, value) => sum + value, 0);
  return expUtilities.map((value) => value / total);
}

function renderResults(utilities, probabilities, profileLabel, userName) {
  resultsBody.innerHTML = "";

  const ranked = programs.map((program, index) => ({
    program,
    utility: utilities[index],
    probability: probabilities[index]
  })).sort((left, right) => right.probability - left.probability);

  ranked.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = `result-card${index === 0 ? " top-result" : ""}`;
    card.innerHTML = `
      <div class="result-program">
        <span>${index === 0 ? "Top match" : "Programme"}</span>
        <strong>${item.program}</strong>
      </div>
      <div class="metric">
        <span>Utility</span>
        <strong>${item.utility.toFixed(4)}</strong>
      </div>
      <div class="metric">
        <span>Probability</span>
        <strong>${(item.probability * 100).toFixed(2)}%</strong>
      </div>
    `;
    resultsBody.appendChild(card);
  });

  const bestMatch = ranked[0];
  const displayName = userName.trim() || profileLabel;
  bestProgramme.textContent = `${bestMatch.program} (${(bestMatch.probability * 100).toFixed(2)}%)`;
  profileNote.textContent = `Profile used: ${profileLabel}. Recommendation prepared for ${displayName}.`;
  lastChartData = ranked;
  drawChart(ranked);
}

function resizeChartCanvas() {
  const container = chartCanvas.parentElement;
  const rect = container.getBoundingClientRect();
  const width = Math.max(320, rect.width);
  const height = Math.max(380, rect.height);
  const devicePixelRatio = window.devicePixelRatio || 1;

  chartCanvas.width = Math.round(width * devicePixelRatio);
  chartCanvas.height = Math.round(height * devicePixelRatio);
  chartContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  return { width, height };
}

function drawRoundedBar(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, height / 2, width / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function drawChart(rankedData) {
  const { width, height } = resizeChartCanvas();
  const labelArea = Math.min(170, Math.max(114, width * 0.28));
  const rightPadding = 70;
  const topPadding = 38;
  const bottomPadding = 38;
  const rowGap = 18;
  const rowHeight = (height - topPadding - bottomPadding - rowGap * (programs.length - 1)) / programs.length;
  const barHeight = Math.max(22, rowHeight * 0.56);
  const chartWidth = width - labelArea - rightPadding - 28;

  chartContext.clearRect(0, 0, width, height);

  chartContext.fillStyle = "#ebf1ff";
  chartContext.font = "600 14px Segoe UI";
  chartContext.textAlign = "left";
  chartContext.fillText("Probability (%)", labelArea, 24);

  chartContext.strokeStyle = "rgba(125, 142, 227, 0.16)";
  chartContext.lineWidth = 1;
  chartContext.font = "12px Segoe UI";
  chartContext.fillStyle = "rgba(181, 193, 240, 0.72)";
  chartContext.textAlign = "center";

  for (let tick = 0; tick <= 5; tick += 1) {
    const x = labelArea + (chartWidth / 5) * tick;
    chartContext.beginPath();
    chartContext.moveTo(x, topPadding - 8);
    chartContext.lineTo(x, height - bottomPadding + 8);
    chartContext.stroke();
    chartContext.fillText(`${tick * 20}%`, x, height - 10);
  }

  const maxProbability = Math.max(...rankedData.map((item) => item.probability));

  rankedData.forEach((item, index) => {
    const probability = item.probability;
    const top = topPadding + index * (rowHeight + rowGap);
    const trackY = top + (rowHeight - barHeight) / 2;
    const barWidth = Math.max(0, chartWidth * probability);
    const isTop = probability === maxProbability;

    chartContext.textAlign = "left";
    chartContext.fillStyle = isTop ? "#ffffff" : "#dbe4ff";
    chartContext.font = isTop ? "700 14px Segoe UI" : "600 14px Segoe UI";
    chartContext.fillText(item.program, 12, top + rowHeight / 2 + 5);

    drawRoundedBar(chartContext, labelArea, trackY, chartWidth, barHeight, barHeight / 2);
    chartContext.fillStyle = "rgba(35, 50, 98, 0.95)";
    chartContext.fill();

    const gradient = chartContext.createLinearGradient(labelArea, 0, labelArea + barWidth, 0);
    gradient.addColorStop(0, isTop ? "#7ad7ff" : "#4f9fff");
    gradient.addColorStop(1, isTop ? "#c084ff" : "#8a63ff");

    drawRoundedBar(chartContext, labelArea, trackY, Math.max(barWidth, 8), barHeight, barHeight / 2);
    chartContext.fillStyle = gradient;
    chartContext.shadowColor = isTop ? "rgba(168, 119, 255, 0.38)" : "rgba(80, 149, 255, 0.18)";
    chartContext.shadowBlur = isTop ? 20 : 12;
    chartContext.fill();
    chartContext.shadowBlur = 0;

    chartContext.textAlign = "right";
    chartContext.fillStyle = isTop ? "#92f1cf" : "#dbe4ff";
    chartContext.font = isTop ? "700 13px Segoe UI" : "600 13px Segoe UI";
    chartContext.fillText(`${(probability * 100).toFixed(2)}%`, width - 12, top + rowHeight / 2 + 5);
  });
}

function clearResults(message, heading) {
  resultsBody.innerHTML = "";
  bestProgramme.textContent = heading;
  profileNote.textContent = message;
  lastChartData = null;

  const { width, height } = resizeChartCanvas();
  chartContext.clearRect(0, 0, width, height);
}

function runModel(modeOverride) {
  const mode = modeOverride || currentMode();
  const userName = userNameInput.value;

  let ratings;
  let weights;
  let profileLabel;

  if (mode === "aiman") {
    ratings = aimanRatings.map((row) => [...row]);
    weights = [...aimanWeights];
    profileLabel = "Aiman Default Profile";
  } else {
    ratings = readCustomRatings();
    weights = readCustomWeights();
    profileLabel = "Custom Profile";
  }

  const utilities = calculateUtilities(ratings, weights);
  const probabilities = calculateProbabilities(utilities);
  renderResults(utilities, probabilities, profileLabel, userName);
}

function syncModeState() {
  setModePage(currentMode());
}

buildAimanProfile();
buildCustomWeights();
buildCustomProgramCards();
resetCustomInputs();
syncModeState();
runModel("aiman");

modeInputs.forEach((input) => {
  input.addEventListener("change", syncModeState);
});

document.getElementById("runAimanButton").addEventListener("click", () => {
  runModel("aiman");
});

document.getElementById("runCustomButton").addEventListener("click", () => {
  runModel("custom");
});

document.getElementById("copyAimanButton").addEventListener("click", () => {
  setCustomRatings(aimanRatings);
  setCustomWeights(aimanWeights);
  bestProgramme.textContent = "Aiman values copied";
  profileNote.textContent = "The custom page now uses Aiman's scores and matching factor importance.";
});

document.getElementById("resetCustomButton").addEventListener("click", () => {
  resetCustomInputs();
  clearResults("Custom inputs were reset to a neutral 3 out of 5 baseline.", "Custom inputs reset");
});

window.addEventListener("resize", () => {
  if (lastChartData) {
    drawChart(lastChartData);
  } else {
    resizeChartCanvas();
  }
});
