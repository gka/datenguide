import allRegions from '../../data/ags.json';

export default function getRegions(filter) {
	return Object.keys(allRegions).map(id => {
        return {
            id,
            name: allRegions[id],
            display: `${allRegions[id]} <span style="color:#bbb">(${id})</span>`
        };
    }).filter(filter || (() => true));
}