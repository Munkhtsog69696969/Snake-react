import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react'; 
import useInterval from "use-interval"

function App() {
  const [mapWidth,setMapWidth]=useState(null);
  const [smallIndex,setSmallIndex]=useState(null);
  const [snake,setSnake]=useState([{top:0,left:0} , {top:0 , left:40}]);
  const [direction,setDirection]=useState("right");
  const [foodEatenCount , setFoodEatenCount]=useState(0);
  const [foodCoordinate,setFoodCoordinate]=useState(null);

  const mapRef=useRef();

  useEffect(()=>{
    setMapWidth(mapRef.current.offsetWidth);
    setSmallIndex(mapRef.current.offsetWidth/10);
    setFoodCoordinate(generateFoodCoordinate(9,1));
  },[]);

  function generateFoodCoordinate(max,min){
    const foodX=Math.floor((Math.random()*(max-min)+min));
    const foodY=Math.floor((Math.random()*(max-min)+min));

    return {x:foodX , y:foodY};
  }

  const RenderFood=()=>{
    return(
      <div
       style={{
        width:smallIndex,
        height:smallIndex,
        backgroundColor:"red",
        position:"absolute",
        top:foodCoordinate?.y*smallIndex,
        left:foodCoordinate?.x*smallIndex
       }}
      >
      </div>
    )
  }

  useEffect(()=>{
    setFoodCoordinate(generateFoodCoordinate(9,1))
  },[foodEatenCount]);  

  useInterval(()=>{
    if(direction=="right"){
      if(snake.left<smallIndex*9){
        setSnake({top:snake.top , left:snake.left+smallIndex});
      }else{
        setSnake({top:snake.top , left:0-smallIndex})
      }
    }

    if(direction=="down"){
      if(snake.top<smallIndex*9){
        setSnake({left:snake.left , top:snake.top+smallIndex});
      }else{
        setSnake({left:snake.left , top:0-smallIndex});
      }
    }

    if(direction=="left"){
      if(0<=snake.left){
        setSnake({top:snake.top , left:snake.left-smallIndex});
      }else{
        setSnake({top:snake.top , left:smallIndex*9+smallIndex})
      }
    }

    if(direction=="up"){
      if(0<=snake.top){
        setSnake({left:snake.left , top:snake.top-smallIndex});
      }else{
        setSnake({left:snake.left , top:smallIndex*9+smallIndex})
      }
    }

    if(snake[0]?.top==foodCoordinate?.y*smallIndex && snake[0]?.left==foodCoordinate?.x*smallIndex){
      setFoodEatenCount(prev=>prev+1);
    }
  },500);

  useEffect(()=>{
    window.addEventListener("keydown",(e)=>{
      if(e.code=="ArrowRight" || e.code=="KeyD"){
        setDirection("right");
      }
      if(e.code=="ArrowDown" || e.code=="KeyS"){
        setDirection("down");
      }
      if(e.code=="ArrowLeft" || e.code=="KeyA"){
        setDirection("left");
      }
      if(e.code=="ArrowUp" || e.code=="KeyW"){
        setDirection("up");
      }
    })
  },[]);

  return (
    <div className="whole">
      <div ref={mapRef} className="map">
        {/* {
          snake && snake.map((snakeEl,i)=>{
            return(
              <div style={{
                width:smallIndex ,
                height:smallIndex ,
                backgroundColor:"black" , 
                position:"absolute" ,
                top:snakeEl.top ,
                left:snakeEl.left
              }}></div>
            )
          })
        } */}

        {
          RenderFood()
        }
      </div>
      <div className='scoreBoard'>
        <div>Score:{foodEatenCount}</div>
      </div>
    </div>
  );
}

export default App;
