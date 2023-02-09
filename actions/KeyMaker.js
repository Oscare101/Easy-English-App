export default function KeyMaker(partKey = '') {
  let days = new Date().getUTCDate().toString()
  let months = (new Date().getUTCMonth() + 1).toString()
  let hours = new Date().getUTCHours().toString()
  let minuts = new Date().getUTCMinutes().toString()
  let seconds = new Date().getUTCSeconds().toString()
  let miliDeconds = new Date().getUTCMilliseconds().toString()
  let key = `${days.length == 1 ? '0' + days : days},${
    months.length == 1 ? '0' + months : months
  },${new Date().getUTCFullYear()}_${hours.length == 1 ? '0' + hours : hours}:${
    minuts.length == 1 ? '0' + minuts : minuts
  }:${seconds.length == 1 ? '0' + seconds : seconds}:${
    miliDeconds.length == 2 ? '0' + miliDeconds : miliDeconds
  } ${partKey.replace('.', ',')}`
  return key
}
