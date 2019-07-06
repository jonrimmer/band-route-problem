import { selectData, selectMethod, runBtn } from './ui.js';
import { loadPoints, renderPoints } from './points.js';
import { renderRoute, setMethod, clearRoute } from './route.js';
selectData.addEventListener('change', async () => {
    await loadPoints(selectData.value);
    renderPoints();
    clearRoute();
});
selectMethod.addEventListener('change', async () => {
    setMethod(selectMethod.value);
});
async function load() {
    await loadPoints(selectData.value);
    renderPoints();
    setMethod(selectMethod.value);
}
load();
runBtn.addEventListener('click', () => {
    renderRoute();
});
