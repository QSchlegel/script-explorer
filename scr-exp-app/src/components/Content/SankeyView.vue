
<script setup>
import * as d3 from "d3"
import * as d3Sankey from "d3-sankey"
import { useGraphStore } from 'stores/graph-store';
import { useTxStore } from 'stores/tx-store';
import { onMounted, onUpdated } from "vue";

const txStore = useTxStore()
const graphStore = useGraphStore();

//color groups
const cg = [['ada', "#4b855e"], ['unit', "#ded09e"], ['inaddr', "#0130a7"], ['inutxo', "#87a4ed"],
['oututxo', "#f5e1e7"], ['outaddr', "#eb7a89"], ['burn', "#f70202"], ['mint', "#07fc03"],
['collateral', "#9022f7"], ['fee', "#f72274"], ['iutil', "#b5dde8"], ['outil', "#b5dde8"]]

const props = defineProps({
    graphtype: String,
    graphId: String
})

onMounted( async() => {
    sankeyGraphId()
})

onUpdated(async () => {
    sankeyGraphId()
})

const makeLabel = (d) => {
    const type = d.id.split('_')[0]
    const str = d.id.split('_').pop()
    if (type === 'inaddr' || type === 'outaddr') return str.slice(0, 14) + '...' + str.slice(str.length - 5);
    if (type === 'inutxo' || type === 'oututxo') return str.slice(0, 5) + '...' + str.slice(str.length - 8);
    if (type === 'ada') return '₳'
    if (type === 'unit') return str.slice(0, 5) + '...' + str.slice(str.length - 5)
    return d.id.split('_').pop()
}

const sankeyGraphId = async()  => {
    if (props.graphtype !== null) {
        var graph = []
        if (props.graphtype === 'address') {
            graphStore.createAddressGraph(props.graphId);
            graph = graphStore.addressGraphList.filter((f) => f.address === props.graphId)[0];
        }
        if (props.graphtype === 'utxo') {
            graphStore.createUtxoGraph(props.graphId);
            graph = graphStore.utxoGraphList.filter((f) => f.utxo === props.graphId)[0]
        }
        if (props.graphtype === 'tx') {
            await txStore.loadUtxos(props.graphId)
            graphStore.createTxGraph(props.graphId);
            graph = graphStore.txGraphList.filter((f) => f.id === props.graphId)[0];
        }
        if (graph !== undefined && graph.links !== undefined && graph.links.length > 0) {
            const chart = SankeyChart({
                links: graph.links
            }, {
                nodeGroup: d => d.id.split('_')[0],
                nodeLabel: d => makeLabel(d),
                align: "justify",
                linkColor: "source-target",
                format: (f => d => `${f(d)}`)(d3.format(",.1~f")),
                width: graph.width,
                height: graph.height,
                nodeGroups: cg.map((m) => m[0]),
                colors: cg.map((m) => m[1])
            })
            d3.select('#sk' + props.graphId).select('svg').remove()
            d3.select('#sk' + props.graphId).append(() => chart);
        }
    }
}

const SankeyChart = ({
    nodes, // an iterable of node objects (typically [{id}, …]); implied by links if missing
    links // an iterable of link objects (typically [{source, target}, …])
}, {
    format = ",", // a function or format specifier for values in titles
    align = "justify", // convenience shorthand for nodeAlign
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeLabel, // given d in (computed) nodes, text to label the associated rect
    nodeTitle = d => `${d.id}\n${format(d.value)}`, // given d in (computed) nodes, hover text
    nodeAlign = align, // Sankey node alignment strategy: left, right, justify, center
    nodeWidth = 15, // width of node rects
    nodePadding = 18, // vertical separation between adjacent nodes
    nodeLabelPadding = 6, // horizontal separation between node and label
    nodeStroke = "currentColor", // stroke around node rects
    nodeStrokeWidth, // width of stroke around node rects, in pixels
    nodeStrokeOpacity, // opacity of stroke around node rects
    nodeStrokeLinejoin, // line join for stroke around node rects
    linkSource = ({ source }) => source, // given d in links, returns a node identifier string
    linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
    linkValue = ({ value }) => value, // given d in links, returns the quantitative value
    linkPath = d3Sankey.sankeyLinkHorizontal(), // given d in (computed) links, returns the SVG path
    linkTitle = d => `${d.source.id} → ${d.target.id}\n${format(d.value)}`, // given d in (computed) links
    linkColor = "source-target", // source, target, source-target, or static color
    linkStrokeOpacity = 0.5, // link stroke opacity
    linkMixBlendMode = "multiply", // link blending mode
    colors = d3.schemeTableau10, // array of colors
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    marginTop = 10, // top margin, in pixels
    marginRight = 1, // right margin, in pixels
    marginBottom = 10, // bottom margin, in pixels
    marginLeft = 1, // left margin, in pixels
} = {}) => {
    // Convert nodeAlign from a name to a function (since d3-sankey is not part of core d3).
    if (typeof nodeAlign !== "function") nodeAlign = {
        left: d3Sankey.sankeyLeft,
        right: d3Sankey.sankeyRight,
        center: d3Sankey.sankeyCenter
    }[nodeAlign] ?? d3Sankey.sankeyJustify;

    // Compute values.
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    const LV = d3.map(links, linkValue);
    if (nodes === undefined) nodes = Array.from(d3.union(LS, LT), id => ({ id }));
    const N = d3.map(nodes, nodeId).map(intern);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);

    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({ id: N[i] }));
    links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i], value: LV[i] }));

    // Ignore a group-based linkColor option if no groups are specified.
    if (!G && ["source", "target", "source-target"].includes(linkColor)) linkColor = "currentColor";

    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = G;

    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    // Compute the Sankey layout.
    d3Sankey.sankey()
        .nodeId(({ index: i }) => N[i])
        .nodeAlign(nodeAlign)
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .extent([[marginLeft, marginTop], [width - marginRight, height - marginBottom]])({ nodes, links });

    // Compute titles and labels using layout nodes, so as to access aggregate values.
    if (typeof format !== "function") format = d3.format(format);
    const Tl = nodeLabel === undefined ? N : nodeLabel == null ? null : d3.map(nodes, nodeLabel);
    const Tt = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const Lt = linkTitle == null ? null : d3.map(links, linkTitle);

    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const node = svg.append("g")
        .attr("stroke", nodeStroke)
        .attr("stroke-width", nodeStrokeWidth)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-linejoin", nodeStrokeLinejoin)
        .selectAll("rect")
        .data(nodes)
        .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0);

    if (G) node.attr("fill", ({ index: i }) => color(G[i]));
    if (Tt) node.append("title").text(({ index: i }) => Tt[i]);

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", linkStrokeOpacity)
        .selectAll("g")
        .data(links)
        .join("g")
        .style("mix-blend-mode", linkMixBlendMode);

    if (linkColor === "source-target") link.append("linearGradient")
        .attr("id", d => `${uid}-link-${d.index}`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => d.source.x1)
        .attr("x2", d => d.target.x0)
        .call(gradient => gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", ({ source: { index: i } }) => color(G[i])))
        .call(gradient => gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", ({ target: { index: i } }) => color(G[i])));

    link.append("path")
        .attr("d", linkPath)
        .attr("stroke", linkColor === "source-target" ? ({ index: i }) => `url(#${uid}-link-${i})`
            : linkColor === "source" ? ({ source: { index: i } }) => color(G[i])
                : linkColor === "target" ? ({ target: { index: i } }) => color(G[i])
                    : linkColor)
        .attr("stroke-width", ({ width }) => Math.max(1, width))
        .call(Lt ? path => path.append("title").text(({ index: i }) => Lt[i]) : () => { });

    if (Tl) svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 14)
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + nodeLabelPadding : d.x0 - nodeLabelPadding)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(({ index: i }) => Tl[i]);

    function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    return Object.assign(svg.node(), { scales: { color } });
}


</script>

<template>

    <div :id="'sk' + props.graphId"></div>

</template>