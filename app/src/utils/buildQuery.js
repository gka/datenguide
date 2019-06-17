export function buildRegionQuery(query, regionIds = [], ) {
    const regions = regionIds.map(id => {
        return `reg_${id}: region(id: "${id}") {
        id,
        name,
    ${query.split('\n').map(d => `    ${d}`).join('\n')}
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
    allRegions() {
        regions(${level<3 ? 'nuts:'+level : 'lau:'+(level-3)}${parentId ? `, parentId: "${parentId}"`: ''}) {
            id
            name
    ${query.split('\n').map(d => `        ${d}`).join('\n')}
        }
    }
}`;
}