<script setup>
import * as d3 from "d3"
import { useGraphStore } from 'stores/graph-store';
import { useTxStore } from 'stores/tx-store';
import { onMounted, onUpdated } from "vue";

const txStore = useTxStore()
const graphStore = useGraphStore();

const props = defineProps({
    graphtype: String,
    graphId: String
})

onMounted(async () => {
    await txStore.loadUtxos(props.graphId)
    generateChart()
})

onUpdated(async () => {
    await txStore.loadUtxos(props.graphId)
    generateChart()
})

const generateChart = () => {
    d3.select('#chord' + props.graphId).select('svg').remove()
    d3.select('#chord' + props.graphId).append(() => chart());
}

const chart = () => {
    const width = 5000
    const height = width
    const innerRadius = Math.min(width, height) * 0.5 - 300
    const outerRadius = innerRadius + 100

    const data = () => {
        graphStore.createTxGraph(props.graphId)
        return graphStore.txGraphList.filter((f) => f.id === props.graphId)[0];
    }

    const names = Array.from(new Set(data().links.flatMap(d => [d.source, d.target]))).sort(d3.ascending)


    const chord = d3.chordDirected()
        .padAngle(50 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending);


    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    const ribbon = d3.ribbonArrow()
        .radius(innerRadius - 50)
        .padAngle(20 / innerRadius)
        .headRadius(100)

    const cg = [['ada', "#4b855e"], ['unit', "#ded09e"], ['inaddr', "#0130a7"], ['inutxo', "#87a4ed"],
    ['oututxo', "#f5e1e7"], ['outaddr', "#eb7a89"], ['burn', "#f70202"], ['mint', "#07fc03"],
    ['collateral', "#9022f7"], ['fee', "#f72274"], ['iutil', "#b5dde8"], ['outil', "#b5dde8"]]

    const color = d3.scaleOrdinal(cg.map((m) => m[0]), cg.map((m) => m[1]))
    const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);
    const matrix = () => {
        const index = new Map(names.map((name, i) => [name, i]));
        const matrix = Array.from(index, () => new Array(names.length).fill(0));
        for (const { source, target, value } of data().links) matrix[index.get(source)][index.get(target)] += value;
        return matrix;
    }
    const nodeHoverIn = (d, i) => {
        d3.select(d.target)
            .attr("fill-opacity", "1");
        hoverText(d3.select(d.target.parentNode).select('title').text())
    }

    const nodeHoverOut = (d, i) => {
        d3.select(d.target)
            .attr("fill-opacity", 0.6);
        d3.select("#ChordHover-" + props.graphId)
            .remove();
    }
    const hoverText = (txt) => {
        svg.append("text")
            .attr("x", -width / 2)
            .attr("y", height / 2)
            .attr("font-size", "100px")
            .attr("id", "ChordHover-" + props.graphId)
            .text(txt);
    }
    const makeTitle = (id) => {
        const type = names[id].split('_')[0]
        if (type.includes('utxo')) return shortenText(names[id].split('_')[1])
        if (type.includes('addr')) return shortenText(names[id].split('_')[2])
        return names[id].split('_')[1]
    }
    const shortenText = (txt) => {
        return txt.slice(0, 10) + '...' + txt.slice(txt.length - 10)
    }

    const chords = chord(matrix());
    const group = svg.append("g")
        .selectAll("g")
        .data(chords.groups)
        .join("g");
    group.append("path")
        .attr("fill", d => color(names[d.index].split('_')[0]))
        .attr("d", arc).attr("fill-opacity", 0.6)
        .on("mouseover", nodeHoverIn)
        .on("mouseout", nodeHoverOut);

    group.append("title")
        .text(d => makeTitle(d.index));


    svg.append("g")
        .attr("fill-opacity", 0.6)
        .selectAll("path")
        .data(chords)
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("fill", d => color(names[d.target.index].split('_')[0]))
        .attr("d", ribbon)
        .on("mouseover", nodeHoverIn)
        .on("mouseout", nodeHoverOut)
        .append("title")
        .text(d => `${makeTitle(d.source.index)} → ${makeTitle(d.target.index)}`);

    return svg.node();
}


</script>

<template>
    <div :id="'chord' + props.graphId"></div>

</template>