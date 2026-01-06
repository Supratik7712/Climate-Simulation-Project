let year = 1;
let temperature = 1.0;
let emissions = 100;
let health = 70;
let score = 0;
let healthTracker = [70];

let years = [1];
let temperatureData = [temperature];
let emissionsData = [emissions];

const renewable = document.getElementById("renewable");
const trees = document.getElementById("trees");
const recycle = document.getElementById("recycle");

const renewableValue = document.getElementById("renewableValue");
const treeValue = document.getElementById("treeValue");
const recycleValue = document.getElementById("recycleValue");

renewable.oninput = () => renewableValue.innerText = renewable.value;
trees.oninput = () => treeValue.innerText = trees.value;
recycle.oninput = () => recycleValue.innerText = recycle.value;

const temperatureCtx = document.getElementById("climateChart");
const emissionsCtx = document.getElementById("emissionsChart");

const temperatureChart = new Chart(temperatureCtx, {
  type: "line",
  data: {
    labels: years,
    datasets: [{
      label: "Global Temperature (°C)",
      data: temperatureData,
      borderColor: "#e74c3c",
      backgroundColor: "rgba(231, 76, 60, 0.1)",
      borderWidth: 3,
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: {
        min: 0,
        max: 3,
        title: { display: true, text: "Temperature (°C)" }
      }
    }
  }
});

const emissionsChart = new Chart(emissionsCtx, {
  type: "bar",
  data: {
    labels: years,
    datasets: [{
      label: "CO₂ Emissions Level",
      data: emissionsData,
      backgroundColor: "#f39c12",
      borderColor: "#e67e22",
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: {
        min: 0,
        max: 200,
        title: { display: true, text: "Emissions" }
      }
    }
  }
});

// Badge system
const badges = [
  { id: 'green-pioneer', name: 'Green Pioneer', condition: () => emissions < 50 },
  { id: 'earth-guardian', name: 'Earth Guardian', condition: () => health > 80 && healthTracker.slice(-3).every(h => h > 80) },
  { id: 'climate-master', name: 'Climate Master', condition: () => temperature < 1.5 },
  { id: 'energy-expert', name: 'Energy Expert', condition: () => renewable.value === '100' }
];

let unlockedBadges = new Set();

function updateBadges() {
  badges.forEach((badge, index) => {
    if (badge.condition() && !unlockedBadges.has(badge.id)) {
      unlockedBadges.add(badge.id);
      const badgeElements = document.querySelectorAll('.badge');
      if (badgeElements[index]) {
        badgeElements[index].classList.remove('locked');
        badgeElements[index].classList.add('unlocked');
      }
      score += 50;
    }
  });
}

function calculateScore() {
  let baseScore = health * 2;
  let emissionsPenalty = (100 - emissions) * 1.5;
  let tempPenalty = Math.max(0, 50 - (temperature * 10));
  return Math.max(0, Math.round(baseScore + emissionsPenalty + tempPenalty));
}

document.getElementById("nextYear").onclick = () => {
  year++;

  const renewableImpact = renewable.value / 100;
  const treeImpact = trees.value / 100;
  const recycleImpact = recycle.value / 100;

  emissions += 10 - (renewableImpact * 15) - (recycleImpact * 10);
  emissions = Math.max(emissions, 50);

  temperature += emissions * 0.0005;
  temperature -= treeImpact * 0.2;

  health += (treeImpact * 10 + recycleImpact * 5) - (temperature * 0.5);
  health = Math.max(0, Math.min(100, health));

  score = calculateScore();
  
  years.push(year);
  temperatureData.push(Number(temperature.toFixed(2)));
  emissionsData.push(Math.round(emissions));
  healthTracker.push(health);

  temperatureChart.update();
  emissionsChart.update();

  updateUI();
  updateBadges();
  showWarnings();
};

document.getElementById("reset").onclick = () => {
  location.reload();
};

function updateUI() {
  document.getElementById("year").innerText = year;
  document.getElementById("temperature").innerText = temperature.toFixed(2);
  document.getElementById("emissions").innerText = emissions.toFixed(0);
  document.getElementById("health").innerText = health.toFixed(0);
  document.getElementById("score").innerText = score;
}

function showWarnings() {
  if (temperature > 2) {
    alert("⚠️ Warning: Global temperature has crossed safe limits!");
  }
  if (health < 30) {
    alert("🌍 Environment health is critical. Improve sustainability!");
  }
}
