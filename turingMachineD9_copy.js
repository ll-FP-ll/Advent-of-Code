const prepareDP = pointer =>
  pointer
    .toString()
    .padStart(5, "0")
    .match(/(\d)(\d)(\d)(\d\d)/u)
    .splice(1)
    .map(Number)
    .reverse();

function getParameter(mode, num, rB, band, pos) {
  switch (mode) {
    case 0:
      return band[band[pos + num]];
      break;
    case 1:
      return band[pos + num];
      break;
    case 2:
      return rB + band[pos + num];
      break;
  }
}

function* turingCode(band, pos, relativeBase, resultArr) {
  while (pos < band.length && band[pos] !== 99) {
    let [op, ...mode] = prepareDP(band[pos]);
    let par1 = getParameter(mode[0], 1, relativeBase, band, pos);
    let par2 = getParameter(mode[1], 2, relativeBase, band, pos);
    let par3 = mode[2] === 2 ? rB + band[pos + 3] : band[pos + 3];
    console.log(`Position: ${pos}/${band[pos]} - OP: ${op}`);
    switch (op) {
      case 99:
        console.log(`99`);
        yield 99;
      case 1:
        band.splice(par3, 1, par1 + par2);
        pos += 4;
        break;
      case 2:
        band.splice(par3, 1, par1 * par2);
        pos += 4;
        break;
      case 3:
        let inp = yield;
        console.log(`Input: ${inp}`);
        let three = mode[0] === 2 ? relativeBase+band[pos+1] : band[pos+1]
        band.splice(three, 1, inp);
        pos += 2;
        break;
      case 4:
        console.log(relativeBase)
        const four =  mode[0] === 2 ? band[relativeBase+band[pos+1]] : band[pos+1]
        const result = [four, pos + 2, relativeBase];
        console.log(`Output: ${result[0]}`);
        resultArr.push(four)
        //yield result;
        pos += 2;
        break;
      case 5:
        par1 !== 0 ? (pos = par2) : (pos += 3);

        break;
      case 6:
        console.log(`${par1} | ${par2} | ${par3}\n${relativeBase}`)
        par1 === 0 ? (pos = par2) : (pos += 3);
        break;
        case 7:
          par1 < par2
            ? band.splice(band[pos + 3], 1, 1)
            : band.splice(band[pos + 3], 1, 0);
          pos += 4;
          break;
        case 8:
          par1 === par2
            ? band.splice(band[pos + 3], 1, 1)
            : band.splice(band[pos + 3], 1, 0);
          pos += 4;
          break;
      case 9:
        relativeBase += par1;
        pos += 2;
        break;
    }
  }
}

function TuringMachine(data) {
  (this.band = data), (this.position = 0);
  this.relativeBase = 0;
}

TuringMachine.prototype.run = function(input) {
  let band = this.band;
  let pos = this.position;
  let base = this.relativeBase;
  console.log(`Pos: ${pos}`);
  let result;
  let resultArr = [];
  let op = turingCode(band, pos, base, resultArr);
  let done = op.next().done;
  /*if (done) {
    return resultArr;
  }
  if (Array.isArray(input)) {
    op.next(input[0]);
    result = op.next(input[1]).value;
  } else {
    result = op.next(input).value;
  }
  this.relativeBase = result[2];
  this.position = result[1] !== undefined ? result[1] : 0;*/

  return resultArr;
};