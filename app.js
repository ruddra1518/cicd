function $(selector){return document.querySelector(selector)}
const searchForm = $('#searchForm')
const flightsList = $('#flightsList')
const resultsSection = $('#results')
const bookingsList = $('#bookingsList')

function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}

function generateFlights({from,to,depart,passengers,travelClass}){
  const basePrices={Economy:80, 'Premium Economy':150, Business:420, First:980}
  const flights=[]
  for(let i=0;i<4;i++){
    const hour=randomInt(6,22)
    const minute=randomInt(0,1)===0?0:30
    const departTime=`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`
    const duration = randomInt(1,12)
    const arriveHour=(hour+duration)%24
    const arriveTime=`${String(arriveHour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`
    const flightNum = `EB${randomInt(100,999)}`
    const price = Math.round((basePrices[travelClass]||100) * (1 + Math.random()*0.6) * passengers)
    flights.push({flightNum, departTime, arriveTime, duration, price, from, to, depart})
  }
  return flights
}

function saveBooking(booking){
  const key='easybook_bookings'
  const arr = JSON.parse(localStorage.getItem(key) || '[]')
  arr.unshift(booking)
  localStorage.setItem(key, JSON.stringify(arr))
}

function loadBookings(){
  const arr = JSON.parse(localStorage.getItem('easybook_bookings') || '[]')
  renderBookings(arr)
}

function renderBookings(arr){
  if(!arr.length){bookingsList.textContent='No bookings yet.';return}
  bookingsList.innerHTML=''
  arr.forEach(b=>{
    const el = document.createElement('div')
    el.className='booking'
    el.innerHTML = `
      <div><strong>${b.flightNum}</strong> — ${b.from} → ${b.to}</div>
      <div class="flight-meta">${b.depart} • ${b.departTime} • ${b.passengers} pax • ${b.travelClass}</div>
      <div class="price">$${b.price}</div>`
    bookingsList.appendChild(el)
  })
}

function renderFlights(flights){
  flightsList.innerHTML=''
  flights.forEach(f=>{
    const el = document.createElement('div')
    el.className='flight'
    el.innerHTML = `
      <div class="flight-info">
        <div>
          <div><strong>${f.flightNum}</strong></div>
          <div class="flight-meta">${f.from} → ${f.to} • ${f.duration}h</div>
        </div>
        <div class="flight-meta">${f.depart} • ${f.departTime} → ${f.arriveTime}</div>
      </div>
      <div style="text-align:right">
        <div class="price">$${f.price}</div>
        <button class="btn" data-flight='${JSON.stringify(f).replace(/'/g,'&#39;')}'>Book</button>
      </div>`
    const btn = el.querySelector('button')
    btn.addEventListener('click',()=>{
      const booking = JSON.parse(btn.getAttribute('data-flight'))
      const confirmed = confirm(`Book ${booking.flightNum} for $${booking.price}?`)
      if(!confirmed) return
      saveBooking(booking)
      loadBookings()
      alert('Booking confirmed — saved to localStorage (demo).')
    })
    flightsList.appendChild(el)
  })
}

searchForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  const from = $('#from').value.trim()
  const to = $('#to').value.trim()
  const depart = $('#depart').value
  const ret = $('#return').value
  const passengers = Number($('#passengers').value) || 1
  const travelClass = $('#travelClass').value
  if(!from || !to || !depart){alert('Please fill From, To and Depart date');return}
  const flights = generateFlights({from,to,depart,passengers,travelClass})
  renderFlights(flights)
  resultsSection.classList.remove('hide')
  resultsSection.scrollIntoView({behavior:'smooth'})
})

// init
document.addEventListener('DOMContentLoaded', ()=>{
  loadBookings()
})
