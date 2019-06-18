import * as d3 from 'd3-dsv';
import _keyBy from 'lodash-es/keyBy';

export default function resultToCSV(result, regionMode, regions, statistics, times, csvMode) {
    if (!result) return 'no data';
    const data = [];
    console.log({ result, regionMode, regions, statistics });
    if (regionMode.substr(0, 4) === 'alle') {
    }
    const statsById = _keyBy(statistics, 'statistik');
    const numStatistics = Object.keys(statsById).length;
    const regionData =
        regionMode === 'region'
            ? regions.map(r => result[`reg_${r.id}`])
            : result.allRegions.regions;
    if (csvMode === 'long') {
        regionData.forEach(region => {
            statistics.forEach((stat, i) => {
                const argValueMap = _keyBy(stat.values, 'id');
                region[`s${i}`].forEach(row => {
                    const d = {};
                    if (regionData.length > 1) {
                        d.ags = region.id;
                        d.region = region.name;
                    }
                    if (statistics.length > 1) {
                        if (numStatistics > 1) d.statistik = stat.statistikName;
                        d.merkmal = stat.merkmalName;
                    }
                    if (stat.values.length > 1) {
                        d.gruppierung = stat.argName;
                        d.gruppe = argValueMap[row.type].name;
                    }
                    if (times.length !== 1) {
                        d.jahr = row.year;
                    }
                    d.wert = row.value;
                    data.push(d);
                });
            });
        });
    } else if (csvMode === 'wideRegion') {
        regionData.forEach(region => {
            const d = {
                ags: region.id,
                region: region.name
            };
            statistics.forEach((stat, i) => {
                const argValueMap = _keyBy(stat.values, 'id');
                region[`s${i}`].forEach(row => {
                    const key = [];
                    if (statistics.length > 1) {
                        if (numStatistics > 1) key.push(stat.statistikName);
                        key.push(stat.merkmalName);
                    }
                    if (stat.values.length > 1) {
                        key.push(argValueMap[row.type].name);
                    }
                    if (times.length !== 1) {
                        key.push(row.year);
                    }
                    d[key.join('/')] = row.value;
                });
            });
            data.push(d);
        });
    } else {
        // csvMode === wideTime
    }
    return d3.csvFormat(data);
}
