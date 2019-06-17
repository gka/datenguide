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
    allRegions(page: 0) {
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

export function getYearsQuery(statistic, merkmal) {
    return buildRegionQuery(`years: ${merkmal}(statistic: R${statistic}) { year }`, ['10']);
}
