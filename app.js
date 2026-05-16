const todayEl = document.getElementById("today");
const clockEl = document.getElementById("clock");

function updateClock() {
  const now = new Date();

  todayEl.textContent = now.toLocaleDateString("ar-SA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  clockEl.textContent = now.toLocaleTimeString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

setInterval(updateClock, 1000);
updateClock();

document.querySelectorAll("[data-target]").forEach(el => {
  const target = Number(el.dataset.target);
  let current = 0;
  const step = Math.ceil(target / 60);

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString("ar-SA");
  }, 18);
});

const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");

function openTab(tabName) {
  tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.tab === tabName));
  views.forEach(view => view.classList.toggle("active", view.id === tabName));

  setTimeout(() => {
    drawAllCharts();
  }, 80);
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => openTab(tab.dataset.tab));
});

document.querySelectorAll("[data-tab-jump]").forEach(card => {
  card.addEventListener("click", () => openTab(card.dataset.tabJump));
});

const pendingBookings = [
  {
    id: "SP-1048",
    name: "أحمد العلي",
    trip: "دبي - 4 ليالي",
    amount: "3,250 ريال",
    reason: "بانتظار الدفع",
    type: "pay",
    phone: "05XXXXXXXX"
  },
  {
    id: "SP-1051",
    name: "نورة حسن",
    trip: "تركيا - 7 أيام",
    amount: "5,900 ريال",
    reason: "نقص مستندات",
    type: "docs",
    phone: "05XXXXXXXX"
  },
  {
    id: "SP-1053",
    name: "فاطمة عبدالله",
    trip: "المالديف - شهر عسل",
    amount: "12,400 ريال",
    reason: "لم يتم الرد",
    type: "call",
    phone: "05XXXXXXXX"
  },
  {
    id: "SP-1060",
    name: "حسين محمد",
    trip: "لندن - 5 أيام",
    amount: "8,700 ريال",
    reason: "بانتظار الدفع",
    type: "pay",
    phone: "05XXXXXXXX"
  }
];

const pendingContainer = document.getElementById("pendingBookings");

pendingContainer.innerHTML = pendingBookings.map(item => `
  <article class="booking-card">
    <header>
      <h4>${item.id}</h4>
      <span class="badge ${item.type}">${item.reason}</span>
    </header>

    <div class="booking-meta">
      <strong>${item.name}</strong><br />
      ${item.trip}<br />
      ${item.amount}
    </div>

    <div class="booking-actions">
      <button class="whatsapp">تواصل واتساب</button>
      <button class="details">عرض التفاصيل</button>
    </div>
  </article>
`).join("");

function drawLineChart(canvasId, data, label) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const padding = 34;
  const max = Math.max(...data);
  const min = Math.min(...data);

  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(255,255,255,.08)";
  ctx.lineWidth = 1;

  for (let i = 0; i < 5; i++) {
    const y = padding + (i * (h - padding * 2)) / 4;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();
  }

  const points = data.map((value, index) => {
    const x = padding + (index * (w - padding * 2)) / (data.length - 1);
    const y = h - padding - ((value - min) / (max - min)) * (h - padding * 2);
    return { x, y, value };
  });

  const gradient = ctx.createLinearGradient(0, 0, w, 0);
  gradient.addColorStop(0, "#38efb0");
  gradient.addColorStop(1, "#00d4ff");

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 4;
  ctx.beginPath();

  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });

  ctx.stroke();

  points.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "rgba(255,255,255,.7)";
  ctx.font = "14px Tahoma";
  ctx.fillText(label, padding, 22);
}

function drawAllCharts() {
  drawLineChart("trendChart", [18, 25, 22, 31, 28, 44, 38, 49, 41, 60, 55, 72, 68, 86], " ");
  drawLineChart("salesChart", [12000, 18000, 15000, 22000, 26000, 24000, 31000, 28000, 37000, 42000, 39000, 45230], " ");
}

window.addEventListener("resize", drawAllCharts);
drawAllCharts();

const activities = [
  "تم استلام دفعة عبر تابي",
  "حجز جديد لرحلة دبي",
  "عميل يحتاج تواصل لاستكمال الدفع",
  "تمت الموافقة على مستندات رحلة تركيا",
  "تقييم جديد 5 نجوم",
  "حجز ملغي لرحلة لندن"
];

const activityText = document.getElementById("activityText");
let activityIndex = 0;

setInterval(() => {
  activityIndex = (activityIndex + 1) % activities.length;
  activityText.textContent = activities[activityIndex];
}, 2500);