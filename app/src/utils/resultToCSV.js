import * as d3 from 'd3-dsv';
import _keyBy from 'lodash-es/keyBy';

export default function resultToCSV(
    result,
    regionMode,
    regions,
    statistics,
    times,
    csvMode,
    idMode
) {
    if (!result) return 'no data';
    const data = [];
    console.log({ result, regionMode, regions, statistics });
    if (regionMode.substr(0, 4) === 'alle') {
    }
    function format(d) {
        return idMode === 'id' ? d.id : idMode === 'name' ? d.name : `${d.name} [${d.id}]`;
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
                        if (numStatistics > 1)
                            d.statistik = format({ id: stat.statistik, name: stat.statistikName });
                        d.merkmal = format({ id: stat.merkmal, name: stat.merkmalName });
                    }
                    if (stat.values.length > 1) {
                        d.gruppierung = format({ id: stat.arg, name: stat.argName });
                        d.gruppe = format({ id: row.type, name: argValueMap[row.type].name });
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
            const d = {};
            if (idMode === 'id' || idMode === 'both') d.ags = region.id;
            if (idMode === 'name' || idMode === 'both') d.region = region.name;
            statistics.forEach((stat, i) => {
                const argValueMap = _keyBy(stat.values, 'id');
                region[`s${i}`].forEach(row => {
                    const key = [];
                    if (statistics.length > 1) {
                        if (numStatistics > 1)
                            key.push(format({ id: stat.statistik, name: stat.statistikName }));
                        key.push(format({ id: stat.merkmal, name: stat.merkmalName }));
                    }
                    if (stat.values.length > 1) {
                        key.push(format({ id: row.type, name: argValueMap[row.type].name }));
                    }
                    if (times.length !== 1) {
                        key.push(key.length ? row.year : `y${row.year}`);
                    }
                    d[key.join('/')] = row.value;
                });
            });
            data.push(d);
        });
    } else {
        // csvMode === wideTime
        const yearSet = {};
        regionData.forEach(region => {
            statistics.forEach((stat, i) => {
                region[`s${i}`].forEach(row => {
                    if (!yearSet[row.year]) {
                        yearSet[row.year] = [];
                    }
                    yearSet[row.year].push({
                        ags: region.id,
                        region: region.name,
                        stat: stat,
                        ...row
                    });
                });
            });
        });
        Object.keys(yearSet)
            .sort()
            .forEach(year => {
                const d = {
                    jahr: year
                };
                yearSet[year].forEach(row => {
                    const argValueMap = _keyBy(row.stat.values, 'id');
                    const key = [];
                    if (regionData.length > 1) {
                        key.push(format({ id: row.ags, name: row.region }));
                    }
                    if (statistics.length > 1) {
                        if (numStatistics > 1)
                            key.push(
                                format({ id: row.stat.statistik, name: row.stat.statistikName })
                            );
                        key.push(format({ id: row.stat.merkmal, name: row.stat.merkmalName }));
                    }
                    if (row.stat.values.length > 1) {
                        key.push(format({ id: row.type, name: argValueMap[row.type].name }));
                    }
                    if (idMode === 'id' && regionData.length > 1 && key.length === 1) {
                        key[0] = `r${key[0]}`;
                    }
                    d[key.join('/')] = row.value;
                });
                data.push(d);
            });
    }
    return d3.csvFormat(data);
}
