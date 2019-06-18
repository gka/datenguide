export function buildRegionQuery(query, regionIds = []) {
    const regions = regionIds.map(id => {
        return `reg_${id}: region(id: "${id}") {
        id,
        name,
${query}
    }`;
    });
    return `query RegionsQuery {
    ${regions.join('\n    ')}
}`;
}

/**
 * @param {number} level - 1=Bundesland, 2=Regierungsbez., 3=Landkreise, 4=Verwaltungsgemeinschaft, 5=Gemeinde
 * @param {string} parentID - AGS of parent region (optional)
 */
export function buildAllRegionsQuery(query, level, parentId = null) {
    return `query AllRegionsQuery {
    allRegions(page: 0, itemsPerPage: 50) {
        page,
        total,
        itemsPerPage,
        regions(${level < 4 ? 'nuts:' + level : 'lau:' + (level - 3)}${
        parentId ? `, parent: "${parentId}"` : ''
    }) {
            id
            name
    ${query
        .split('\n')
        .map(d => `        ${d}`)
        .join('\n')}
        }
    }
}`;
}

export function buildStatQuery(statistics, timesMode, times) {
    return statistics.length
        ? statistics
              .map((stat, i) => {
                  return `s${i}: ${stat.merkmal}(statistics: R${stat.statistik}${
                      stat.arg
                          ? `, filter: { ${stat.arg}: { in: ["${stat.values
                                .map(d => d.id)
                                .join('", "')}"]} }`
                          : ''
                  }${timesMode !== 'all' ? `, year: [${times.join(', ')}]` : ''}) {
        ${stat.arg ? `type: ${stat.arg}` : ''}
        year
        value
}`;
              })
              .join('\n')
        : '';
}

export function getYearsQuery(statistic, merkmal) {
    return buildRegionQuery(`years: ${merkmal}(statistic: R${statistic}) { year }`, ['10']);
}
