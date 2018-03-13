import React, { Component } from 'react';
import './App.css';

class App extends React.Component {
  state = {
    height: 30,
    width: 50,
    speed: 200,
    grid: null,
    generation: 0
  }

  componentWillMount(){
    if(this.state.grid === null){
      let grid = Array(this.state.height).fill().map(()=>Array(this.state.width).fill(false));
      this.setState({grid});
    }   
  }

  componentDidMount(){
    this.seed();
    this.playButton();
  }

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.state.speed);
  }

  pauseButton = () => {
    clearInterval(this.intervalId);
  }

  clearButton = () => {
    const grid = [...this.state.grid];

    clearInterval(this.intervalId);

    grid.forEach((el,y,arr)=> el.forEach((e,x)=> {
      arr[y][x] = false;
      this.refs[`y${y}x${x}`].style.backgroundColor = "transparent";
    }));

    this.setState({
      grid: grid,
      generation: 0
    })
  }

  seed = () => {
    const grid = [...this.state.grid] 
    for(let y=0; y<grid.length; y++){
      for(let x =0; x<grid[y].length; x++){
        if(Math.floor(Math.random() * 4) === 1) {
          grid[y][x] = true;
          this.refs[`y${y}x${x}`].style.backgroundColor = "green";
        }
      }
    }
    this.setState({grid});
  }

  play = () => {
    let g = this.state.grid;
    let grid = [...this.state.grid];

    for (let y = 0; y < this.state.height; y++) {
      for (let x = 0; x < this.state.width; x++) {

        let count = 0;

        if (y > 0) if (g[y - 1][x]) count++;
        if (y > 0 && x > 0) if (g[y - 1][x - 1]) count++;
        if (y > 0 && x < this.state.width - 1) if (g[y - 1][x + 1]) count++;
        if (x < this.state.width - 1) if (g[y][x + 1]) count++;
        if (x > 0) if (g[y][x - 1]) count++;
        if (y < this.state.height - 1) if (g[y + 1][x]) count++;
        if (y < this.state.height - 1 && x > 0) if (g[y + 1][x - 1]) count++;
        if (y < this.state.height - 1 && this.state.width - 1) if (g[y + 1][x + 1]) count++;

        if (g[y][x] && (count < 2 || count > 3)) {
          grid[y][x] = false;
          this.refs[`y${y}x${x}`].style.backgroundColor = "transparent";
        }
        if (!g[y][x] && count === 3){
          grid[y][x] = true;
          this.refs[`y${y}x${x}`].style.backgroundColor = "green";
        } 
      }
    }
    if(this.state.grid.every(el=>el.every(e=> e === false))){  
      this.clearButton();
      alert('All cells are dead, add some alive cells to play');
      
    } else {
      this.setState({
        grid: grid,
        generation: this.state.generation+1
      });
    }
  }

  playerClicked = (e) => {
    let grid = [...this.state.grid];
    let coord = e.target.id.split(/[a-z]/).filter(el=>el !== "").map(e=>parseInt(e));

    if(grid[coord[0]][coord[1]] === false){
      grid[coord[0]][coord[1]] = true;
      e.target.style.backgroundColor = 'green';
      this.setState({grid});
     }
  }

  boardSizeChange = (w,h) => {
    this.clearButton();
    let grid = Array(h).fill().map(()=>Array(w).fill(false));
    this.setState({
      height: h,
      width: w,
      grid: grid
    });
  }

  speedChange = (speed) => {
    if(this.state.generation > 0){
      this.setState({speed},()=>this.playButton())
    }
    else {
      this.setState({speed});
    }
  }
    
  render() {  

    let grid = (
      <tbody onClick={(event)=>this.playerClicked(event)}>
        {this.state.grid.map((el,i,arr)=> <tr key={'y'+i}>{arr[i].map((e,idx)=><td className="cell" key={'x'+idx} id={'y'+i + 'x' +idx} ref={'y'+i + 'x' +idx}></td>)}</tr>)}
      </tbody>
    );

    return (
      <div className="container justify-content-center">
        <h1 className="display-1 text-center">Game of Life</h1>
        <div className="d-flex justify-content-center">
          <h4>Controls:</h4>
            <button onClick={()=>this.playButton()} className="btn">Start</button>
            <button onClick={()=>this.pauseButton()} className="btn">Pause</button>
            <button onClick={()=>this.clearButton()} className="btn">Clear</button>
            <button onClick={()=>this.seed()} className="btn">Seed</button>
        </div>
          <table className="board">
            {grid}
          </table>
          <h3 className="text-center">Generation: {this.state.generation}</h3>
          <div className="grid-size-config d-flex justify-content-center">
            <h4>Board Size:</h4>
            <button onClick={()=>this.boardSizeChange(50,30)} className="btn">50x30</button>
            <button onClick={()=>this.boardSizeChange(70,50)} className="btn">70x50</button>
            <button onClick={()=>this.boardSizeChange(100,80)} className="btn">100x80</button>
          </div>
          <div className="d-flex justify-content-center">
            <h4>Sim Speed:</h4>
            <button onClick={()=>this.speedChange(300)} className="btn">Slow</button>
            <button onClick={()=>this.speedChange(200)} className="btn">Medium</button>
            <button onClick={()=>this.speedChange(100)} className="btn">Fast</button>
          </div>
      </div>
      
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));