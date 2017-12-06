<template>
  <div :style='{width:width}' class="datetime-picker"  v-on:click='calendarClicked($event)' >
    <div>
      <input type='text' id='tj-datetime-input' :value="value" v-model='date' :name='name' v-on:click='toggleCal' autocomplete='off'  />
      <div class='calender-div' :class='{noDisplay: hideCal}'>
        <div :class='{noDisplay: hideDate}'>
          <div class='year-month-wrapper'>
            <div class='month-setter'>
              <button type='button' class='nav-l' v-on:click='leftYear'>&#x3C;</button>
              <span class='year'>{{year}}</span>
              <button type='button' class='nav-r' v-on:click='rightYear' >&#x3E;</button>
            </div>
            <div class='month-setter'>
              <button type='button' class='nav-l' v-on:click='leftMonth'>&#x3C;</button>
              <span class='month'>{{month}}</span>
              <button type='button' class='nav-r' v-on:click='rightMonth' v-on:mousedown=''>&#x3E;</button>
            </div>
          </div>
          <div class='headers'>
            <span class='days' v-for="(port, index) in days">{{port}}</span>
          </div>
          <div>
            <span  class="port" v-for="(port, index) in ports" :class='{activePort: index === activePort}' v-on:click='setDay(index, port)'>{{port}}</span>
          </div>
        </div>
        <div class='time-picker' :class='{noDisplay: hideTime}'>
          <div class='hour-selector' >
            <div v-on:click='showHourSelector' id='j-hour'>{{hour}}</div>
            <div class='scroll-hider' ref='hourScrollerWrapper' :class='{showSelector: hourSelectorVisible}'>
              <ul ref='hourScroller'>
                <li v-for="(h, index) in hours" :class='{active: index == hourIndex}' v-on:click='setHour(index, true)' >{{h}}</li>
              </ul>
            </div>
          </div>
          <div class='time-separator'>
            <span>:</span>
          </div>
          <div class='minute-selector' >
            <div v-on:click='showMinuteSelector' id='j-minute'>{{minute}}</div>
            <div class='scroll-hider' ref='minuteScrollerWrapper' :class='{showSelector: minuteSelectorVisible}'>
              <ul ref='minuteScroller'>
                <li v-for="(m, index) in minutes" :class='{active: index == minuteIndex}' v-on:click='setMinute(index, true)'>{{m}}</li>
              </ul>
            </div>
          </div>
          <div class='time-separator'>
            <span>:</span>
          </div>
          <div class='minute-selector' >
            <div v-on:click='changePeriod'>{{period}}</div>
          </div>
        </div>
        <button type='button' v-on:click='setDate' class='okButton'>OK</button>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: ['format', 'name', 'width', 'value'],
  data () {
    return {
	  date: this.value,
      hideCal: true,
      activePort: null,
      timeStamp: new Date(),
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthIndex: 0,
      hourIndex: 0,
      minuteIndex: 0,
      year: 2017,
      portsHolder: [],
      minute: '00',
      hour: '01',
      day: 1,
      minuteSelectorVisible: false,
      hourSelectorVisible: false,
      period: 'AM'
    }
  },
  methods: {
	leftMonth () {
      let index = this.months.indexOf(this.month)
      if (index === 0) {
        this.monthIndex = 11
      } else {
        this.monthIndex = index - 1
      }
      this.updateCalendar()
    },
    rightMonth () {
      let index = this.months.indexOf(this.month)
      if (index === 11) {
        this.monthIndex = 0
      } else {
        this.monthIndex = index + 1
      }
      this.updateCalendar()
    },
    rightYear () {
      this.year++
      this.updateCalendar()
    },
    leftYear () {
      this.year--
      this.updateCalendar()
    },
    updateCalendar () {
      let me = this
      let date = new Date(me.year, me.monthIndex, 1, 0, 0, 0)
      let day = date.getDay()
      let daysInMonth = new Date(me.year, me.monthIndex + 1, 0).getDate()
      let ports = []
      let portsLenght = 35
      if (day === 6 || (day === 5 && daysInMonth === 31)) {
        portsLenght = 42
      }
      let activeFound = false
      for (let i = 0; i < portsLenght; i++) {
        let j = i - day
        let curr = (j < 0 || j >= daysInMonth) ? '' : j + 1
        ports.push(curr)
        if (curr === me.day && this.timeStamp.getMonth() === me.monthIndex && this.timeStamp.getFullYear() === me.year) {
          me.activePort = i
          activeFound = true
        }
      }
      if (!activeFound) {
        me.activePort = -1
      }
      this.ports = ports
    },
    setDay (index, port) {
      if (port !== '') {
        this.activePort = index
        this.day = port
        this.timeStamp = new Date(this.year, this.monthIndex, this.day)
      }
    },
    setMinute (index, closeAfterSet) {
      this.minuteIndex = index
      this.minute = this.minutes[index]
      if (closeAfterSet) {
        this.minuteSelectorVisible = false
      }
    },
    setHour (index, closeAfterSet) {
      this.hourIndex = index
      this.hour = this.hours[index]
      if (closeAfterSet) {
        this.hourSelectorVisible = false
      }
    },
    showHourSelector () {
      this.hourSelectorVisible = true
      this.minuteSelectorVisible = false
    },
    showMinuteSelector () {
      this.minuteSelectorVisible = true
      this.hourSelectorVisible = false
    },
    keyIsDown (event) {
      let key = event.which || event.keycode
      if (key === 38) {
        if (this.minuteSelectorVisible && this.minuteIndex > 0) {
          this.setMinute(this.minuteIndex - 1, false)
          this.scrollTopMinute()
        } else if (this.hourSelectorVisible && this.hourIndex > 0) {
          this.setHour(this.hourIndex - 1, false)
          this.scrollTopHour()
        }
      } else if (key === 40) {
        if (this.minuteSelectorVisible && this.minuteIndex < this.minutes.length - 1) {
          this.setMinute(this.minuteIndex + 1, false)
          this.scrollTopMinute()
        } else if (this.hourSelectorVisible && this.hourIndex < this.hours.length - 1) {
          this.setHour(this.hourIndex + 1, false)
          this.scrollTopHour()
        }
      } else if (key === 13) {
        this.minuteSelectorVisible = false
        this.hourSelectorVisible = false
      }
	  if (this.minuteSelectorVisible || this.hourSelectorVisible) {
		event.preventDefault()
		this.minuteSelectorVisible = false
        this.hourSelectorVisible = false
	  }
    },
    scrollTopMinute () {
      let mHeight = this.$refs.minuteScroller.scrollHeight
      let wHeight = this.$refs.minuteScrollerWrapper.clientHeight
      let top = mHeight * (this.minuteIndex / (this.minutes.length - 1)) - (wHeight / 2)
      this.$refs.minuteScroller.scrollTop = top
    },
    scrollTopHour () {
      let mHeight = this.$refs.hourScroller.scrollHeight
      let wHeight = this.$refs.hourScrollerWrapper.clientHeight
      let top = mHeight * (this.hourIndex / (this.hours.length - 1)) - (wHeight / 2)
      this.$refs.hourScroller.scrollTop = top
    },
    changePeriod () {
      this.period = this.period === 'AM' ? 'PM' : 'AM'
    },
    calendarClicked (event) {
      if (event.target.id !== 'j-hour' && event.target.id !== 'j-minute') {
        this.minuteSelectorVisible = false
        this.hourSelectorVisible = false
      }
      event.cancelBubble = true
      if (event.stopPropagation) {
        event.stopPropagation()
      }
    },
    documentClicked (event) {
      if (event.target.id !== 'tj-datetime-input') {
        this.hideCal = true
      }
    },
    toggleCal () {
      this.hideCal = !this.hideCal
    },
    setDate () {
      let d = null
      if (!this.dateFormat) {
        console.error('Invalid date format supplied')
      } else {
        let h = this.hour + ''
        if (h === '12') {
          if (this.period === 'AM') {
            h = '00'
          } else {
            h = '12'
          }
        } else if (this.period === 'PM') {
          h = parseInt(h) + 12
		  h = '' + h
        }
        d = this.dateFormat
        d = d.replace('YYYY', this.year)
        d = d.replace('DD', this.day < 10 ? '0' + this.day : this.day)
        let m = this.monthIndex + 1
        d = d.replace('MM', m < 10 ? '0' + m : m)
		this.minute += ''
        d = d.replace('h', h.length < 2 ? '0' + h : '' + h )
        d = d.replace('i', this.minute.length < 2 ? '0' + this.minute : '' + this.minute)
        d = d.replace('s', '00')
        this.$emit('input', d)
        this.date = d
        this.hideCal = true
      }
    }
  },
  created () {
	this.date = this.value
	if (this.date) {
		try {
			this.timeStamp = new Date(this.date)
		} catch (e) {
			
		}
	}
    this.year = this.timeStamp.getFullYear()
    this.monthIndex = this.timeStamp.getMonth()
    this.day = this.timeStamp.getDate()
    this.hour = this.timeStamp.getHours()
    this.minute = this.hour < 10 ? '0' + this.hour : '' + this.hour
    this.minute = this.timeStamp.getMinutes()
    this.minute = this.minute < 10 ? '0' + this.minute : '' + this.minute
    this.updateCalendar()
    document.addEventListener('keydown', this.keyIsDown)
    document.addEventListener('click', this.documentClicked)
    this.setDate()
  },
  destroyed: function () {
    document.removeEventListener('keydown', this.keyIsDown)
    document.removeEventListener('click', this.documentClicked)
  },
  computed: {
    ports: {
      get: function () {
        let p = []
        if (this.portsHolder.length === 0) {
          for (let i = 0; i < 42; i++) {
            p.push('')
          }
        } else {
          p = this.portsHolder
        }
        return p
      },
      set: function (newValue) {
        this.portsHolder = newValue
      }
    },
    month () {
      return this.months[this.monthIndex]
    },
    dateTime () {
      return this.timeStamp.getFullYear() + '-' + (this.timeStamp.getMonth() + 1) + '-' + this.timeStamp.getUTCDay()
    },
    minutes () {
      let arr = []
      for (let i = 0; i < 60; i++) {
        i < 10 ? arr.push('0' + i) : arr.push('' + i)
      }
      return arr
    },
    hours () {
      let arr = []
      for (let i = 1; i <= 12; i++) {
        i < 10 ? arr.push('0' + i) : arr.push('' + i)
      }
      return arr
    },
    dateFormat () {
      let f = 'YYYY-MM-DD h:i:s'
      let allowedFormats = [
        'YYYY-MM-DD h:i:s', 'DD-MM-YYYY h:i:s', 'MM-DD-YYYY h:i:s',
        'YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY',
        'YYYY/MM/DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'h:i:s',
        'YYYY/MM/DD h:i:s', 'DD/MM/YYYY h:i:s', 'MM/DD/YYYY h:i:s'
      ]
      if (this.format) {
        f = this.format
      }
      if (allowedFormats.indexOf(f) < 0) {
        console.warn('Invalid date format supplied')
        return null
      } else {
        return f
      }
    },
    hideTime () {
      return this.dateFormat.indexOf('h:i:s') === -1
    },
    hideDate () {
      return this.dateFormat === 'h:i:s'
    }
  }
}
</script>

<style scoped>

  .year-month-wrapper{
    background-color: #ed4d00;
  }

  input{
    min-width: 226px;
    width:100%;
    height: 30px;
    padding: 3px;
    border: 1px solid #ddd;
  }
  .datetime-picker{
    position: relative;
  }
  .calender-div{
    width: 232px;
    box-shadow: 1px 2px 5px #ccc;
    position: absolute;
    display: inline-block;
    left: 0;
    top: 40px;
    color: #444;
    font-size: 14px;
    padding-bottom: 10px;
  }
  .port, .days{
    display: inline-block;
    width: 25px;
    height: 20px;
    padding: 3px;
    margin: 1px;
    text-align: center;
    vertical-align: top;
    cursor: pointer;
  }
  .days{
    color: #ed4d00;
    font-weight: bold;
  }
  .port:hover{
    color: #ed4d00;
    font-weight: bold;
  }
  .activePort, .activePort:hover {
    background-color: #ed4d00;
    color: white;
  }
  .month-setter, .year-setter{
    margin: 0 1px;
    width: 48.2%;
    color: white;
    font-weight: 900;
    display: inline-block;
  }
  .nav-l:hover, .nav-r:hover {
    background-color: #dc3c00;
  }
  .nav-l, .nav-r {
    display: inline-block;
    width: 25px;
    background-color: #ed4d00;
    color: white;
    font-size: 16px;
    cursor: pointer;
    border: 0;
    padding: 7px;
    margin:0;
  }
  .nav-l{
    float: left;
  }
  .nav-r{
    float: right;
  }
  .month, .year{
    width: 40px;
    text-align: right;
    display: inline-block;
    color: white;
    padding: 7px 0;
  }
  .headers>span{

  }
  .hour-selector, .minute-selector{
    width: 30px;
    display: inline-block;
    text-align: center;
    font-weight: bold;
    position: relative;
    cursor: pointer;
  }
  .time-separator{
    display: inline-block;
    font-weight: bold;
  }
  .time-picker{
    margin: 10px
  }
  .nav-t, .nav-d{
    font-weight: bold;
    cursor: pointer;
  }
  .scroll-hider {
    display: none;
    vertical-align:top;
    overflow:hidden;
    border:0;
    position: absolute;
    top: -40px;
    left: 0;
    box-shadow: 0 0 3px #333;
    background-color: white;
  }
  .scroll-hider ul {
    padding:5px;
    margin:-5px -13px -5px -5px;
    list-style-type: none;
    height: 100px;
    overflow: auto;
    width:55px;
    color: #999;
    overflow-x: hidden;
  }
  .showSelector{
    display:inline-block;
  }
  li.active{
    background-color: #ed4d00;
    color: white;
  }
  li{
    padding: 4px;
    font-size: 16px;
    width: 100%;
    cursor: pointer;
  }
  .time-picker{
    display: inline-block;
  }
  .noDisplay{
    display: none;
  }
  .okButton{
    color: #ed4d00;
    font-size: 15px;
    font-weight: bold;
    padding: 0;
    float: right;
    border: 0;
    margin-right: 10px;
    margin-top: 10px;
    cursor: pointer;
    background: transparent;
  }
</style>
