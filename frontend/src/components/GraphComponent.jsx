import { ResponsiveNetwork } from '@nivo/network'

const GraphComponent = ({ rdfGraph, onNodeClick }) => {
  const nodes = []
  const links = []
  const nodeUrlMap = new Map()

  const combinateGraph = rdfGraph.combinate_graph

  // Pour chaque clé (concept principal) dans l'objet combinate_graph
  Object.keys(combinateGraph).forEach((centralNode) => {
    // Ajouter le noeud central si ce n'est pas déjà fait
    if (!nodeUrlMap.has(centralNode)) {
      nodes.push({
        id: centralNode,
        label: centralNode,
        color: 'rgb(97, 205, 187)',
        size: 45,
        height: 1,
      })
      nodeUrlMap.set(centralNode, null) // Pas d'URL pour les noeuds centraux
    }

    // Parcourir chaque élément associé au noeud central
    combinateGraph[centralNode].forEach((item) => {
      if (!nodeUrlMap.has(item.predicate)) {
        nodes.push({
          id: item.predicate,
          label: item.predicate,
          color: 'rgb(232, 193, 160)',
          size: 30,
          height: 1,
        })
        nodeUrlMap.set(item.predicate, item.object) // Associer l'URL à chaque noeud
      }
      links.push({ source: centralNode, target: item.predicate, distance: 150 })
    })
  })

  const handleNodeClick = (node) => {
    const url = nodeUrlMap.get(node.id)
    if (url) {
      onNodeClick(url)
    }
  }

  return (
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
    />
  )
}

export default GraphComponent
