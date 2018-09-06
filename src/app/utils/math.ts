export function sum(values: number[]) {
  return values.reduce((previous, current) => current += previous);
}

export function mean(values: number[]) {
  return sum(values) / values.length;
}

export function std(values: number[]) {
  const m = mean(values);
  const x = values.map(val => Math.pow(val - m, 2));
  return Math.sqrt(sum(x) / x.length);
}

export function calculateAggregationValues(values: number[], numBins: number) {
  values = values.filter(v => v !== 0.0);

  const hist = {data: new Array<number>(numBins).fill(0), labels: []};
  const min = Math.min(...values);
  const max = Math.max(...values);
  const _mean = mean(values);
  const _std = std(values);

  const binRange = (max - min) / numBins;
  const bins: number[] = [];

  for (let i = 0; i < numBins + 1; i++) {
    bins.push(min + (i * binRange));
  }

  for (const val of values) {
    for (let i = 1; i < bins.length; i++) {
      if (val <= bins[i]) {
        hist.data[i - 1] += 1;
        break;
      }
    }
  }

  const fraction = binRange > 10 ? 0 : 1;
  for (let i = 0; i < bins.length - 1; i++) {
    hist.labels.push(Number(bins[i].toFixed(fraction)) + '-' + Number(bins[i + 1].toFixed(fraction)));
  }

  return {
    hist: hist,
    min: Number(min.toFixed(3)),
    max: Number(max.toFixed(3)),
    mean: Number(_mean.toFixed(3)),
    std: Number(_std.toFixed(3))};
}
