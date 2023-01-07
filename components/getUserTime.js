export default function getUserTime(time) {
  let daysInMonth = new Date(
    time.split(' ')[0].split('.')[2],
    time.split(' ')[0].split('.')[1],
    0
  ).getDate()
  let min = +time.split(' ')[1].split(':')[1] - new Date().getTimezoneOffset()
  let hour = +time.split(' ')[1].split(':')[0] + Math.floor(min / 60)
  let day = +time.split(' ')[0].split('.')[0] + Math.floor(hour / 24)
  let month = +time.split(' ')[0].split('.')[1] + Math.floor(day / daysInMonth)
  let year = +time.split(' ')[0].split('.')[2] + Math.floor(month / 12)

  return `${day % daysInMonth}.${month % 12}.${year} ${hour % 24}:${min % 60}`
}
