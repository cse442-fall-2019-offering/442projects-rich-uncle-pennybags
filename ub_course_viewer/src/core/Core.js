import 'bootstrap/dist/css/bootstrap.min.css';
import React,{Component} from 'react';
import '../App.css';
import Tree from 'react-tree-graph';
import Graph from 'react-graph-vis';
import '../../node_modules/vis-network/styles/vis-network.css';

class Core extends Component{
  state = {
    rootCourse:{},
    viewGraph:{},
	rootIndex: 0
  }

	findNodes = (courseList,rootCourse) => {
		let nodeList = [];
		for ( let index = 0; index < courseList.length; index++){
			let newNode = {id:index+1, label: courseList[index].code, title: courseList[index].title};
			nodeList.push(newNode);
		}
		for ( let index = 0; index < rootCourse.associated_topics.length; index++){
			console.log(this.props.topicList[index]);
			var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
			let newNode = {id:1000+rootCourse.associated_topics[index], label:this.props.topicList[rootCourse.associated_topics[index]].topic_desc, title: rootCourse.title, color:randomColor};
			nodeList.push(newNode);
		}
		return nodeList;
	}

	findRootIndex = (rootCourse, courseList) => {
		for ( let index = 0; index < courseList.length; index++){
			if(rootCourse.code==courseList[index].code) return index+1;
		}
		return 0;
	}

	checkCourses = (base, other) => {
		for(let index = 0; index < base.associated_topics.length; index++){
			if(other.associated_topics.includes(base.associated_topics[index])) return true;
		}
		return false;
	}

	findCode = (course) => {
		return parseInt(course.code.split(" ")[1]);
	}

	findEdges = (rootCourse, courseList) => {
		let edgeList = [];
		let nodeList = [];
		let nodeSet = [];
		if(rootCourse.code == undefined) return [];
//		let fromIndex = this.findRootIndex(rootCourse,courseList);
		let fromIndex = this.findCode(rootCourse);
		for(let topicIndex = 0; topicIndex < rootCourse.associated_topics.length; topicIndex++){
			for (let index = 0; index < courseList.length; index++){
				if(courseList[index].associated_topics.includes(rootCourse.associated_topics[topicIndex])){
					let courseCode = this.findCode(courseList[index]);
					let newEdge = {from:courseCode, to:1000+rootCourse.associated_topics[topicIndex]};
					if(!nodeSet.includes(courseCode)){
						nodeSet.push(courseCode);
						let newNode = {id:courseCode, label: courseList[index].code, title: courseList[index].title};
						nodeList.push(newNode);
					}
					edgeList.push(newEdge);
				}
			}
		}
		console.log(rootCourse.associated_topics);
		for ( let index = 0; index < rootCourse.associated_topics.length; index++){
			console.log(rootCourse.associated_topics[index]);
                        console.log(this.props.topicList[rootCourse.associated_topics[index]-1].topic_desc);
                        var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
                        let newNode = {id:1000+rootCourse.associated_topics[index], label:this.props.topicList[rootCourse.associated_topics[index]-1].topic_desc, title: rootCourse.title, color:randomColor};
                        nodeList.push(newNode);
                }
		return {nodes:nodeList,edges:edgeList};
	}

	createGraph = (rootCourse, courseList) => {
		try{
//			let graph = { nodes: this.findNodes(courseList,rootCourse), edges: this.findEdges(rootCourse,courseList) };
			let graph = this.findEdges(rootCourse,courseList);
			return graph;
		}
		catch (e) {
			console.log(e);
		}
		return {nodes:[], edges:[]};
	}

  constructor(props){
    super(props);
    this.setState({rootCourse: this.props.selectedCourse});
  }

  render = () =>{
    return (
      <div className="TreeDiv">
		<Graph
		  graph={this.createGraph(this.props.selectedCourse,this.props.courseList)}
		  options={{layout: {hierarchical: false}, edges: {color: "#000000"}, height: "750px"}}
		  events={{select: function(event) {var { nodes, edges } = event}}}
		  getNetwork={network => {
			//  if you want access to vis.js network api you can set the state in a parent component using this property
		  }}
		/>
      </div>
      );
  }
}

export default Core;
