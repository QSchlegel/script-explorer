<script setup>
import * as d3 from 'd3'
import { useRouter } from 'vue-router';
import { useGridStore } from '/stores/grid-store'
import { useNetStore } from '/stores/net-store';

const gridStore = useGridStore();
const netStore = useNetStore();

const router = useRouter();

const vh = ref(0)
const vw = ref(0)
const dark = ref(false)

onMounted(async () => {
    if (gridStore.graph.filter(f=> f.network === netStore.mode).length === 0) {
        const addrs = gridStore.addrListMem.filter(f=> f.network === netStore.mode).map(m => gridStore.loadItem(m.id, 'address'))
        const txs = gridStore.txListMem.filter(f=> f.network === netStore.mode).map(m => gridStore.loadItem(m.id, 'tx'))
        await Promise.all([addrs, txs]).then(setTimeout(() => { gridStore.generateGraph() }, 3000))
    }
    dark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    getViewport()
    window.addEventListener('resize', getViewport);
    watch(gridStore,
        () => { getViewport(); },
        { deep: true, immediate: true })


})
onUnmounted(() => {
    window.removeEventListener('resize', getViewport());
})



const getViewport = () => {
    d3.select('#grid').select('svg').remove()
    d3.select('#grid').append(() => generateGraph());
    vw.value = document.documentElement.clientWidth;
    vh.value = document.documentElement.clientHeight;
}


const generateGraph = () => {
    if (gridStore.graph.filter(f=> f.network === netStore.mode) === []) return
    const links = gridStore.graph.filter(f=> f.network === netStore.mode).map(d => Object.create(d));
    const nodes = Array.from(new Set(gridStore.graph.filter(f=> f.network === netStore.mode).flatMap(l => [l.source, l.target])), id => ({ id })).map(d => Object.create(d));
    const w = document.documentElement.clientWidth,
        h = document.documentElement.clientHeight -20,
        r = 15

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-30000))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    const svg = d3.create("svg")
        .attr("viewBox", [-w * 4, -h * 4, w * 8, h * 8 - r * 40])
        .style("font", "70px sans-serif");

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-width", 8)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", d => color(d.type))
        .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`)
        .attr("source", d => d.source.id)
        .attr("target", d => d.target.id);

    const colorizeNode = (id) => {
        var tmp = "#b0c1d1"
        if (id.slice(0, 4) === "addr") tmp = "#e8aa38"
        if (gridStore.addrList.filter((f) => f.id === id).length > 0) tmp = (dark.value)?"white":"black"
        if (gridStore.txList.filter((f) => f.id === id).length > 0) tmp = (dark.value)?"white":"black"
        return tmp
    }
    const nodeHoverIn = (d, i) => {
        d3.select(d.target.parentNode)
            .attr("fill", "green")
            .style("font", "90px sans-serif");
        d3.selectAll("[source='" + d.target.parentNode.id + "'],[target='" + d.target.parentNode.id + "']")
            .attr("stroke-width", 10)
    }
    const nodeHoverOut = (d, i) => {
        d3.select(d.target.parentNode)
            .attr("fill", (d) => colorizeNode(d.id))
            .style("font", "70px sans-serif");
        d3.selectAll("[source='" + d.target.parentNode.id + "'],[target='" + d.target.parentNode.id + "']")
            .attr("stroke-width", 8)
    }
    const nodeClick = (d, i) => {
        const tmp = d3.select(d.target.parentNode).data()[0].id
        router.push((tmp.slice(0, 4) === 'addr') ? '/addresses/' + tmp : '/transactions/' + tmp)
    }
    const node = svg.append("g")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("fill", (d) => colorizeNode(d.id))
        .attr("id", d => d.id)
        .on("mouseover", nodeHoverIn)
        .on("mouseout", nodeHoverOut)
        .on("click", nodeClick)
        .call(drag(simulation));

    // Per-type markers, as they don't inherit styles.
    svg.append("defs").selectAll("marker")
        .data(types)
        .join("marker")
        .attr("id", d => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -0.5)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", color)
        .attr("d", "M0,-5L10,0L0,5");

    node.append("circle")
        .attr("stroke", (dark.value)?"":"white")
        .attr("stroke-width", r / 2)
        .attr("r", r * 1.2);

    node.append("text")
        .attr("x", 30)
        .attr("y", "0.31em")
        .text(d => d.id.slice(0, 4) + "..." + d.id.slice(d.id.length - 5))
        .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke", (dark.value)?"":"white")
        .attr("stroke-width", 3)
        ;

    simulation.on("tick", () => {
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`)
            .attr("cx", (d) => { d.x = Math.min(w * 3.9 - r, Math.max(-w * 3.9, d.x)); })
            .attr("cy", (d) => { d.y = Math.min(h * 3.9 - r * 80, Math.max(-h * 3.9, d.y)); });

        
    });
    return svg.node();
}

const types = ['input', 'output']

const color = d3.scaleOrdinal(types, ["red", "#2564eb"])

const linkArc = (d) => {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
    M${d.target.x},${d.target.y}
    A${r},${r} 0 0,1 ${d.source.x},${d.source.y}
  `;
}
const drag = (simulation) => {
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}
</script>

<template>
    <div class="w-full bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 md:p-3">
        <div id="grid"></div>
    </div>
        


</template>