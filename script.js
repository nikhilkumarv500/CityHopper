onload = function () {
  const container = document.getElementById("container");
  const genNew = document.getElementById("generate-graph");

  const getShortestPath = document.getElementById("find-path");
  const path_container = document.getElementById("path-container");

  // const city_container = document.getElementById("cityContainer");
  var city_container = document.getElementById("cityContainer");

  const fromCity = document.getElementById("from-city");
  const toCity = document.getElementById("to-city");

  let global_graph;

  const options = {
    physics: true,

    edges: {
      labelHighlightBold: true,
      font: {
        size: 20,
      },
    },
    nodes: {
      font: "12px arial darkred",
      scaling: {
        label: true,
      },
      shape: "icon",
      icon: {
        face: "FontAwesome",
        code: "\uf015",
        size: 40,
        color: "#991133",
      },
    },
  };

  const network = new vis.Network(container);
  network.setOptions(options);

  const network2 = new vis.Network(path_container);
  network2.setOptions(options);

  function createData() {
    const cities = [
      "Bangalore",
      "Delhi",
      "Mumbai",
      "Gujarat",
      "Chandigarh",
      "Goa",
      "Kanpur",
      "Jammu",
      "Hyderabad",
      "Lucknow",
      "Chennai",
      "Meghalaya",
      "Patna",
      "Kochi",
      "Ahemedbad",
      "Agra",
      "Varanasi",
      "Jodhpur",
      "Jhansi",
      "Mathura",
    ];

     const V = Math.floor(Math.random() * cities.length) + 3;
    //const V = 20;

    let vertices = [];
    for (let i = 0; i < V; i++) {
      vertices.push({ id: i, label: cities[i - 1] });
    }

    let edges = [];
    for (let i = 1; i < V; i++) {
      for (let j = 1; j <= 2; j++) {
        let neigh = Math.floor(Math.random() * i);

        edges.push({
          from: i,
          to: neigh,
          color: "orange",
          label: String(Math.floor(Math.random() * 70) + 30),
        });
      }
    }

    const data = {
      nodes: vertices,
      edges: edges,
    };
    return data;
  }

  genNew.onclick = function () {
    let data = createData();
    network.setData(data);

    global_graph = data;

    let vert = data.nodes;
    var temp = "";

    for (let i = 1; i < vert.length; i++) {
      // console.log("ID:", vertices[i].id);
      // if (vert[i].label == "undefined") continue;
      temp +=
        "ID: " + vert[i].id.toString() + " City: " + vert[i].label + "<br/>";
      // console.log(temp);
    }

    city_container.innerHTML = temp;
  };

  function createShortestPath(src) {
    let vertex = global_graph.nodes;
    let edge = global_graph.edges;
    const V = vertex.length;

    let adj = [];
    for (let i = 0; i < V; i++) {
      adj.push([]);
    }

    for (let i = 0; i < edge.length; i++) {
      let source = edge[i].from;
      let dest = edge[i].to;
      let weight = parseInt(edge[i].label);

      adj[source].push([dest, weight]);
      adj[dest].push([source, weight]);
    }

    let vis = Array(V).fill(0);
    let dist = [];

    for (let i = 0; i < V; i++) {
      dist.push([100000, -1]);
    }

    dist[src][0] = 0;

    for (let i = 0; i < V - 1; i++) {
      let mn = -1;
      for (let j = 0; j < V; j++) {
        if (vis[j] === 0) {
          if (mn === -1 || dist[j][0] < dist[mn][0]) mn = j;
        }
      }

      vis[mn] = 1;
      for (let j = 0; j < adj[mn].length; j++) {
        let x = adj[mn][j];
        if (vis[x[0]] === 0 && dist[x[0]][0] > dist[mn][0] + x[1]) {
          dist[x[0]][0] = dist[mn][0] + x[1];
          dist[x[0]][1] = mn;
        }
      }
    }

    return dist;
  }

  function connectGraph(dist, node1, node2) {
    let vertex = global_graph.nodes;
    // let edge = global_graph.edges;

    let start = node2;
    let de = dist[node2][1];

    let edge = [];

    while (de != -1) {
      let wei = dist[start][0] - dist[de][0];

      edge.push({
        from: start,
        to: de,
        color: "orange",
        label: wei.toString(),
      });

      start = de;
      de = dist[start][1];
    }

    const data = {
      nodes: vertex,
      edges: edge,
    };
    return data;
  }

  function showShortestPath() {
    const node1 = fromCity.value;
    console.log("From City: ", node1);

    const node2 = toCity.value;
    console.log("From City: ", node2);

    let dist = createShortestPath(node1);
    console.log(dist);

    let data = connectGraph(dist, node1, node2);
    network2.setData(data);

    return;
  }

  getShortestPath.onclick = function () {
    showShortestPath();
  };

  genNew.click();
};
