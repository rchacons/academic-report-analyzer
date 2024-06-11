// GraphComponent.js
import { Box } from '@mui/material';
import { ResponsiveNetwork } from '@nivo/network';

const GraphComponent = ({ data, onNodeClick }) => {
  const nodes = [];
  const links = [];
  const nodeUrlMap = new Map();

  Object.keys(data.combinate_graph).forEach((centralNode) => {
    nodes.push({
      id: centralNode,
      label: centralNode,
      color: 'rgb(97, 205, 187)',
      size: 45,
      height: 1,
    });
    nodeUrlMap.set(centralNode, null); // No URL for central nodes

    data.combinate_graph[centralNode].forEach((item) => {
      if (item.predicate !== centralNode) {
        nodes.push({
          id: item.predicate,
          label: item.predicate,
          color: 'rgb(232, 193, 160)',
          size: 30,
          height: 1,
        });
        links.push({ source: centralNode, target: item.predicate, distance: 300 });
        nodeUrlMap.set(item.predicate, item.object); // Store URL for each node
      }
    });
  });

  const handleNodeClick = (node) => {
    const url = nodeUrlMap.get(node.id);
    if (url) {
      onNodeClick(url); // Call the parent function
    }
  };

  return (
    <Box sx={{ height: 800, width: 800, border: '1px solid blue' }}>
      <ResponsiveNetwork
        data={{ nodes, links }}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        centeringStrength={0.2}
        onClick={handleNodeClick}
        repulsivity={40}
        nodeSize={(n) => n.size}
        activeNodeSize={(n) => 1.5 * n.size}
        nodeColor={(e) => e.color}
        linkDistance={(e) => e.distance}
        nodeBorderWidth={1}
        nodeBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.8]],
        }}
        linkThickness={(n) => 2 + 2 * n.target.data.height}
        linkBlendMode="multiply"
        motionConfig="wobbly"
      />
    </Box>
  );
};

export default GraphComponent;
