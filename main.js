document.addEventListener("DOMContentLoaded", () => {
  if (typeof Chart === "undefined") {
    console.error("Chart.js is not loaded. تأكد من اتصال الإنترنت أو حمّل chart.js محليًا.");
    document.querySelectorAll(".chart-wrap, .donut-wrap, .pay-chart-wrap").forEach((box) => {
      box.innerHTML = '<div style="display:grid;place-items:center;height:100%;color:#64748b;font-weight:800">Chart.js غير محمّل</div>';
    });
    return;
  }

  Chart.defaults.font.family = "Tahoma";
  Chart.defaults.color = "#64748b";
  Chart.defaults.plugins.tooltip.cornerRadius = 12;
  Chart.defaults.plugins.tooltip.padding = 14;
  Chart.defaults.plugins.tooltip.backgroundColor = "#ffffff";
  Chart.defaults.plugins.tooltip.titleColor = "#172033";
  Chart.defaults.plugins.tooltip.bodyColor = "#172033";
  Chart.defaults.plugins.tooltip.borderColor = "#e8edf5";
  Chart.defaults.plugins.tooltip.borderWidth = 1;

  const nf = new Intl.NumberFormat("ar-SA");

  let state = {
    customers: 5430,
    bookings: 1248,
    pending: 14,
    cancelled: 32,
    revenue: 1026540,
    completed: 1102,
    newBookings: 28,
    rating: 4.6,
    avgBooking: 2850,
    completeRate: 76.8,
    responseTime: 18,
    newCustomers: 236,
    notify: 5
  };

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateLastTime() {
    const now = new Date();
    setText("lastUpdate", "آخر تحديث: " + now.toLocaleTimeString("ar-SA"));
  }

  function animateNumber(id, start, end, suffix = "") {
    const el = document.getElementById(id);
    if (!el) return;

    const duration = 650;
    const startTime = performance.now();

    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(start + (end - start) * eased);
      el.textContent = nf.format(value) + suffix;

      if (p < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function percentage(value, total) {
    return total ? ((value / total) * 100).toFixed(1) + "%" : "0%";
  }

  function drawSpark(canvas, color) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const data = Array.from({ length: 10 }, () => random(12, 28));
    const w = rect.width;
    const h = rect.height;
    const max = Math.max(...data);
    const min = Math.min(...data);

    const points = data.map((v, i) => ({
      x: (i / (data.length - 1)) * w,
      y: h - ((v - min) / (max - min || 1)) * (h - 8) - 4
    }));

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.beginPath();

    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.stroke();
  }

  function redrawSparks() {
    document.querySelectorAll(".spark").forEach((canvas) => {
      drawSpark(canvas, canvas.dataset.color || "#2563eb");
    });
  }

  function createGradient(ctx, color) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    return gradient;
  }

  const mainCanvas = document.getElementById("mainChart");
  const mainCtx = mainCanvas.getContext("2d");

  const blueFill = createGradient(mainCtx, "rgba(33,118,255,.20)");
  const greenFill = createGradient(mainCtx, "rgba(22,199,132,.20)");

  const mainChart = new Chart(mainCanvas, {
    type: "line",
    data: {
      labels: ["مايو 01", "مايو 03", "مايو 05", "مايو 07", "مايو 09", "مايو 11", "مايو 13", "الآن"],
      datasets: [
        {
          label: "عدد الحجوزات",
          data: [52000, 63000, 54000, 82000, 106000, 79000, 80000, 107000],
          borderColor: "#2176ff",
          backgroundColor: blueFill,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#2176ff",
          pointBorderWidth: 3,
          pointRadius: 4,
          tension: .42,
          fill: true,
          yAxisID: "y"
        },
        {
          label: "الإيرادات (ريال)",
          data: [22000, 31000, 19000, 42000, 57000, 41000, 38000, 65000],
          borderColor: "#16c784",
          backgroundColor: greenFill,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#16c784",
          pointBorderWidth: 3,
          pointRadius: 4,
          tension: .42,
          fill: true,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "center",
          labels: {
            usePointStyle: true,
            pointStyle: "line",
            boxWidth: 30,
            padding: 22
          }
        },
        tooltip: {
          rtl: true,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${nf.format(ctx.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#475569" }
        },
        y: {
          position: "left",
          grid: { color: "#e9f0f8" },
          ticks: {
            color: "#2176ff",
            callback: (v) => `${v / 1000}K`
          }
        },
        y1: {
          position: "right",
          grid: { display: false },
          ticks: {
            color: "#16c784",
            callback: (v) => `${v / 1000}K`
          }
        }
      }
    }
  });

  const statusChart = new Chart(document.getElementById("statusChart"), {
    type: "doughnut",
    data: {
      labels: ["مكتملة", "متوقفة", "ملغية", "جديدة"],
      datasets: [{
        data: [state.completed, state.pending, state.cancelled, state.newBookings],
        backgroundColor: ["#16c784", "#ff8a00", "#ff4667", "#2176ff"],
        borderColor: "#fff",
        borderWidth: 4,
        hoverOffset: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      animation: { duration: 700, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          rtl: true,
          callbacks: {
            label: (ctx) => `${ctx.label}: ${nf.format(ctx.parsed)}`
          }
        }
      }
    }
  });

  const payChart = new Chart(document.getElementById("payChart"), {
    type: "doughnut",
    data: {
      labels: ["تابي", "تمارا", "مدى", "تحويل بنكي"],
      datasets: [{
        data: [40, 25, 22, 13],
        backgroundColor: ["#18bfd1", "#8057ff", "#16c784", "#ff9f0a"],
        borderColor: "#fff",
        borderWidth: 4,
        hoverOffset: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "64%",
      animation: { duration: 700, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          rtl: true,
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  });

  const branchChart = new Chart(document.getElementById("branchChart"), {
    type: "bar",
    data: {
      labels: ["الرياض", "جدة", "الدمام", "أبها"],
      datasets: [{
        label: "الإيرادات (ريال)",
        data: [120000, 95000, 80000, 45000],
        borderRadius: 10,
        maxBarThickness: 55,
        backgroundColor: ["#2176ff", "#16c784", "#8057ff", "#ff8a00"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "rectRounded"
          }
        },
        tooltip: {
          rtl: true,
          callbacks: {
            label: (ctx) => nf.format(ctx.parsed.y) + " ريال"
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#334155",
            font: { weight: "bold" }
          }
        },
        y: {
          beginAtZero: true,
          grid: { color: "#e9f0f8" },
          ticks: {
            callback: (v) => `${v / 1000}K`
          }
        }
      }
    }
  });

  function updateStatusLegend() {
    const total = state.completed + state.pending + state.cancelled + state.newBookings;
    setText("statusTotal", nf.format(total));
    setText("completedLabel", `${nf.format(state.completed)} (${percentage(state.completed, total)})`);
    setText("pendingLabel", `${nf.format(state.pending)} (${percentage(state.pending, total)})`);
    setText("cancelledLabel", `${nf.format(state.cancelled)} (${percentage(state.cancelled, total)})`);
    setText("newLabel", `${nf.format(state.newBookings)} (${percentage(state.newBookings, total)})`);
  }

  function updateKpis() {
    const old = { ...state };

    state.customers += random(0, 4);
    state.bookings += random(0, 3);
    state.pending = Math.max(8, state.pending + random(-1, 1));
    state.cancelled = Math.max(20, state.cancelled + random(0, 1));
    state.revenue += random(1200, 8500);
    state.completed += random(0, 4);
    state.newBookings += random(0, 2);
    state.avgBooking += random(-20, 35);
    state.completeRate = Math.min(89, Math.max(70, state.completeRate + (Math.random() > .5 ? .1 : -.1)));
    state.responseTime = Math.max(9, state.responseTime + random(-1, 1));
    state.newCustomers += random(0, 2);
    state.notify = random(3, 9);

    animateNumber("customersCount", old.customers, state.customers);
    animateNumber("bookingsCount", old.bookings, state.bookings);
    animateNumber("pendingCount", old.pending, state.pending);
    animateNumber("cancelledCount", old.cancelled, state.cancelled);
    animateNumber("revenueCount", old.revenue, state.revenue);

    setText("avgBooking", nf.format(state.avgBooking) + " ريال");
    setText("completeRate", state.completeRate.toFixed(1) + "%");
    setText("responseTime", nf.format(state.responseTime) + " دقيقة");
    setText("newCustomers", nf.format(state.newCustomers));
    setText("notifyCount", state.notify);

    statusChart.data.datasets[0].data = [
      state.completed,
      state.pending,
      state.cancelled,
      state.newBookings
    ];
    statusChart.update();

    updateStatusLegend();
    redrawSparks();
    updateLastTime();
  }

  function updateMainChart() {
    const bookingData = mainChart.data.datasets[0].data;
    const revenueData = mainChart.data.datasets[1].data;

    bookingData.shift();
    bookingData.push(random(76000, 124000));

    revenueData.shift();
    revenueData.push(random(55000, 112000));

    mainChart.update();
  }

  function updateBranchChart() {
    branchChart.data.datasets[0].data = branchChart.data.datasets[0].data.map((v) => {
      return Math.max(25000, v + random(-8000, 12000));
    });

    branchChart.update();
  }

  function updatePaymentChart() {
    const values = [
      random(34, 44),
      random(20, 30),
      random(18, 27),
      random(9, 16)
    ];

    const total = values.reduce((a, b) => a + b, 0);
    const normalized = values.map((v) => Math.round((v / total) * 100));

    const diff = 100 - normalized.reduce((a, b) => a + b, 0);
    normalized[0] += diff;

    payChart.data.datasets[0].data = normalized;
    payChart.update();

    setText("pay1", normalized[0] + "%");
    setText("pay2", normalized[1] + "%");
    setText("pay3", normalized[2] + "%");
    setText("pay4", normalized[3] + "%");
  }

  const activities = [
    ["green-bg", "✓", "تم استلام دفعة جديدة عبر تابي"],
    ["blue-bg", "✈", "حجز جديد لرحلة دبي"],
    ["orange-bg", "!", "عميل يحتاج تواصل لاستكمال الدفع"],
    ["green-bg", "✓", "تمت الموافقة على مستندات عميل"],
    ["purple-bg", "★", "تقييم جديد 5 نجوم"],
    ["blue-bg", "↗", "ارتفاع مفاجئ في طلبات فرع الدمام"],
    ["orange-bg", "!", "حجز متوقف بانتظار التحويل البنكي"]
  ];

  let activityIndex = 0;

  function addLiveActivity() {
    const list = document.getElementById("activityList");
    if (!list) return;

    const item = activities[activityIndex];
    const li = document.createElement("li");

    li.innerHTML = `
      <i class="${item[0]}">${item[1]}</i>
      <span>${item[2]}</span>
      <em>الآن</em>
    `;

    list.prepend(li);

    while (list.children.length > 5) {
      list.removeChild(list.lastChild);
    }

    activityIndex = (activityIndex + 1) % activities.length;
  }

  updateLastTime();
  updateStatusLegend();
  redrawSparks();

  setInterval(() => {
    updateKpis();
    updateMainChart();
    updateBranchChart();
    updatePaymentChart();
    addLiveActivity();
  }, 4000);

  window.addEventListener("resize", redrawSparks);
});