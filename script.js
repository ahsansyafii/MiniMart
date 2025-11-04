// Chart data
const salesData = {
  Jan: 120000,
  Feb: 100000,
  Mar: 80000,
  Apr: 95000,
  May: 70000,
  Jun: 85000,
  Jul: 130000,
}

const distributionData = {
  Snack: 40,
  Minuman: 30,
  Makanan: 20,
  Lainnya: 10,
}

// Store animated values for pie chart
let animatedPercentages = {}
let animationFrameId = null

// Initialize charts when page loads
document.addEventListener("DOMContentLoaded", () => {
  drawSalesChart()
  drawPieChart()
})

// Draw bar chart for sales trend
function drawSalesChart() {
  const canvas = document.getElementById("salesChart")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  const months = Object.keys(salesData)
  const values = Object.values(salesData)

  canvas.width = Math.min(canvas.parentElement.offsetWidth - 20, 800)
  canvas.height = 300

  const padding = 60
  const chartWidth = canvas.width - padding * 2
  const chartHeight = canvas.height - padding * 2

  const maxValue = Math.max(...values)
  const barWidth = chartWidth / (months.length * 1.5)
  const barSpacing = chartWidth / months.length

  // Draw axes
  ctx.strokeStyle = "#ddd"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, canvas.height - padding)
  ctx.lineTo(canvas.width - padding, canvas.height - padding)
  ctx.stroke()

  // Draw Y-axis labels
  ctx.fillStyle = "#999"
  ctx.font = "12px sans-serif"
  ctx.textAlign = "right"
  for (let i = 0; i <= 5; i++) {
    const y = canvas.height - padding - (chartHeight / 5) * i
    const value = (maxValue / 5) * i
    ctx.fillText(value.toString(), padding - 10, y + 4)
  }

  // Draw bars
  ctx.fillStyle = "#C9A961"
  months.forEach((month, index) => {
    const value = values[index]
    const barHeight = (value / maxValue) * chartHeight
    const x = padding + index * barSpacing + barSpacing / 2 - barWidth / 2
    const y = canvas.height - padding - barHeight

    ctx.fillRect(x, y, barWidth, barHeight)
  })

  // Draw X-axis labels
  ctx.fillStyle = "#333"
  ctx.textAlign = "center"
  months.forEach((month, index) => {
    const x = padding + index * barSpacing + barSpacing / 2
    ctx.fillText(month, x, canvas.height - padding + 20)
  })
}

// Draw pie chart for distribution
function drawPieChart() {
  const canvas = document.getElementById("pieChart")
  if (!canvas) return

  const ctx = canvas.getContext("2d")

  canvas.width = Math.min(canvas.parentElement.offsetWidth - 20, 800)
  canvas.height = 400

  const categories = Object.keys(distributionData)
  const percentages = Object.values(distributionData)
  const colors = ["#C9A961", "#D4B896", "#A0826D", "#8B6F47"]

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 100

  // Initialize animated values if not already done
  categories.forEach((category) => {
    if (!(category in animatedPercentages)) {
      animatedPercentages[category] = 0
    }
  })

  let currentAngle = -Math.PI / 2
  let isAnimating = false

  categories.forEach((category, index) => {
    const targetPercentage = percentages[index]
    const currentValue = animatedPercentages[category]

    // Animate the percentage with easing
    if (currentValue < targetPercentage) {
      animatedPercentages[category] += (targetPercentage - currentValue) * 0.08
      isAnimating = true
    } else {
      animatedPercentages[category] = targetPercentage
    }

    const displayPercentage = Math.round(animatedPercentages[category])
    const sliceAngle = (animatedPercentages[category] / 100) * Math.PI * 2

    // Draw slice
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.closePath()
    ctx.fillStyle = colors[index]
    ctx.fill()

    // Draw border
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2.5
    ctx.stroke()

    // Draw labels with animated percentages
    const labelAngle = currentAngle + sliceAngle / 2
    const labelX = centerX + Math.cos(labelAngle) * (radius + 35)
    const labelY = centerY + Math.sin(labelAngle) * (radius + 35)

    ctx.fillStyle = "#C9A961"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${category}: ${displayPercentage}%`, labelX, labelY)

    currentAngle += sliceAngle
  })

  if (isAnimating) {
    animationFrameId = requestAnimationFrame(drawPieChart)
  }
}

// Navigation functions
function goToPage(pageName) {
  // Hide all pages
  const pages = document.querySelectorAll(".page")
  pages.forEach((page) => page.classList.remove("active"))

  // Show selected page
  const selectedPage = document.getElementById(`${pageName}-page`)
  if (selectedPage) {
    selectedPage.classList.add("active")

    // Redraw charts if needed
    if (pageName === "home") {
      setTimeout(() => drawSalesChart(), 100)
    } else if (pageName === "laporan") {
      animatedPercentages = {}
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      setTimeout(() => drawPieChart(), 100)
    }
  }
}

function showLogoutModal() {
  document.getElementById("logoutModal").style.display = "flex"
}

function closeLogoutModal() {
  document.getElementById("logoutModal").style.display = "none"
}

function confirmLogout() {
  alert("Anda telah keluar dari sistem")
  closeLogoutModal()
}

function exportToExcel() {
  alert("Mengekspor ke Excel...")
}

function exportToPDF() {
  alert("Mengekspor ke PDF...")
}

function exportToWord() {
  alert("Mengekspor ke Word...")
}

function confirmLogout() {
  const modal = document.getElementById("logoutModal")
  modal.style.display = "flex"
  modal.style.animation = "fadeIn 0.3s ease-out"
}

function cancelLogout() {
  const modal = document.getElementById("logoutModal")
  modal.style.display = "none"
}

function proceedLogout() {
  window.location.href = "index.html"
}

// Close modal when clicking outside of it
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("logoutModal")
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none"
      }
    })
  }
})
